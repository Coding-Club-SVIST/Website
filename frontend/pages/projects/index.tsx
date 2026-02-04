import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import Pagination from "@/components/ui/Pagination";
import { projectApi, tagApi } from "@/lib/api";
import { Project, ProjectCategory, Tag } from "@/lib/types";
import { useEffect, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "WEB", label: "Web Development" },
  { value: "AI", label: "AI & Machine Learning" },
  { value: "UIUX", label: "UI/UX Design" },
];

// Number of projects per page
const PROJECTS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsRes, tagsRes] = await Promise.all([
          projectApi.getAll({ approvedOnly: true }),
          tagApi.getAll(),
        ]);

        setProjects(projectsRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter projects based on selected filters and search query
  const filteredProjects = projects.filter((project) => {
    // Category filter
    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagId) =>
        project.tags.some((t) => t.tagId === tagId)
      );

    // Search filter - matches project title OR author name
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.member?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.member?.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTags && matchesSearch;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTags, searchQuery]);

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    selectedCategory || selectedTags.length > 0 || searchQuery;

  return (
    <Layout>
      {/* Header */}
      <section className="container-custom py-12 md:py-16 text-center">
        <h1 className="section-title mb-4">
          Projects
        </h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore the incredible projects built by our community members
        </p>
      </section>

      {/* Filters and Grid */}
      <section className="container-custom py-8 md:py-12 px-4 md:px-0">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search projects or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 md:py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters - Stack vertically on mobile */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* Category Filter - Full width on mobile */}
            <div className="relative flex-1">
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="btn-secondary flex items-center justify-between gap-2 w-full px-4 py-3 text-base"
              >
                <span className="truncate">
                  {selectedCategory
                    ? categories.find((c) => c.value === selectedCategory)
                        ?.label
                    : "All Categories"}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors border-b border-slate-700 text-slate-300"
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors border-b border-slate-700 text-slate-300 last:border-b-0"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tags Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                className="btn-secondary flex items-center justify-between gap-2 w-full px-4 py-3 text-base"
              >
                <span className="truncate">
                  Filter Tags
                  {selectedTags.length > 0 && (
                    <span className="ml-2 text-primary font-bold">
                      ({selectedTags.length})
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform ${
                    isTagDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isTagDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => toggleTag(tag.id)}
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer"
                      />
                      <span className="text-slate-300">{tag.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="btn-outline text-sm w-full sm:w-auto px-4 py-2.5"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info  */}
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <p className="text-slate-400 text-sm md:text-base">
              <span className="font-semibold text-white">
                {filteredProjects.length}
              </span>{" "}
              project{filteredProjects.length !== 1 ? "s" : ""} found
              {hasActiveFilters && " (filtered)"}
            </p>
            {searchQuery && (
              <p className="text-sm text-slate-500">
                Search: "<span className="text-primary">{searchQuery}</span>"
              </p>
            )}
            {totalPages > 1 && (
              <p className="text-sm text-slate-500 md:hidden">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              {searchQuery
                ? `No projects found matching "${searchQuery}"`
                : "No projects found"}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Layout>
  );
}
