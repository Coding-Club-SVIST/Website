import Layout from "@/components/Layout";
import MemberCard from "@/components/MemberCard";
import Pagination from "@/components/ui/Pagination";
import { memberApi, skillApi } from "@/lib/api";
import { Member, Skill } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const MEMBERS_PER_PAGE = 9;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersRes, skillsRes] = await Promise.all([
          memberApi.getAll({ approvedOnly: true }),
          skillApi.getAll(),
        ]);

        setMembers(membersRes.data);
        setSkills(skillsRes.data);
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.roleTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.devStack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      // Skills filter
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skillId) =>
          member.skills.some((memberSkill) => memberSkill.skill.id === skillId)
        );

      return matchesSearch && matchesSkills;
    });
  }, [members, searchQuery, selectedSkills]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSkills]);

  const toggleSkillFilter = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedSkills.length > 0;

  return (
    <Layout>
      {/* Header */}
      <section className="container-custom py-16 text-center">
        <h1 className="section-title mb-4">Our Members</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Meet the talented developers building amazing projects in our
          community
        </p>
      </section>

      {/* Filters and Grid */}
      <section className="container-custom py-12">
        {/* Search and Filters Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search members by name, role, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Skills Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
              >
                <span>
                  Skills
                  {selectedSkills.length > 0 && (
                    <span className="ml-2 text-primary font-bold">
                      ({selectedSkills.length})
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Mobile Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="fixed lg:absolute bottom-0 lg:bottom-auto left-0 lg:left-auto right-0 lg:top-full lg:mt-2 bg-slate-800 border border-slate-700 rounded-t-2xl lg:rounded-lg shadow-xl z-50 max-h-[60vh] lg:max-h-64 overflow-y-auto w-full lg:w-64">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-800 lg:relative">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-300 font-medium">
                          Filter by Skills
                        </p>
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="lg:hidden text-slate-400 hover:text-white p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Skills List */}
                    <div className="max-h-[calc(60vh-80px)] lg:max-h-48 overflow-y-auto">
                      {skills.length > 0 ? (
                        skills.map((skill) => (
                          <label
                            key={skill.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(skill.id)}
                              onChange={() => toggleSkillFilter(skill.id)}
                              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                            />
                            <span className="text-slate-300 text-sm">
                              {skill.name}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-slate-400 text-sm">
                          No skills available
                        </div>
                      )}
                    </div>

                    {/* Mobile Apply Button */}
                    <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800 lg:hidden">
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full btn-primary py-2"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="btn-outline text-sm w-full sm:w-auto"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-slate-400">
            Showing {paginatedMembers.length} of {filteredMembers.length} member
            {filteredMembers.length !== 1 ? "s" : ""}
            {hasActiveFilters && " (filtered)"}
          </p>

          {/* Active Filters Display */}
          {(searchQuery || selectedSkills.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="badge-primary text-xs flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedSkills.map((skillId) => {
                const skill = skills.find((s) => s.id === skillId);
                return skill ? (
                  <span
                    key={skillId}
                    className="badge-secondary text-xs flex items-center gap-1"
                  >
                    {skill.name}
                    <button
                      onClick={() => toggleSkillFilter(skillId)}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              No members found matching your criteria
            </p>
            <button onClick={clearAllFilters} className="btn-primary">
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
