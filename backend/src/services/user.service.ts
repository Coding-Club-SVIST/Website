import prisma from "../config/database";
import { CreateUserDTO, UpdateUserDTO, UserWithRelations } from "../types";
import { UserRole } from "@prisma/client";
import logger from "../utils/logger";
import {
  notifyNewUserSignup,
  notifyUserApproved,
  notifyUserRejected,
} from "../lib/notifications/index";

export class UserService {
  static async findByGithubId(
    githubId: string
  ): Promise<UserWithRelations | null> {
    const user = await prisma.user.findUnique({
      where: { githubId },
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
    });

    return user as unknown as UserWithRelations | null;
  }

  static async findById(id: number): Promise<UserWithRelations | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
    });

    return user as unknown as UserWithRelations | null;
  }

  static async create(data: CreateUserDTO): Promise<UserWithRelations> {
    const user = await prisma.user.create({
      data,
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
    });

    // Notify admins about new user signup
    await notifyNewUserSignup({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    });

    return user as unknown as UserWithRelations;
  }

  static async update(id: number, data: any): Promise<UserWithRelations> {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
    });

    return user as unknown as UserWithRelations;
  }

  /**
   * Update user role and status, triggering approval notifications if relevant
   */
  static async updateRole(
    id: number,
    role: UserRole,
    customRoleId?: number | null,
    reason?: string
  ): Promise<UserWithRelations> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const updateData: any = {
      role,
      isActive: role !== UserRole.SUSPENDED && role !== UserRole.PENDING,
    };

    // Set suspension reason if suspending
    if (role === UserRole.SUSPENDED) {
      updateData.suspensionReason = reason;
    } else {
      updateData.suspensionReason = null;
    }

    // Only clear custom role for SUSPENDED and PENDING users
    if (role === UserRole.SUSPENDED || role === UserRole.PENDING) {
      updateData.customRoleId = null;
    } else {
      updateData.customRoleId = customRoleId;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        customRole: true,
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Notification logic
    const wasPending = existingUser.role === UserRole.PENDING;
    const isApproved =
      (updatedUser.role === UserRole.MEMBER ||
        updatedUser.role === UserRole.ADMIN) &&
      updatedUser.isActive;
    const isRejected = wasPending && role === UserRole.SUSPENDED && reason;

    if (wasPending && isApproved) {
      await notifyUserApproved(updatedUser as unknown as UserWithRelations);
    } else if (isRejected) {
      await notifyUserRejected(
        {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
        reason
      );
    }

    return updatedUser as unknown as UserWithRelations;
  }

  static async assignCustomRole(
    userId: number,
    customRoleId: number | null
  ): Promise<UserWithRelations> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        customRoleId,
        role: customRoleId ? UserRole.MEMBER : UserRole.MEMBER,
      },
      include: {
        customRole: true,
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return user as unknown as UserWithRelations;
  }

  static async getUsersWithCustomRoles(): Promise<UserWithRelations[]> {
    const users = await prisma.user.findMany({
      where: {
        customRoleId: { not: null },
        role: UserRole.MEMBER,
      },
      include: {
        customRole: true,
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return users as unknown as UserWithRelations[];
  }

  static async getPendingMembers(): Promise<UserWithRelations[]> {
    const users = await prisma.user.findMany({
      where: {
        role: UserRole.PENDING,
      },
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users as unknown as UserWithRelations[];
  }
  static async getLeads(): Promise<UserWithRelations[]> {
    const users = await prisma.user.findMany({
      where: {
        isLead: true,
        isActive: true,
        role: UserRole.MEMBER, // Only active members can be leads
      },
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
    });

    return users as unknown as UserWithRelations[];
  }
  static async getAllUsers(
    skip = 0,
    limit = 100,
    search?: string
  ): Promise<UserWithRelations[]> {
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { member: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        member: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            projects: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        customRole: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users as unknown as UserWithRelations[];
  }
}
