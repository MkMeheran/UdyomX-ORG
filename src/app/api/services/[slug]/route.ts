import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

// GET /api/services/[slug] - Get single service with all relations
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = getServerClient();
        
        const { data: service, error } = await supabase
            .from('services')
            .select(`
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
                    projects (id, name, slug, thumbnail, description)
                )
            `)
            .eq('slug', slug)
            .single();
        
        if (error || !service) {
            console.error('❌ Service Not Found:', error);
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        
        // Type assertion for service data
        const s = service as any;
        
        // Transform snake_case to camelCase for frontend
        const transformedService = {
            id: s.id,
            slug: s.slug,
            title: s.title,
            hookLine: s.hook_line,
            description: s.description,
            contentFormat: s.content_format,
            category: s.category,
            thumbnail: s.thumbnail,
            coverImage: s.cover_image,
            status: s.status,
            showGallery: s.show_gallery,
            showDownloads: s.show_downloads,
            publishDate: s.publish_date,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            // SEO Fields
            seoTitle: s.seo_title,
            seoDescription: s.seo_description,
            seoKeywords: s.seo_keywords,
            seoImage: s.seo_image,
            canonicalUrl: s.canonical_url,
            // AI/LLM SEO Fields
            shortSummary: s.short_summary,
            longSummary: s.long_summary,
            painPoints: s.pain_points,
            solutionsOffered: s.solutions_offered,
            keyBenefits: s.key_benefits,
            pricing: s.pricing,
            useCases: s.use_cases,
            targetAudience: s.target_audience,
            toolsUsed: s.tools_used,
            // Visual
            clientLogos: s.client_logos,
            // Technical SEO
            ogTitle: s.og_title,
            ogDescription: s.og_description,
            ogImage: s.og_image,
            twitterCard: s.twitter_card,
            indexable: s.indexable,
            sitemapPriority: s.sitemap_priority,
            lastUpdated: s.last_updated,
            // Contact
            contactWhatsApp: s.contact_whatsapp,
            contactTelegram: s.contact_telegram,
            contactTwitter: s.contact_twitter,
            contactInstagram: s.contact_instagram,
            contactFacebook: s.contact_facebook,
            contactLinkedIn: s.contact_linkedin,
            contactEmail: s.contact_email,
            // Relations
            features: s.service_features?.sort((a: any, b: any) => a.order_index - b.order_index).map((f: any) => ({
                id: f.id,
                icon: f.icon,
                title: f.title,
                description: f.description,
                orderIndex: f.order_index
            })) || [],
            packages: s.service_packages?.sort((a: any, b: any) => a.order_index - b.order_index).map((p: any) => ({
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
            problems: s.service_problems?.sort((a: any, b: any) => a.order_index - b.order_index).map((p: any) => ({
                id: p.id,
                text: p.text,
                orderIndex: p.order_index
            })) || [],
            solutions: s.service_solutions?.sort((a: any, b: any) => a.order_index - b.order_index).map((sol: any) => ({
                id: sol.id,
                text: sol.text,
                orderIndex: sol.order_index
            })) || [],
            testimonials: s.service_testimonials?.sort((a: any, b: any) => a.order_index - b.order_index).map((t: any) => ({
                id: t.id,
                name: t.name,
                avatar: t.avatar,
                rating: t.rating,
                quote: t.quote,
                orderIndex: t.order_index
            })) || [],
            gallery: s.service_gallery?.sort((a: any, b: any) => a.order_index - b.order_index).map((g: any) => ({
                id: g.id,
                type: g.type,
                url: g.url,
                thumbnailUrl: g.thumbnail_url,
                caption: g.caption,
                orderIndex: g.order_index
            })) || [],
            downloads: s.service_downloads?.sort((a: any, b: any) => a.order_index - b.order_index).map((d: any) => ({
                id: d.id,
                fileUrl: d.file_url,
                label: d.label,
                fileSize: d.file_size,
                fileType: d.file_type,
                downloadCount: d.download_count,
                orderIndex: d.order_index
            })) || [],
            faqs: s.service_faqs?.sort((a: any, b: any) => a.order_index - b.order_index).map((f: any) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                orderIndex: f.order_index
            })) || [],
            relatedProjects: s.service_related_projects?.sort((a: any, b: any) => a.order_index - b.order_index).map((rp: any) => ({
                id: rp.project_id,
                name: rp.projects?.name,
                slug: rp.projects?.slug,
                thumbnail: rp.projects?.thumbnail,
                description: rp.projects?.description
            })) || []
        };
        
        console.log(`✅ Service API: Found service "${s.title}"`);
        return NextResponse.json(transformedService);
    } catch (error) {
        console.error('❌ Service API Exception:', error);
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

// PUT /api/services/[slug] - Update service
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = getServerClient();
        const body = await request.json();
        
        // Get existing service
        const { data: existingService, error: findError } = await supabase
            .from('services')
            .select('id')
            .eq('slug', slug)
            .single();
        
        if (findError || !existingService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        
        const serviceId = (existingService as any).id;
        
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
            last_updated: serviceData.lastUpdated || new Date().toISOString(),
            // Contact
            contact_whatsapp: serviceData.contactWhatsApp,
            contact_telegram: serviceData.contactTelegram,
            contact_twitter: serviceData.contactTwitter,
            contact_instagram: serviceData.contactInstagram,
            contact_facebook: serviceData.contactFacebook,
            contact_linkedin: serviceData.contactLinkedIn,
            contact_email: serviceData.contactEmail
        };
        
        // Update service
        // @ts-ignore - Supabase types mismatch
        const { error: updateError } = await supabase
            .from('services')
            .update(dbServiceData)
            .eq('id', serviceId);
        
        if (updateError) {
            console.error('❌ Update Service Error:', updateError);
            return NextResponse.json({ 
                error: 'Failed to update service', 
                details: updateError.message,
                code: updateError.code 
            }, { status: 400 });
        }
        
        // Delete existing relations and re-insert
        await Promise.all([
            supabase.from('service_features').delete().eq('service_id', serviceId),
            supabase.from('service_packages').delete().eq('service_id', serviceId),
            supabase.from('service_problems').delete().eq('service_id', serviceId),
            supabase.from('service_solutions').delete().eq('service_id', serviceId),
            supabase.from('service_testimonials').delete().eq('service_id', serviceId),
            supabase.from('service_gallery').delete().eq('service_id', serviceId),
            supabase.from('service_downloads').delete().eq('service_id', serviceId),
            supabase.from('service_faqs').delete().eq('service_id', serviceId),
            supabase.from('service_related_projects').delete().eq('service_id', serviceId)
        ]);
        
        // Insert related data
        const insertRelatedData = async (tableName: string, items: any[], transformer: (item: any, idx: number) => any) => {
            if (items && items.length > 0) {
                const transformedItems = items.map((item, idx) => transformer(item, idx));
                // Filter out items with null required fields
                const validItems = tableName === 'service_downloads' 
                    ? transformedItems.filter(item => item.file_url)
                    : transformedItems;
                
                if (validItems.length > 0) {
                    const { error } = await supabase
                        .from(tableName)
                        .insert(validItems);
                    if (error) console.error(`❌ Insert ${tableName} Error:`, error);
                }
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
        
        console.log(`✅ Service Updated: "${serviceData.title}"`);
        return NextResponse.json({ id: serviceId, ...serviceData });
    } catch (error: any) {
        console.error('❌ Update Service Exception:', error);
        return NextResponse.json({ 
            error: 'Failed to update service',
            details: error?.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 });
    }
}

// DELETE /api/services/[slug] - Delete service
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = getServerClient();
        
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('slug', slug);
        
        if (error) {
            console.error('❌ Delete Service Error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        console.log(`✅ Service Deleted: "${slug}"`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Delete Service Exception:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
