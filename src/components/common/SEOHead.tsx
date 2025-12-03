import Head from 'next/head';
import type { Post, BusinessInfo, PostSEO } from '@/types/post';

interface SEOHeadProps {
    post: Post;
    businessInfo?: BusinessInfo;
    baseUrl?: string;
}

export function SEOHead({ post, businessInfo, baseUrl = '' }: SEOHeadProps) {
    const seo = post.seo || {};
    const title = seo.metaTitle || post.title;
    const description = seo.metaDescription || post.excerpt;
    const image = seo.ogImage || post.coverPhoto;
    const url = `${baseUrl}/blog/${post.slug}`;
    const keywords = seo.keywords?.join(', ') || post.tags?.join(', ') || '';

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        datePublished: post.publishedDate,
        dateModified: post.updatedDate || post.publishedDate,
        author: post.authors.map((author) => ({
            '@type': 'Person',
            name: author.name,
            ...(author.affiliation && { affiliation: author.affiliation }),
        })),
        publisher: businessInfo
            ? {
                  '@type': 'Organization',
                  name: businessInfo.name,
                  logo: businessInfo.logo,
              }
            : undefined,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };

    return (
        <Head>
            {/* Basic Meta */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
            {seo.noIndex && <meta name="robots" content="noindex,nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Article Meta */}
            <meta property="article:published_time" content={post.publishedDate} />
            {post.updatedDate && (
                <meta property="article:modified_time" content={post.updatedDate} />
            )}
            {post.authors[0]?.name && (
                <meta property="article:author" content={post.authors[0].name} />
            )}
            {post.category && <meta property="article:section" content={post.category} />}
            {post.tags?.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </Head>
    );
}

// Metadata generator for App Router
export function generatePostMetadata(post: Post, baseUrl = '') {
    const seo = post.seo || {};
    const title = seo.metaTitle || post.title;
    const description = seo.metaDescription || post.excerpt;
    const image = seo.ogImage || post.coverPhoto;
    const url = `${baseUrl}/blog/${post.slug}`;

    return {
        title,
        description,
        keywords: seo.keywords || post.tags,
        openGraph: {
            title,
            description,
            url,
            type: 'article',
            publishedTime: post.publishedDate,
            modifiedTime: post.updatedDate,
            authors: post.authors.map((a) => a.name),
            images: image ? [{ url: image, alt: post.coverPhotoAlt || title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [],
        },
        alternates: {
            canonical: seo.canonicalUrl || url,
        },
    };
}
