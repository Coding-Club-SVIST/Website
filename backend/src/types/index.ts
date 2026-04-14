import { Request } from "express";

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}

export enum Permission {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MANAGE_PROJECTS = 'MANAGE_PROJECTS',
  MANAGE_EVENTS = 'MANAGE_EVENTS',
  MANAGE_SKILLS = 'MANAGE_SKILLS',
  MANAGE_TAGS = 'MANAGE_TAGS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  SEND_NOTIFICATIONS = "SEND_NOTIFICATIONS"
}

export type ProjectCategory = "WEB" | "AI" | "UIUX";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    customRole?: {
      id: number;
      name: string;
      description: string | null;
      color: string;
      permissions: Permission[];
      position: number;
      createdAt: Date;
      updatedAt: Date;
      createdBy?: number;
    } | null;
  };
}

export interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  avatar_url: string;
  html_url: string;
  name: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
}

// DTOs
export interface CreateUserDTO {
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  githubUrl?: string;
}

export interface UpdateUserDTO {
  email?: string;
  avatarUrl?: string;
}

export interface CreateMemberDTO {
  userId: number;
  fullName?: string;
  bio?: string;
  roleTitle?: string;
  devStack?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface UpdateMemberDTO {
  fullName?: string;
  bio?: string;
  roleTitle?: string;
  devStack?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface CreateProjectDTO {
  title: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category?: ProjectCategory;
  tags?: string[];
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category?: ProjectCategory;
  tags?: string[];
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  eventDate: Date;
  location?: string;
  imageUrl?: string;
  registrationUrl?: string;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  eventDate?: Date;
  location?: string;
  imageUrl?: string;
  registrationUrl?: string;
  isFeatured?: boolean;
  isUpcoming?: boolean;
}

export interface MemberApprovalDTO {
  isActive: boolean;
  customRoleId?: number;
  reason?: string;
}

export interface CreateCustomRoleDTO {
  name: string;
  description?: string;
  color?: string;
  permissions: Permission[];
}

export interface UpdateCustomRoleDTO {
  name?: string;
  description?: string;
  color?: string;
  permissions?: Permission[];
}

export interface ProjectApprovalDTO {
  isApproved: boolean;
  reason?: string;
}

// Core entity interfaces
export interface CustomRole {
  id: number;
  name: string;
  description: string | null;
  color: string;
  permissions: Permission[];
  position: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
}

export interface User {
  id: number;
  githubId: string;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  role: UserRole;
  customRoleId?: number | null;
  suspensionReason?: string | null;
  isActive: boolean;
  isLead: boolean;
  createdAt: Date;
  updatedAt: Date;
  customRole?: CustomRole | null;
  member?: Member | null;
}

export interface Member {
  id: number;
  userId: number;
  fullName?: string | null;
  bio?: string | null;
  roleTitle?: string | null;
  devStack?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: number;
  name: string;
  category?: string | null;
}

export interface MemberSkill {
  memberId: number;
  skillId: number;
  member: Member;
  skill: Skill;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ProjectTag {
  projectId: number;
  tagId: number;
  project: Project;
  tag: Tag;
}

export interface Project {
  id: number;
  memberId: number;
  title: string;
  description?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  category?: ProjectCategory | null;
  isApproved: boolean;
  isRejected: boolean;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description?: string | null;
  eventDate: Date;
  location?: string | null;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  isFeatured: boolean;
  isUpcoming: boolean;
  createdBy?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interfaces with relations
export interface MemberWithRelations extends Member {
  user: User;
  skills: (MemberSkill & {
    skill: Skill;
  })[];
  projects: (Project & {
    tags: (ProjectTag & {
      tag: Tag;
    })[];
  })[];
}

export interface UserWithRelations extends User {
  member?: MemberWithRelations | null;
}

export interface ProjectWithRelations extends Project {
  tags: (ProjectTag & {
    tag: Tag;
  })[];
  member?: (Member & {
    user: User;
  }) | null;
}

// Legacy interfaces
export interface ProjectWithRejection extends Project {
  rejectionReason?: string;
}

export interface EventFeaturedDTO {
  isFeatured: boolean;
}

export interface JWTPayload {
  userId: number;
  role: string;
}

// Query interfaces
export interface PaginationQuery {
  skip?: number;
  limit?: number;
}

export interface ProjectQuery extends PaginationQuery {
  category?: ProjectCategory;
  tagIds?: number[];
  memberId?: number;
  approvedOnly?: boolean;
}

export interface MemberQuery extends PaginationQuery {
  skillIds?: number[];
  approvedOnly?: boolean;
}

export interface EventQuery extends PaginationQuery {
  upcomingOnly?: boolean;
  featuredOnly?: boolean;
}

// Permission checking helper - UPDATE TO HANDLE NULL
export function hasPermission(user: User, permission: Permission): boolean {
  // ADMIN has all permissions
  if (user.role === UserRole.ADMIN) {
    return true;
  }
  
  // SUSPENDED and PENDING users have no permissions
  if (user.role === UserRole.SUSPENDED || user.role === UserRole.PENDING) {
    return false;
  }
  
  // MEMBER with custom role
  if (user.role === UserRole.MEMBER && user.customRole) {
    return user.customRole.permissions.includes(permission);
  }
  
  // Regular MEMBER has no admin permissions
  return false;
}

// Type guard for safe property access
export function hasMember(user: User): user is User & { member: NonNullable<User['member']> } {
  return user.member !== null && user.member !== undefined;
}

export function hasCustomRole(user: User): user is User & { customRole: NonNullable<User['customRole']> } {
  return user.customRole !== null && user.customRole !== undefined;
}