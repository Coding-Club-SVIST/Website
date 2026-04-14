export type UserRole = "ADMIN" | "MEMBER" | "PENDING" | "SUSPENDED";
export type ProjectCategory = "WEB" | "AI" | "UIUX";

export enum Permission {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  MANAGE_MEMBERS = "MANAGE_MEMBERS",
  MANAGE_PROJECTS = "MANAGE_PROJECTS",
  MANAGE_EVENTS = "MANAGE_EVENTS",
  MANAGE_SKILLS = "MANAGE_SKILLS",
  MANAGE_TAGS = "MANAGE_TAGS",
  MANAGE_ROLES = "MANAGE_ROLES",
  SEND_NOTIFICATIONS = "SEND_NOTIFICATIONS"
}

export interface CustomRole {
  id: number;
  name: string;
  description?: string;
  color: string;
  permissions: Permission[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  githubUrl?: string;
  role: UserRole;
  customRoleId?: number;
  suspensionReason?: string;
  isActive: boolean;
  isLead: boolean;
  createdAt: string;
  updatedAt: string;
  customRole?: CustomRole;
  member?: Member | null;
  hasCustomRole?: boolean;
  customRolePosition?: number;
}

export interface Member {
  id: number;
  userId: number;
  fullName?: string;
  bio?: string;
  roleTitle?: string;
  devStack?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  user: User;
  skills: MemberSkill[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface MemberSkill {
  memberId: number;
  skillId: number;
  member: Member;
  skill: Skill;
}

export interface Project {
  id: number;
  memberId: number;
  title: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category?: ProjectCategory;
  isApproved: boolean;
  isRejected: boolean;
  rejectionReason?: string;
  tags: ProjectTag[];
  createdAt: string;
  updatedAt: string;
  member?: Member;
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

export interface Event {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  imageUrl?: string;
  registrationUrl?: string;
  isFeatured: boolean;
  isUpcoming: boolean;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  featuredOnly?: boolean;
  upcomingOnly?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  registrationUrl: string;
  imageUrl: string;
  isFeatured: boolean;
}

export interface ProjectUI extends Omit<Project, "tags"> {
  tags: string[];
}

export const toProjectUI = (p: Project): ProjectUI => ({
  ...p,
  tags: p.tags.map((t) => (typeof t === "string" ? t : t.tag.name)),
});

export interface ProjectWithRelations extends Project {
  member: Member;
  tags: ProjectTag[];
}

// Permission checking helper
export function hasPermission(user: User, permission: Permission): boolean {
  // ADMIN has all permissions
  if (user.role === "ADMIN") {
    return true;
  }
  
  // SUSPENDED and PENDING users have no permissions
  if (user.role === "SUSPENDED" || user.role === "PENDING") {
    return false;
  }
  
  // MEMBER with custom role
  if (user.role === "MEMBER" && user.customRole) {
    return user.customRole.permissions.includes(permission);
  }
  
  // Regular MEMBER has no admin permissions
  return false;
}

// Check if user is admin
export function isAdmin(user: User): boolean {
  return user.role === "ADMIN";
}