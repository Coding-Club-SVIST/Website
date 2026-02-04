import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import LeadsCarousel from "@/components/LeadsCarousel";
import { eventApi, memberApi, projectApi } from "@/lib/api";
import { Event, Member } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MessageSquarePlus,
  Users,
  Code,
  Calendar,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [leads, setLeads] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Live stats
  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    events: 0,
  });
  const [animatedStats, setAnimatedStats] = useState({
    members: 0,
    projects: 0,
    events: 0,
  });

  const buckFunc = (c: number) => c <= 5 ? c : (c % 5 === 0 ? c : Math.floor(c / 5) * 5 + "+")

  const statsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToStats = () => {
    statsSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, membersRes, projectsRes, allEventsRes] =
          await Promise.all([
            eventApi.getAll({ featuredOnly: true }).catch((err) => {
              console.error("Featured Events API error:", err);
              return { data: [] };
            }),
            memberApi.getAll({ approvedOnly: true }).catch((err) => {
              console.error("Members API error:", err);
              return { data: [] };
            }),
            projectApi.getAll({ approvedOnly: true }).catch((err) => {
              console.error("Projects API error:", err);
              return { data: [] };
            }),
            eventApi.getAll().catch((err) => {
              console.error("All Events API error:", err);
              return { data: [] };
            }),
          ]);

        setFeaturedEvents(eventsRes.data?.slice(0, 3) || []);

        // Filter leads and ensure user ID 1 is included if they are a lead
        const allLeads =
          membersRes.data?.filter((m: Member) => m.user.isLead) || [];
        setLeads(allLeads.slice(0, 6)); // Limit to 6 leads for carousel

        // Set real stats
        setStats({
          members: membersRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          events: allEventsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Animate stats counting up
  useEffect(() => {
    if (stats.members === 0 && stats.projects === 0 && stats.events === 0)
      return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        members: Math.floor(stats.members * progress),
        projects: Math.floor(stats.projects * progress),
        events: Math.floor(stats.events * progress),
      });

      if (currentStep >= steps) {
        setAnimatedStats(stats);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container-custom py-24 text-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mb-6 inline-block animate-bounce-slow">
          <span className="badge-primary flex items-center gap-2">
            <MessageSquarePlus size={16} />
            Welcome to Coder Ride
          </span>
        </div>
        <h1 className="section-title mb-4 animate-fade-in">
          Build Together, Create Amazing
        </h1>
        <p className="section-subtitle max-w-2xl mx-auto animate-fade-in-delay">
          A community of passionate developers collaborating on innovative
          projects, sharing knowledge, and growing together.
        </p>
        <br></br>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-delay-2 px-4">
          <Link
            href="/members"
            className="btn-primary group w-full sm:w-auto justify-center"
          >
            <Users
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span>Explore Members</span>
          </Link>
          <Link
            href="/projects"
            className="btn-outline group w-full sm:w-auto justify-center"
          >
            <Code
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>View Projects</span>
          </Link>
        </div>

        {/* Scroll indicator for mobile */}
        <div 
          className="mt-12 md:mt-16 animate-bounce cursor-pointer group"
          onClick={scrollToStats}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToStats();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Scroll to statistics section"
        >
          <ChevronDown 
            size={24} 
            className="mx-auto text-slate-400 group-hover:text-accent transition-colors duration-300" 
          />
        </div>
      </section>

      {/* Live Stats Section */}
      <section ref= {statsSectionRef} className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Members Stat */}
          <div className="card p-6 md:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="relative">
              <Users
                size={40}
                className="mx-auto text-primary mb-3 md:mb-4 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2 tabular-nums">
              {loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <>{buckFunc(animatedStats.members)}</>
              )}
            </h3>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Active Members
            </p>
            <div className="mt-3 md:mt-4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Projects Stat */}
          <div className="card p-6 md:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="relative">
              <Code
                size={40}
                className="mx-auto text-secondary mb-3 md:mb-4 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-secondary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2 tabular-nums">
              {loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <>{buckFunc(animatedStats.projects)}</>
              )}
            </h3>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Projects Showcased
            </p>
            <div className="mt-3 md:mt-4 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Events Stat */}
          <div className="card p-6 md:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="relative">
              <Calendar
                size={40}
                className="mx-auto text-accent mb-3 md:mb-4 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2 tabular-nums">
              {loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <>{buckFunc(animatedStats.events)}</>
              )}
            </h3>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Events Hosted
            </p>
            <div className="mt-3 md:mt-4 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container-custom py-12 md:py-20">
        <div className="mb-8 md:mb-12 px-4">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <Calendar
              size={24}
              className="md:size-7 text-accent animate-pulse"
            />
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Featured Events
            </h2>
          </div>
          <p className="text-slate-300 text-center md:text-left text-base md:text-xl">
            Don&apos;t miss our upcoming events and workshops
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card h-64 md:h-96 animate-pulse bg-gradient-to-br from-slate-800 to-slate-900"
              />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 px-4">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
            <div className="text-center px-4">
              <Link
                href="/events"
                className="btn-primary group w-full sm:w-auto justify-center"
              >
                View All Events
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="card p-8 md:p-12 text-center mx-4">
            <Calendar
              size={40}
              className="md:size-12 mx-auto text-slate-600 mb-4"
            />
            <p className="text-slate-400 text-base md:text-lg">
              No featured events yet
            </p>
            <p className="text-slate-500 text-sm md:text-base mt-2">
              Check back soon for exciting workshops and meetups!
            </p>
          </div>
        )}
      </section>

      {/* Meet Our Leads */}
      <section className="container-custom py-12 md:py-20">
        <div className="mb-8 md:mb-12 px-4">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <Users size={24} className="md:size-7 text-secondary" />
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Meet Our Leads
            </h2>
          </div>
          <p className="text-slate-300 text-center md:text-left text-base md:text-xl">
            Outstanding members driving our community forward
          </p>
        </div>

        <LeadsCarousel leads={leads} loading={loading} />
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        /* Mobile-first responsive container */
        .container-custom {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .container-custom {
            max-width: 640px;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .container-custom {
            max-width: 768px;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .container-custom {
            max-width: 1024px;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1280px) {
          .container-custom {
            max-width: 1280px;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
}
