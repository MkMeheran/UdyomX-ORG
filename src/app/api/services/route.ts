import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

// GET /api/services - Get all services with relations
export async function GET(request: Request) {
    try {
        const supabase = getServerClient();
        const { searchParams } = new URL(request.url);
        const includeRelations = searchParams.get('relations') === 'true';
        const status = searchParams.get('status') || 'published';
        
        // Base query
        let query = supabase
            .from('services')
            .select(includeRelations 
                ? `
                    *,
                    service_features (*),
                    service_packages (*),
                    service_problems (*),
                    service_solutions (*),
                    service_testimonials (*),
                    service_gallery (*),
                    service_downloads (*),
                    service_faqs (*),
                    service_related_projects (
                        project_id,
                        order_index,
                        projects (id, name, slug, thumbnail)
                    )
                `
                : '*'
            )
            .order('created_at', { ascending: false });
        
        // Filter by status (for admin, allow 'all')
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        
        const { data: services, error } = await query;
        
        if (error) {
            console.error('❌ Services API Error:', error);
            return NextResponse.json([], { status: 200 });
        }
        
        // Transform snake_case to camelCase for frontend
        const transformedServices = (services || []).map(service => ({
            id: service.id,
            slug: service.slug,
            title: service.title,
            hookLine: service.hook_line,
            description: service.description,
            contentFormat: service.content_format,
            category: service.category,
            thumbnail: service.thumbnail,
            coverImage: service.cover_image,
            status: service.status,
            showGallery: service.show_gallery,
            showDownloads: service.show_downloads,
            publishDate: service.publish_date,
            createdAt: service.created_at,
            updatedAt: service.updated_at,
            // SEO Fields
            seoTitle: service.seo_title,
            seoDescription: service.seo_description,
            seoKeywords: service.seo_keywords,
            seoImage: service.seo_image,
            canonicalUrl: service.canonical_url,
            // AI/LLM SEO Fields
            shortSummary: service.short_summary,
            longSummary: service.long_summary,
            painPoints: service.pain_points,
            solutionsOffered: service.solutions_offered,
            keyBenefits: service.key_benefits,
            pricing: service.pricing,
            useCases: service.use_cases,
            targetAudience: service.target_audience,
            toolsUsed: service.tools_used,
            // Visual
            clientLogos: service.client_logos,
            // Technical SEO
            ogTitle: service.og_title,
            ogDescription: service.og_description,
            ogImage: service.og_image,
            twitterCard: service.twitter_card,
            indexable: service.indexable,
            sitemapPriority: service.sitemap_priority,
            lastUpdated: service.last_updated,
            // Contact
            contactWhatsApp: service.contact_whatsapp,
            contactTelegram: service.contact_telegram,
            contactTwitter: service.contact_twitter,
            contactInstagram: service.contact_instagram,
            contactFacebook: service.contact_facebook,
            contactLinkedIn: service.contact_linkedin,
            contactEmail: service.contact_email,
            // Relations (if included)
            ...(includeRelations && {
                features: service.service_features?.sort((a: any, b: any) => a.order_index - b.order_index).map((f: any) => ({
                    id: f.id,
                    icon: f.icon,
                    title: f.title,
                    description: f.description,
                    orderIndex: f.order_index
                })) || [],
                packages: service.service_packages?.sort((a: any, b: any) => a.order_index - b.order_index).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    discountPrice: p.discount_price,
                    features: p.features,
                    deliveryTime: p.delivery_time,
                    revisions: p.revisions,
                    isPopular: p.is_popular,
                    orderIndex: p.order_index
                })) || [],
                problems: service.service_problems?.sort((a: any, b: any) => a.order_index - b.order_index).map((p: any) => ({
                    id: p.id,
                    text: p.text,
                    orderIndex: p.order_index
                })) || [],
                solutions: service.service_solutions?.sort((a: any, b: any) => a.order_index - b.order_index).map((s: any) => ({
                    id: s.id,
                    text: s.text,
                    orderIndex: s.order_index
                })) || [],
                testimonials: service.service_testimonials?.sort((a: any, b: any) => a.order_index - b.order_index).map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    avatar: t.avatar,
                    rating: t.rating,
                    quote: t.quote,
                    orderIndex: t.order_index
                })) || [],
                gallery: service.service_gallery?.sort((a: any, b: any) => a.order_index - b.order_index).map((g: any) => ({
                    id: g.id,
                    type: g.type,
                    url: g.url,
                    thumbnailUrl: g.thumbnail_url,
                    caption: g.caption,
                    orderIndex: g.order_index
                })) || [],
                downloads: service.service_downloads?.sort((a: any, b: any) => a.order_index - b.order_index).map((d: any) => ({
                    id: d.id,
                    fileUrl: d.file_url,
                    label: d.label,
                    fileSize: d.file_size,
                    fileType: d.file_type,
                    downloadCount: d.download_count,
                    orderIndex: d.order_index
                })) || [],
                faqs: service.service_faqs?.sort((a: any, b: any) => a.order_index - b.order_index).map((f: any) => ({
                    id: f.id,
                    question: f.question,
                    answer: f.answer,
                    orderIndex: f.order_index
                })) || [],
                relatedProjects: service.service_related_projects?.sort((a: any, b: any) => a.order_index - b.order_index).map((rp: any) => ({
                    id: rp.project_id,
                    name: rp.projects?.name,
                    slug: rp.projects?.slug,
                    thumbnail: rp.projects?.thumbnail
                })) || []
            })
        }));
        
        console.log(`✅ Services API: Found ${transformedServices.length} services`);
        return NextResponse.json(transformedServices);
    } catch (error) {
        console.error('❌ Services API Exception:', error);
        return NextResponse.json([], { status: 200 });
    }
}

