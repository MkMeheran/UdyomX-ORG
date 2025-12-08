import { projectAPI } from "@/lib/api";
import { ProjectDetailLayout } from "@/components/project/ProjectDetailLayout";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import type { Project } from "@/types";

// ISR: Regenerate page every 60 seconds
export const revalidate = 60;

interface Props {
  params: { slug: string };
}

// Site URL for canonical/OG URLs
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://udyomx.org';

async function getProject(slug: string) {
  try {
    const project = await projectAPI.getBySlug(slug);
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

// Generate JSON-LD structured data for the project
function generateJsonLd(project: Project) {
    const seo = (project as any).seo || {};
    
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: seo.seoTitle || seo.metaTitle || project.title,
        description: seo.metaDescription || project.description,
        image: project.thumbnail || project.coverImage,
        applicationCategory: project.category || 'WebApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        author: {
            '@type': 'Organization',
            name: 'UdyomX ORG',
            url: SITE_URL,
        },
        datePublished: project.publishDate,
        keywords: seo.primaryKeyword 
            ? [seo.primaryKeyword, ...(seo.secondaryKeywords || []), ...(project.techStack || [])]
            : project.techStack,
        url: project.liveLink || `${SITE_URL}/projects/${project.slug}`,
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const project = await getProject(params.slug);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    // Get SEO data from project
    const seo = (project as any).seo || {};
    
    // Effective values with fallbacks
    const effectiveTitle = seo.seoTitle || seo.metaTitle || project.title;
    const effectiveDescription = seo.metaDescription || project.description;
    const effectiveImage = seo.openGraph?.image || seo.twitterCard?.image || project.thumbnail || project.coverImage;
    const canonicalUrl = seo.canonicalUrl || `${SITE_URL}/projects/${project.slug}`;
    
    // Keywords: primary + secondary + techStack
    const keywords = [
        seo.primaryKeyword,
        ...(seo.secondaryKeywords || []),
        ...(project.techStack || [])
    ].filter(Boolean).join(', ');

    // Robots meta
    const robotsMeta = seo.robotsMeta || {};

    return {
        title: `${effectiveTitle} | UdyomX Projects`,
        description: effectiveDescription,
        keywords: keywords,
        authors: [{ name: 'UdyomX Team' }],
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: robotsMeta.index !== false,
            follow: robotsMeta.follow !== false,
            nocache: robotsMeta.noarchive === true,
            googleBot: {
                index: robotsMeta.index !== false,
                follow: robotsMeta.follow !== false,
                'max-image-preview': robotsMeta.maxImagePreview || 'large',
            },
        },
        openGraph: {
            title: seo.openGraph?.title || effectiveTitle,
            description: seo.openGraph?.description || effectiveDescription,
            url: canonicalUrl,
            siteName: 'UdyomX ORG',
            images: effectiveImage ? [{
                url: effectiveImage,
                width: 1200,
                height: 630,
                alt: seo.openGraph?.title || effectiveTitle,
            }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.twitterCard?.title || effectiveTitle,
            description: seo.twitterCard?.description || effectiveDescription,
            images: seo.twitterCard?.image || effectiveImage ? [seo.twitterCard?.image || effectiveImage] : [],
            creator: '@udyomx',
            site: '@udyomx',
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  // Generate JSON-LD structured data
  const jsonLd = generateJsonLd(project);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Projects',
                item: `${SITE_URL}/projects`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: project.name || project.title,
                item: `${SITE_URL}/projects/${project.slug}`,
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-[#F5F1E8]">
        {/* Back Navigation */}
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 pt-4 md:pt-6">
          <Link
            href="/projects"
            className="
              inline-flex items-center gap-2 px-4 py-2
              bg-[#F5F1E8] border-[3px] border-[#2C2416]
              shadow-[3px_3px_0_0_#2C2416]
              hover:shadow-[1px_1px_0_0_#2C2416]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-150
              font-black text-[12px] text-[#2C2416] uppercase tracking-wider
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <ProjectDetailLayout project={project} />
      </div>
    </>
  );
}

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projects = await projectAPI.getAll();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return [];
  }
}
