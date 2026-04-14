import Layout from "@/components/Layout";
import ProfileProjectsSection from "@/components/EditProfile/ProfileProjectSection";
import { memberApi, projectApi } from "@/lib/api";
import { Member, Project } from "@/lib/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  ExternalLink,
  Edit2,
  Shield,
  Clock,
  Mail,
  Crown,
  User,
  Code,
  Award,
  Bell,
  BellOff,
} from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isSubscribed, subscribe, unsubscribe, loading: notificationLoading } = useNotifications();

  const currentUserId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;
  const isOwnProfile = status === "authenticated";

  // Check if user should be blocked from accessing profile
  const shouldBlockAccess = userRole === "SUSPENDED" || userRole === "PENDING";

  useEffect(() => {
    console.log("=== PROFILE DEBUG ===");
    console.log("Session status:", status);
    console.log("Session user:", session?.user);
    console.log("User role from session:", (session?.user as any)?.role);
    console.log("User ID from session:", (session?.user as any)?.id);
    console.log("Member data:", member);
    console.log("Should block access:", shouldBlockAccess);
    console.log("=== END DEBUG ===");
  }, [status, session, member, shouldBlockAccess]);

  useEffect(() => {
    // Redirect suspended/pending users immediately
    if (shouldBlockAccess) {
      // For suspended users, we still need to load the member data to get the suspension reason
      if (
        userRole === "SUSPENDED" &&
        status === "authenticated" &&
        currentUserId
      ) {
        const loadMemberForSuspensionReason = async () => {
          try {
            const res = await memberApi.getProfile();
            setMember(res.data);
          } catch (error) {
            console.error("Error loading member for suspension reason:", error);
          } finally {
            setLoading(false);
          }
        };
        loadMemberForSuspensionReason();
      } else {
        setLoading(false);
      }
      return;
    }

    if (status !== "authenticated" || !currentUserId) {
      if (status !== "loading") {
        setLoading(false);
      }
      return;
    }

    const loadMember = async () => {
      try {
        const res = await memberApi.getProfile();
        setMember(res.data);
      } catch (error: any) {
        console.error("Error loading member:", error);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [status, shouldBlockAccess, currentUserId, userRole]);

  const handleProjectsUpdate = (updatedProjects: Project[]) => {
    setMember((prev) => (prev ? { ...prev, projects: updatedProjects } : null));
  };

  const handleNotificationToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  // Show access denied for suspended/pending users
  if (shouldBlockAccess && !loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="container-custom py-20 text-center">
            <div className="max-w-md mx-auto">
              {userRole === "SUSPENDED" ? (
                <>
                  <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Account Suspended
                  </h1>
                  <p className="text-slate-400 mb-4">
                    Your account has been suspended. Please contact an
                    administrator for more information.
                  </p>

                  {/* Suspension Reason */}
                  {member?.user?.suspensionReason && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                      <p className="text-red-400 text-sm">
                        <strong>Reason:</strong> {member.user.suspensionReason}
                      </p>
                    </div>
                  )}

                  {/* Contacts Link */}
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300 text-sm mb-3">
                      If you believe this is a mistake or have questions:
                    </p>
                    <Link
                      href="/contacts"
                      className="btn-primary flex items-center justify-center gap-2 w-full"
                    >
                      <Mail size={16} />
                      Contact Administrators
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Pending Approval
                  </h1>
                  <p className="text-slate-400 mb-4">
                    Your account is pending approval. You'll be able to access
                    your profile once an administrator approves your account.
                  </p>

                  {/* Contacts Link for Pending Users */}
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300 text-sm mb-3">
                      Have questions about the approval process?
                    </p>
                    <Link
                      href="/contacts"
                      className="btn-primary flex items-center justify-center gap-2 w-full"
                    >
                      <Mail size={16} />
                      Contact Administrators
                    </Link>
                  </div>
                </>
              )}

              <button
                onClick={() => router.push("/")}
                className="btn-secondary mt-4 w-full"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading || status === "loading") {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || (!member && status === "authenticated")) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <p className="text-slate-400">Profile not found</p>
          {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
          <p className="text-slate-500 text-xs mt-2">
            Session ID: {(session?.user as any)?.id}
          </p>

          {/* Contacts Link for Error State */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-w-md mx-auto">
            <p className="text-slate-300 text-sm mb-3">
              Having trouble accessing your profile?
            </p>
            <Link
              href="/contacts"
              className="btn-primary flex items-center justify-center gap-2 w-full mb-3"
            >
              <Mail size={16} />
              Contact Support
            </Link>
            <button
              onClick={() => router.push("/members")}
              className="btn-secondary w-full"
            >
              View All Members
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!member) return null;

  return (
    <Layout>
      {/* Profile Header */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-8 md:py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <div className="relative">
                <img
                  src={member.user.avatarUrl || "/avatar.png"}
                  alt={member.fullName}
                  className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-primary/50 shadow-lg"
                />
              </div>

              {/* Mobile Action Buttons */}
              {isOwnProfile && (
                <div className="mt-4 w-full lg:hidden flex flex-col gap-2">
                  <Link
                    href={`profile/edit`}
                    className="btn-secondary flex items-center justify-center gap-2 w-full text-sm py-2"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleNotificationToggle}
                    disabled={notificationLoading}
                    className={`flex items-center justify-center gap-2 w-full text-sm py-2 rounded-lg font-medium transition-all ${
                      isSubscribed
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                        : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                    } disabled:opacity-50`}
                  >
                    {notificationLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : isSubscribed ? (
                      <>
                        <BellOff size={16} />
                        Disable Notifications
                      </>
                    ) : (
                      <>
                        <Bell size={16} />
                        Enable Notifications
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  {/* Name and Title */}
                  <div className="text-center lg:text-left mb-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {member.fullName || member.user.username}
                    </h1>

                    {member.roleTitle && (
                      <p className="text-lg md:text-xl text-primary">
                        {member.roleTitle}
                      </p>
                    )}
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                    {/* Community Lead Badge */}
                    {member.user.isLead && (
                      <span className="badge-accent flex items-center gap-1.5 px-3 py-1.5 text-sm">
                        <Crown size={14} />
                        Community Lead
                      </span>
                    )}

                    {/* Custom Role Badge */}
                    {member.user.customRole && (
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: `${member.user.customRole.color}15`,
                          color: member.user.customRole.color,
                          borderColor: `${member.user.customRole.color}30`,
                        }}
                      >
                        <Shield size={14} />
                        {member.user.customRole.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                {isOwnProfile && (
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={handleNotificationToggle}
                      disabled={notificationLoading}
                      title={isSubscribed ? "Disable Notifications" : "Enable Notifications"}
                      className={`flex items-center justify-center p-2 rounded-lg font-medium transition-all ${
                        isSubscribed
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                          : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                      } disabled:opacity-50`}
                    >
                      {notificationLoading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : isSubscribed ? (
                        <BellOff size={20} />
                      ) : (
                        <Bell size={20} />
                      )}
                    </button>
                    <Link
                      href={`profile/edit`}
                      className="btn-secondary flex items-center gap-2 px-4 py-2"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              {member.bio && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                    <User size={18} className="text-slate-400" />
                    <h3 className="text-base font-semibold text-slate-300">
                      About
                    </h3>
                  </div>
                  <p className="text-slate-300 text-base md:text-lg text-center lg:text-left leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              )}

              {/* Skills & Tech Stack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Dev Stack */}
                {member.devStack && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                      <Code size={16} className="text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-300">
                        Tech Stack
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                      {member.devStack.split(",").map((stack) => (
                        <span
                          key={stack.trim()}
                          className="badge-primary text-xs px-2 py-1"
                        >
                          {stack.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                      <Award size={16} className="text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-300">
                        Skills
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                      {member.skills.map((memberSkill) => (
                        <span
                          key={memberSkill.skill.id}
                          className="badge-secondary text-xs px-2 py-1"
                        >
                          {memberSkill.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-slate-700">
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {member.user.githubUrl && (
                    <a
                      href={member.user.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm px-3 py-2 flex-1 lg:flex-none min-w-[120px] justify-center"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm px-3 py-2 flex-1 lg:flex-none min-w-[120px] justify-center"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </a>
                  )}
                  {member.portfolioUrl && (
                    <a
                      href={member.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 text-sm px-3 py-2 flex-1 lg:flex-none min-w-[120px] justify-center"
                    >
                      <ExternalLink size={16} />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section with Integrated Management */}
      <ProfileProjectsSection
        projects={member.projects || []}
        isOwnProfile={isOwnProfile}
        onProjectsUpdate={handleProjectsUpdate}
        memberName={member.fullName || member.user.username}
      />
    </Layout>
  );
}