// POST /api/services - Create new service with relations
export async function POST(request: Request) {
    try {
        const supabase = getServerClient();
        const body = await request.json();
        
        // Extract relations from body
        const { 
            features, packages, problems, solutions, testimonials,
            gallery, downloads, faqs, relatedProjects,
            ...serviceData 
        } = body;
        
        // Transform camelCase to snake_case for database
        const dbServiceData = {
            slug: serviceData.slug,
            title: serviceData.title,
            hook_line: serviceData.hookLine,
            description: serviceData.description,
            content_format: serviceData.contentFormat || 'mdx',
            category: serviceData.category,
            thumbnail: serviceData.thumbnail,
            cover_image: serviceData.coverImage,
            status: serviceData.status || 'draft',
            show_gallery: serviceData.showGallery ?? false,
            show_downloads: serviceData.showDownloads ?? false,
            publish_date: serviceData.publishDate,
            // SEO Fields
            seo_title: serviceData.seoTitle,
            seo_description: serviceData.seoDescription,
            seo_keywords: serviceData.seoKeywords,
            seo_image: serviceData.seoImage,
            canonical_url: serviceData.canonicalUrl,
            // AI/LLM SEO
            short_summary: serviceData.shortSummary,
            long_summary: serviceData.longSummary,
            pain_points: serviceData.painPoints,
            solutions_offered: serviceData.solutionsOffered,
            key_benefits: serviceData.keyBenefits,
            pricing: serviceData.pricing,
            use_cases: serviceData.useCases,
            target_audience: serviceData.targetAudience,
            tools_used: serviceData.toolsUsed,
            // Visual
            client_logos: serviceData.clientLogos,
            // Technical SEO
            og_title: serviceData.ogTitle,
            og_description: serviceData.ogDescription,
            og_image: serviceData.ogImage,
            twitter_card: serviceData.twitterCard,
            indexable: serviceData.indexable ?? true,
            sitemap_priority: serviceData.sitemapPriority,
            last_updated: serviceData.lastUpdated,
            // Contact
            contact_whatsapp: serviceData.contactWhatsApp,
            contact_telegram: serviceData.contactTelegram,
            contact_twitter: serviceData.contactTwitter,
            contact_instagram: serviceData.contactInstagram,
            contact_facebook: serviceData.contactFacebook,
            contact_linkedin: serviceData.contactLinkedIn,
            contact_email: serviceData.contactEmail
        };
        
        // Insert service
        const { data: service, error: serviceError } = await supabase
            .from('services')
            .insert([dbServiceData])
            .select()
            .single();
        
        if (serviceError) {
            console.error('❌ Create Service Error:', serviceError);
            return NextResponse.json({ error: serviceError.message }, { status: 400 });
        }
        
        const serviceId = service.id;
        
        // Insert related data
        const insertRelatedData = async (tableName: string, items: any[], transformer: (item: any, idx: number) => any) => {
            if (items && items.length > 0) {
                const { error } = await supabase
                    .from(tableName)
                    .insert(items.map((item, idx) => transformer(item, idx)));
                if (error) console.error(`❌ Insert ${tableName} Error:`, error);
            }
        };
        
        await Promise.all([
            insertRelatedData('service_features', features, (f, idx) => ({
                service_id: serviceId,
                icon: f.icon,
                title: f.title,
                description: f.description,
                order_index: f.orderIndex ?? idx
            })),
            insertRelatedData('service_packages', packages, (p, idx) => ({
                service_id: serviceId,
                title: p.title,
                price: p.price,
                discount_price: p.discountPrice,
                features: p.features,
                delivery_time: p.deliveryTime,
                revisions: p.revisions,
                is_popular: p.isPopular,
                order_index: p.orderIndex ?? idx
            })),
            insertRelatedData('service_problems', problems, (p, idx) => ({
                service_id: serviceId,
                text: p.text,
                order_index: p.orderIndex ?? idx
            })),
            insertRelatedData('service_solutions', solutions, (s, idx) => ({
                service_id: serviceId,
                text: s.text,
                order_index: s.orderIndex ?? idx
            })),
            insertRelatedData('service_testimonials', testimonials, (t, idx) => ({
                service_id: serviceId,
                name: t.name,
                avatar: t.avatar,
                rating: t.rating,
                quote: t.quote,
                order_index: t.orderIndex ?? idx
            })),
            insertRelatedData('service_gallery', gallery, (g, idx) => ({
                service_id: serviceId,
                type: g.type,
                url: g.url,
                thumbnail_url: g.thumbnailUrl,
                caption: g.caption,
                order_index: g.orderIndex ?? idx
            })),
            insertRelatedData('service_downloads', downloads, (d, idx) => ({
                service_id: serviceId,
                file_url: d.fileUrl,
                label: d.label,
                file_size: d.fileSize,
                file_type: d.fileType,
                order_index: d.orderIndex ?? idx
            })),
            insertRelatedData('service_faqs', faqs, (f, idx) => ({
                service_id: serviceId,
                question: f.question,
                answer: f.answer,
                order_index: f.orderIndex ?? idx
            }))
        ]);
        
        // Handle related projects
        if (relatedProjects && relatedProjects.length > 0) {
            // First, get project IDs from slugs if needed
            const projectSlugs = relatedProjects.map((p: any) => typeof p === 'string' ? p : p.slug);
            const { data: projects } = await supabase
                .from('projects')
                .select('id, slug')
                .in('slug', projectSlugs);
            
            if (projects && projects.length > 0) {
                const projectRelations = projects.map((proj, idx) => ({
                    service_id: serviceId,
                    project_id: proj.id,
                    order_index: idx
                }));
                
                await supabase.from('service_related_projects').insert(projectRelations);
            }
        }
        
        return NextResponse.json({ id: serviceId, ...serviceData });
    } catch (error) {
        console.error('❌ Create Service Exception:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
