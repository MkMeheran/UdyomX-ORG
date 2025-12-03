import { Suspense } from "react";
import { projectAPI } from "@/lib/api";
import { ProjectCard } from "@/components/project-card";
import { FilterBar } from "@/components/filter-bar";
import { GridSkeleton } from "@/components/ui/skeleton";
import { Briefcase, Sparkles } from "lucide-react";

// Fetch light data for cards (faster)
async function getProjectsForCards() {
  try {
    const projects = await projectAPI.getAllForCards();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Projects Grid Component (can be streamed)
async function ProjectsGrid() {
  const projects = await getProjectsForCards();
  
  if (projects.length === 0) {
    return (
      <div className="col-span-full">
        <div
          className="
            bg-[#F5F1E8] border-[4px] border-[#2C2416]
            shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
            p-12 text-center
          "
        >
          <div
            className="
              w-20 h-20 mx-auto mb-6
              bg-[#2196F3] border-[4px] border-[#2C2416]
              shadow-[4px_4px_0_0_#2C2416]
              flex items-center justify-center
            "
          >
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <p className="text-[#2C2416] text-xl font-black mb-2">
            No projects yet
          </p>
          <p className="text-[#7A7267] font-semibold">
            Check back soon for new work!
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProjectCard project={project as any} />
        </div>
      ))}
    </>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Renders immediately */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <div
              className="
                flex items-center gap-3 px-5 py-3
                bg-[#2196F3] text-white
                border-[4px] border-[#2C2416]
                shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
              "
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-[12px] font-black uppercase tracking-wider">
                Projects
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2C2416] mb-3">
            All Projects
          </h1>
          <p className="text-lg text-[#5A5247] font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F5C542]" />
            Showcasing our best work and recent builds
          </p>
        </div>

        {/* Filter Bar - Renders immediately */}
        <div className="mb-8">
          <FilterBar
            categories={[
              "All Categories",
              "Web Development",
              "Mobile Apps",
              "AI/ML",
              "Design",
            ]}
            showCategoryFilter={true}
          />
        </div>

        {/* Projects Grid - Streams with skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<GridSkeleton count={6} type="project" columns={3} />}>
            <ProjectsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
