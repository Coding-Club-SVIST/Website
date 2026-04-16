import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomRoleService } from "../services/customRole.service";
import { ProjectService } from "../services/project.service";
import { EventService } from "../services/event.service";
import { UserRole } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

export class AdminController {
  static getPendingMembers = asyncHandler(
    async (req: Request, res: Response) => {
      const pendingMembers = await UserService.getPendingMembers();
      return res.json(pendingMembers);
    }
  );

  static approveMember = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { role, customRoleId, reason } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Validate custom role assignment
    if (role === UserRole.MEMBER && customRoleId) {
      const customRole = await CustomRoleService.findById(customRoleId);
      if (!customRole) {
        return res.status(400).json({ error: "Invalid custom role" });
      }
    }

    const user = await UserService.updateRole(
      userId,
      role,
      customRoleId,
      reason
    );
    return res.json(user);
  });

  static assignCustomRole = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const { customRoleId } = req.body;

      const user = await UserService.assignCustomRole(userId, customRoleId);
      return res.json(user);
    }
  );

  static getPendingProjects = asyncHandler(
    async (req: Request, res: Response) => {
      const pendingProjects = await ProjectService.getPendingProjects();
      return res.json(pendingProjects);
    }
  );

  static approveProject = asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    const { isApproved, reason } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "isApproved is required" });
    }

    const project = await ProjectService.updateApprovalStatus(
      projectId,
      isApproved,
      reason
    );
    return res.json(project);
  });

  static removeProject = asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    await ProjectService.delete(projectId);
    return res.json({ message: "Project removed successfully" });
  });

  static setEventFeatured = asyncHandler(
    async (req: Request, res: Response) => {
      const eventId = parseInt(req.params.eventId);
      const { isFeatured } = req.body;

      if (typeof isFeatured !== "boolean") {
        return res.status(400).json({ error: "isFeatured is required" });
      }

      const event = await EventService.setFeatured(eventId, isFeatured);
      return res.json(event);
    }
  );

  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = req.query.search as string;
    const users = await UserService.getAllUsers(skip, limit, search);
    return res.json(users);
  });

  static updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { role, customRoleId, reason } = req.body;

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate role
    if (!role || !Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: "Valid role is required" });
    }

    // Validate custom role assignment - allow for both MEMBER and ADMIN
    if (customRoleId) {
      const customRole = await CustomRoleService.findById(customRoleId);
      if (!customRole) {
        return res.status(400).json({ error: "Invalid custom role" });
      }

      // Only clear custom role for SUSPENDED and PENDING users
      if (role === UserRole.SUSPENDED || role === UserRole.PENDING) {
        const finalCustomRoleId = null;
      }
      // For MEMBER and ADMIN, keep the custom role
    }

    // Require reason for suspension
    if (role === UserRole.SUSPENDED && !reason) {
      return res.status(400).json({ error: "Suspension reason is required" });
    }

    const updated = await UserService.updateRole(
      userId,
      role,
      customRoleId, // Don't force to null for ADMIN
      reason
    );
    return res.json(updated);
  });

  static async setUserLeadStatus(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const { isLead } = req.body;

      if (typeof isLead !== "boolean") {
        return res.status(400).json({ error: "isLead must be a boolean" });
      }

      const user = await UserService.update(userId, { isLead });
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getLeads(req: Request, res: Response) {
    try {
      const leads = await UserService.getLeads();
      return res.json(leads);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
