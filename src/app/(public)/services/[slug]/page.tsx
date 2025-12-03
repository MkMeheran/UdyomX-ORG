import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serviceAPI, projectAPI } from '@/lib/api';
import { ServiceDetailLayout } from '@/components/service/ServiceDetailLayout';
import type { ServiceFull } from '@/types/service';

interface ServicePageProps {
    params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const service = await serviceAPI.getBySlug(params.slug) as ServiceFull | undefined;

    if (!service) {
        return {
            title: 'Service Not Found',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://udyomx.com';
    const canonicalUrl = service.canonicalUrl || `${baseUrl}/services/${service.slug}`;
    const ogImage = service.ogImage || service.seoImage || service.coverImage || service.thumbnail;

    return {
        title: service.seoTitle || `${service.title} | Services`,
        description: service.seoDescription || service.hookLine || service.title,
        keywords: service.seoKeywords?.join(', '),
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: service.indexable !== false,
            follow: service.indexable !== false,
        },
        openGraph: {
            title: service.ogTitle || service.seoTitle || service.title,
            description: service.ogDescription || service.seoDescription || service.hookLine,
            url: canonicalUrl,
            siteName: 'UdyomX',
            images: ogImage ? [{
                url: ogImage,
                width: 1200,
                height: 628,
                alt: service.title,
            }] : [],
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: service.twitterCard || 'summary_large_image',
            title: service.ogTitle || service.seoTitle || service.title,
            description: service.ogDescription || service.seoDescription || service.hookLine,
            images: ogImage ? [ogImage] : [],
            creator: '@udyomx',
        },
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const service = await serviceAPI.getBySlug(params.slug) as ServiceFull | undefined;

    if (!service) {
        notFound();
    }

    // Get related projects
    const allProjects = await projectAPI.getAll();
    const relatedProjects = allProjects.slice(0, 4);

    return (
        <ServiceDetailLayout 
            service={service} 
            relatedProjects={relatedProjects}
        />
    );
}
