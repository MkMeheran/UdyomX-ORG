import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { blogAPI } from '@/lib/api';
import { StandardPostLayout } from '@/components/blog/layouts/standard-post-layout';
import { ResearchPaperLayout } from '@/components/blog/layouts/research-paper-layout';
import type { BlogPost } from '@/types';

// ISR: Regenerate page every 60 seconds
export const revalidate = 60;

interface BlogPostPageProps {
    params: { slug: string };
}

// Site URL for canonical/OG URLs
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://udyomx.org';

// Generate JSON-LD structured data for the post
function generateJsonLd(post: BlogPost) {
    const seo = (post as any).seo || {};
    
    // Base Article schema
    const articleSchema: any = {
        '@context': 'https://schema.org',
        '@type': seo.schemaType || 'BlogPosting',
        headline: seo.seoTitle || seo.metaTitle || post.title,
        description: seo.metaDescription || post.excerpt,
        image: post.coverImage || post.thumbnail,
        datePublished: post.publishDate || post.publishedAt,
        dateModified: post.updatedAt || post.publishDate || post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author || 'UdyomX Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'UdyomX ORG',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${post.slug}`,
        },
        keywords: seo.primaryKeyword 
            ? [seo.primaryKeyword, ...(seo.secondaryKeywords || []), ...(post.tags || [])]
            : post.tags,
    };
    
    // Add FAQPage schema if FAQs exist
    const faqs = (post as any).faqs || [];
    if (faqs.length > 0 && seo.schemaType === 'FAQPage') {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq: any) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        };
    }
    
    // Add HowTo schema if applicable
    if (seo.schemaType === 'HowTo' && post.toc && post.toc.length > 0) {
        return {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: seo.seoTitle || seo.metaTitle || post.title,
            description: seo.metaDescription || post.excerpt,
            image: post.coverImage || post.thumbnail,
            step: post.toc.map((item: any, index: number) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: item.text || item.title,
                itemListElement: {
                    '@type': 'HowToDirection',
                    text: item.text || item.title,
                },
            })),
        };
    }
    
    return articleSchema;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = await blogAPI.getBySlug(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    // Get SEO data from post
    const seo = (post as any).seo || {};
    
    // Effective values with fallbacks
    const effectiveTitle = seo.seoTitle || seo.metaTitle || post.title;
    const effectiveDescription = seo.metaDescription || post.excerpt;
    const effectiveImage = seo.openGraph?.image || seo.twitterCard?.image || post.coverImage || post.thumbnail;
    const canonicalUrl = seo.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    
    // Keywords: primary + secondary + tags
    const keywords = [
        seo.primaryKeyword,
        ...(seo.secondaryKeywords || []),
        ...(post.tags || [])
    ].filter(Boolean).join(', ');

    // Robots meta
    const robotsMeta = seo.robotsMeta || {};
    const robotsContent = [];
    if (robotsMeta.index === false) robotsContent.push('noindex');
    else robotsContent.push('index');
    if (robotsMeta.follow === false) robotsContent.push('nofollow');
    else robotsContent.push('follow');
    if (robotsMeta.noarchive) robotsContent.push('noarchive');
    if (robotsMeta.noimageindex) robotsContent.push('noimageindex');
    if (robotsMeta.maxImagePreview) robotsContent.push(`max-image-preview:${robotsMeta.maxImagePreview}`);

    return {
        title: `${effectiveTitle} | UdyomX Blog`,
        description: effectiveDescription,
        keywords: keywords,
        authors: post.author ? [{ name: post.author }] : [{ name: 'UdyomX Team' }],
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
            type: 'article',
            publishedTime: post.publishDate || post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: post.author ? [post.author] : ['UdyomX Team'],
            tags: post.tags || [],
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await blogAPI.getBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // TODO: Check if user is premium (integrate with auth)
    const userIsPremium = false;

    // Select layout based on post type
    const Layout = post.layout === 'research' ? ResearchPaperLayout : StandardPostLayout;

    // Generate JSON-LD structured data
    const jsonLd = generateJsonLd(post);

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
                                name: 'Blog',
                                item: `${SITE_URL}/blog`,
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: post.title,
                                item: `${SITE_URL}/blog/${post.slug}`,
                            },
                        ],
                    }),
                }}
            />
            
            <Layout post={post} userIsPremium={userIsPremium} />
        </>
    );
}
