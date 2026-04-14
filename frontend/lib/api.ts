import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session && (session as any).accessToken) {
        config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response from API:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const memberApi = {
  getAll: (params?: any) => apiClient.get("/members", { params }),
  getByUserId: (userId: number) => apiClient.get(`/members/user/${userId}`),
  getProfile: () => apiClient.get("/members/profile"),
  getProjects: (memberId: number) =>
    apiClient.get(`/members/${memberId}/projects`),
  getSkills: (memberId: number) => apiClient.get(`/members/${memberId}/skills`),
  update: (id: number, data: any) => apiClient.put(`/members/${id}`, data),
  updateProfile: (data: any) => apiClient.put("/members/profile", data),
  addSkills: (data: any) => apiClient.post("/members/skills", data),
  removeSkill: (skillId: number) =>
    apiClient.delete(`/members/skills/${skillId}`),
};

export const projectApi = {
  getAll: (params?: any) => apiClient.get("/projects", { params }),
  getById: (id: number) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post("/projects", data),
  update: (id: number, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: number) => apiClient.delete(`/projects/${id}`),
};

export const eventApi = {
  getAll: (params?: any) => apiClient.get("/events", { params }),
  getById: (id: number) => apiClient.get(`/events/${id}`),
  create: (data: any) => apiClient.post("/events", data),
  update: (id: number, data: any) => apiClient.put(`/events/${id}`, data),
  delete: (id: number) => apiClient.delete(`/events/${id}`),
  search: (query: string, params?: any) =>
    apiClient.get("/events/search", { params: { q: query, ...params } }),
};

export const skillApi = {
  getAll: () => apiClient.get("/skills"),
  getById: (id: number) => apiClient.get(`/skills/${id}`),
  create: (data: any) => apiClient.post("/skills", data),
  update: (id: number, data: any) => apiClient.put(`/skills/${id}`, data),
  delete: (id: number) => apiClient.delete(`/skills/${id}`),
};

export const tagApi = {
  getAll: (params?: any) => apiClient.get("/tags", { params }),
  search: (query: string) =>
    apiClient.get("/tags/search", { params: { q: query } }),
  create: (data: any) => apiClient.post("/tags", data),
  delete: (id: number) => apiClient.delete(`/tags/${id}`),
};

export const authApi = {
  getCurrentUser: () => apiClient.get("/auth/me"),
};

export const notificationApi = {
  getVapidPublicKey: () => apiClient.get("/notifications/vapid-key"),
  subscribe: (subscription: any) => apiClient.post("/notifications/subscribe", subscription),
  unsubscribe: (endpoint: string) => apiClient.post("/notifications/unsubscribe", { endpoint }),
  send: (data: { title: string; body: string; url?: string }) => apiClient.post("/notifications/send", data),
};

export const adminApi = {
  // Member management
  getPendingMembers: () => apiClient.get("/admin/members/pending"),
  getAllUsers: (params?: any) => apiClient.get("/admin/users", { params }),
  setUserLeadStatus: (userId: number, isLead: boolean) =>
    apiClient.put(`/admin/users/${userId}/lead-status`, { isLead }),

  getLeads: () => apiClient.get("/admin/leads"),

  // Adding User Role
  updateUserRole: (
    userId: number,
    data: {
      role: string;
      customRoleId?: number | null;
      reason?: string;
    }
  ) => apiClient.put(`/admin/users/${userId}/role`, data),

  // Project management
  getPendingProjects: () => apiClient.get("/admin/projects/pending"),
  approveProject: (
    projectId: number,
    data: { isApproved: boolean; reason?: string }
  ) => apiClient.put(`/admin/projects/${projectId}/approve`, data),
  deleteProject: (projectId: number) =>
    apiClient.delete(`/admin/projects/${projectId}`),

  // Event management
  setEventFeatured: (eventId: number, data: any) =>
    apiClient.put(`/admin/events/${eventId}/featured`, data),

  // Custom Roles management
  getCustomRoles: () => apiClient.get("/admin/custom-roles"),
  getCustomRole: (id: number) => apiClient.get(`/admin/custom-roles/${id}`),
  createCustomRole: (data: any) => apiClient.post("/admin/custom-roles", data),
  updateCustomRole: (id: number, data: any) =>
    apiClient.put(`/admin/custom-roles/${id}`, data),
  deleteCustomRole: (id: number) =>
    apiClient.delete(`/admin/custom-roles/${id}`),
  getRoleUsers: (roleId: number) =>
    apiClient.get(`/admin/custom-roles/${roleId}/users`),
  updateRolePosition: (roleId: number, data: { newPosition: number }) =>
    apiClient.put(`/admin/custom-roles/${roleId}/position`, data),
};

export default apiClient;
