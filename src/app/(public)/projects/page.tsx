import { projectAPI } from "@/lib/api";
import { ContentListClient } from "@/components/content-list-client";
import { Briefcase } from "lucide-react";
import { Metadata } from 'next';

// ISR: Regenerate page every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Our Projects - Web Development Portfolio | UdyomX ORG',
    description: 'Explore our portfolio of web development projects, custom solutions, and digital products built for clients in Bangladesh.',
};

// Fetch all projects (server-side)
async function getAllProjects() {
  try {
    const projects = await projectAPI.getAllForCards();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const allProjects = await getAllProjects();

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block">
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
        </div>

        {/* Client-side content list with search, filter, and load-more */}
        <ContentListClient
          contentType="project"
          initialItems={allProjects}
          categories={[
            "All Categories",
            "Web Development",
            "Mobile Apps",
            "AI/ML",
            "Design",
          ]}
        />
      </div>
    </div>
  );
}
