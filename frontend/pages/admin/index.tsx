import Layout from "@/components/Layout";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { adminApi, projectApi, eventApi, skillApi, tagApi } from "@/lib/api";
import {
  User,
  Project,
  Event,
  Skill,
  CustomRole,
  Permission,
} from "@/lib/types";
import {
  CheckCircle,
  XCircle,
  Users,
  FolderOpen,
  Calendar,
  Award,
  Tags,
  Shield,
  Clock,
  Lock,
  Bell,
} from "lucide-react";

import MembersTab from "@/components/admin/MembersTab/MembersTab";
import ProjectsTab from "@/components/admin/ProjectsTab/ProjectsTab";
import EventsTab from "@/components/admin/EventsTab/EventsTab";
import SkillsTab from "@/components/admin/SkillsTab";
import TagsTab from "@/components/admin/TagsTab";
import RolesTab from "@/components/admin/RolesTab/RolesTab";
import NotificationsTab from "@/components/admin/NotificationsTab";

type TabType = "members" | "projects" | "events" | "skills" | "tags" | "roles" | "notifications";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("members");

  // Data states
  const [pendingMembers, setPendingMembers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Permission checking functions
  const hasAdminAccess = () => {
    if (!session?.user) return false;

    const user = session.user as User;

    // If user has ADMIN role
    if (user.role === "ADMIN") return true;

    // If user has a custom role with dashboard permission
    if (user.customRole?.permissions?.includes(Permission.VIEW_DASHBOARD)) {
      return true;
    }

    return false;
  };

  const hasPermission = (permission: Permission) => {
    if (!session?.user) return false;

    const user = session.user as User;

    // ADMIN has all permissions
    if (user.role === "ADMIN") return true;

    // Check custom role permissions
    return user.customRole?.permissions?.includes(permission) || false;
  };

  const canAccessAdmin = hasAdminAccess();

  // Define tabs with required permissions
  const getAvailableTabs = () => {
    const allTabs = [
      {
        id: "members" as TabType,
        icon: Users,
        label: "Members",
        permission: Permission.MANAGE_MEMBERS,
        description: "Manage club members and approvals",
      },
      {
        id: "projects" as TabType,
        icon: FolderOpen,
        label: "Projects",
        permission: Permission.MANAGE_PROJECTS,
        description: "Approve and manage projects",
      },
      {
        id: "events" as TabType,
        icon: Calendar,
        label: "Events",
        permission: Permission.MANAGE_EVENTS,
        description: "Manage events and featured content",
      },
      {
        id: "skills" as TabType,
        icon: Award,
        label: "Skills",
        permission: Permission.MANAGE_SKILLS,
        description: "Manage skill categories and tags",
      },
      {
        id: "tags" as TabType,
        icon: Tags,
        label: "Tags",
        permission: Permission.MANAGE_TAGS,
        description: "Manage project tags",
      },
      {
        id: "roles" as TabType,
        icon: Shield,
        label: "Roles",
        permission: Permission.MANAGE_ROLES,
        description: "Manage custom roles and permissions",
      },
      {
        id: "notifications" as TabType,
        icon: Bell,
        label: "Notifications",
        permission: Permission.SEND_NOTIFICATIONS,
        description: "Send push notifications to members",
      },
    ];

    // Filter tabs based on permissions
    return allTabs.filter((tab) => {
      // Other tabs require specific permissions
      return hasPermission(tab.permission);
    });
  };

  const availableTabs = getAvailableTabs();

  // Set active tab to first available tab if current active tab is not available
  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.find((tab) => tab.id === activeTab)
    ) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Not authenticated, redirecting to signin");
      signIn();
      return;
    }

    if (status === "authenticated" && !canAccessAdmin) {
      console.log("No admin access, redirecting to home");
      router.push("/");
      return;
    }

    if (canAccessAdmin) {
      loadData();
    }
  }, [session, status, canAccessAdmin, router, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load essential data (admin-specific)
      const [pendingRes, usersRes] = await Promise.all([
        adminApi.getPendingMembers(),
        adminApi.getAllUsers(),
      ]);
      setPendingMembers(pendingRes.data);
      setAllUsers(usersRes.data);

      // Load tab-specific data using existing APIs
      switch (activeTab) {
        case "projects":
          if (hasPermission(Permission.MANAGE_PROJECTS)) {
            const [pendingProjectsRes, allProjectsRes] = await Promise.all([
              adminApi.getPendingProjects(),
              projectApi.getAll(),
            ]);
            setPendingProjects(pendingProjectsRes.data);
            setAllProjects(allProjectsRes.data);
          }
          break;
        case "events":
          if (hasPermission(Permission.MANAGE_EVENTS)) {
            const eventsRes = await eventApi.getAll();
            setEvents(eventsRes.data);
          }
          break;
        case "skills":
          if (hasPermission(Permission.MANAGE_SKILLS)) {
            const skillsRes = await skillApi.getAll();
            setSkills(skillsRes.data);
          }
          break;
        case "tags":
          if (hasPermission(Permission.MANAGE_TAGS)) {
            const tagsRes = await tagApi.getAll();
            setTags(tagsRes.data);
          }
          break;
        case "roles":
          if (hasPermission(Permission.MANAGE_ROLES)) {
            const rolesRes = await adminApi.getCustomRoles();
            setCustomRoles(rolesRes.data);
          }
          break;
      }
    } catch (error: any) {
      console.error("Error loading admin data:", error);
      setError(error.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const onError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-slate-400">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!canAccessAdmin) {
    return (
      <Layout>
        <div className="container-custom py-12 md:py-20 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You need admin privileges or dashboard permission to access this
            page.
          </p>
          <button onClick={() => signIn()} className="btn-primary px-6 py-2">
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      label: "Pending Approvals",
      value: pendingMembers.length,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      permission: Permission.MANAGE_MEMBERS,
    },
    {
      label: "Total Members",
      value: allUsers.length,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      permission: Permission.MANAGE_MEMBERS,
    },
    {
      label: "Pending Projects",
      value: pendingProjects.length,
      icon: FolderOpen,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      permission: Permission.MANAGE_PROJECTS,
    },
    {
      label: "Active Admins",
      value: allUsers.filter((u) => u.role === "ADMIN" && u.isActive).length,
      icon: Shield,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      permission: Permission.MANAGE_MEMBERS,
    },
  ];

  // Filter stats based on permissions
  const availableStats = stats.filter(
    (stat) => !stat.permission || hasPermission(stat.permission)
  );
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {availableTabs.length === 1
                    ? availableTabs[0].description
                    : "Manage various aspects of the platform"}
                </p>
                {availableTabs.length === 0 && (
                  <p className="text-yellow-400 text-sm mt-1">
                    You have dashboard access but no specific permissions.
                    Contact an administrator.
                  </p>
                )}
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Logged in as</p>
                  <p className="text-white font-medium">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(session?.user as any)?.role === "ADMIN"
                      ? "Administrator"
                      : (session?.user as any)?.customRole?.name || "Member"}
                  </p>
                </div>
                <img
                  src={(session?.user as any)?.image || "/avatar.png"}
                  alt="Admin"
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        {availableStats.length > 0 && (
          <section className="container-custom py-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {availableStats.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`rounded-xl p-4 ${bg} border border-slate-700 flex flex-col items-center justify-center text-center`}
              >
                <Icon className={`w-6 h-6 mb-2 ${color}`} />
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-xl font-semibold text-white">
                  {value}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Alerts */}
        {success && (
          <div className="container-custom mb-4">
            <div className="bg-green-600/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} /> {success}
            </div>
          </div>
        )}
        {error && (
          <div className="container-custom mb-4">
            <div className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
              <XCircle size={18} /> {error}
            </div>
          </div>
        )}

        {/* Tabs - Only show if user has access to at least one tab */}
        {availableTabs.length > 0 ? (
          <>
            <nav className="container-custom flex flex-wrap gap-2 mb-6 border-b border-slate-700/50">
              {availableTabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                    activeTab === id
                      ? "bg-primary/20 text-white border-b-2 border-primary"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <section className="container-custom pb-12">
              {activeTab === "members" &&
                hasPermission(Permission.MANAGE_MEMBERS) && (
                  <MembersTab
                    pendingMembers={pendingMembers}
                    allUsers={allUsers}
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                    currentUserId={(session?.user as User).id}
                    currentUser={session?.user as User}
                  />
                )}
              {activeTab === "projects" &&
                hasPermission(Permission.MANAGE_PROJECTS) && (
                  <ProjectsTab
                    pendingProjects={pendingProjects}
                    allProjects={allProjects}
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                  />
                )}
              {activeTab === "events" &&
                hasPermission(Permission.MANAGE_EVENTS) && (
                  <EventsTab
                    events={events}
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                  />
                )}
              {activeTab === "skills" &&
                hasPermission(Permission.MANAGE_SKILLS) && (
                  <SkillsTab
                    skills={skills}
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                  />
                )}
              {activeTab === "tags" &&
                hasPermission(Permission.MANAGE_TAGS) && (
                  <TagsTab
                    tags={tags}
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                  />
                )}
              {activeTab === "roles" &&
                hasPermission(Permission.MANAGE_ROLES) && (
                  <RolesTab
                    onSuccess={onSuccess}
                    onError={onError}
                    onDataChange={loadData}
                  />
                )}
              {activeTab === "notifications" &&
                hasPermission(Permission.SEND_NOTIFICATIONS) && (
                  <NotificationsTab />
                )}
            </section>
          </>
        ) : (
          // Show message if user has dashboard access but no specific permissions
          <div className="container-custom py-12 text-center">
            <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Limited Access
            </h2>
            <p className="text-slate-400 mb-4">
              You have dashboard access but no specific permissions assigned.
            </p>
            <p className="text-slate-500 text-sm">
              Contact an administrator to request specific permissions.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
