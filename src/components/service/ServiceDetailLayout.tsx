'use client';

import { useRouter } from 'next/navigation';
import { ServiceHero } from './service-hero';
import { ProblemSolution } from './problem-solution';
import { FeaturesGrid } from './features-grid';
import { ServicePortfolio } from './service-portfolio';
import { TestimonialsSection } from './testimonials-section';
import { PricingPackages } from './pricing-packages';
import { ServiceFAQ } from './service-faq';
import { MediaGallery } from '@/components/blog/media-gallery';
import { StickyCTA } from './sticky-cta';
import { MDXRenderer } from '@/components/common/MDXRenderer';
import { MediaLightbox } from '@/components/common/MediaLightbox';
import type { ServiceFull } from '@/types/service';
import type { Project, FAQ, GalleryItem } from '@/types';

interface ServiceDetailLayoutProps {
    service: ServiceFull;
    relatedProjects?: Project[];
}

export function ServiceDetailLayout({ service, relatedProjects = [] }: ServiceDetailLayoutProps) {
    const router = useRouter();

    const handleCheckout = (pkg: any) => {
        // Redirect to contact page with service and package info
        const params = new URLSearchParams();
        params.set('service', service.title);
        if (pkg?.title) {
            params.set('package', pkg.title);
        }
        
        // Pass custom contact info if available (from service data)
        // These will override defaults in contact page
        const serviceData = service as any; // Cast to access extra fields
        if (serviceData.contactWhatsApp) params.set('whatsapp', serviceData.contactWhatsApp);
        if (serviceData.contactTelegram) params.set('telegram', serviceData.contactTelegram);
        if (serviceData.contactTwitter) params.set('twitter', serviceData.contactTwitter);
        if (serviceData.contactInstagram) params.set('instagram', serviceData.contactInstagram);
        if (serviceData.contactFacebook) params.set('facebook', serviceData.contactFacebook);
        if (serviceData.contactLinkedIn) params.set('linkedin', serviceData.contactLinkedIn);
        if (serviceData.contactEmail) params.set('email', serviceData.contactEmail);
        
        router.push(`/contact?${params.toString()}`);
    };

    // FAQs - use from service data if available, otherwise use defaults
    const serviceFaqs: FAQ[] = service.faqs?.length ? service.faqs : [
        { question: 'How long does the project typically take?', answer: 'Project timelines vary based on scope and complexity. Our standard packages range from 2-12 weeks. We\'ll provide a detailed timeline during the discovery phase.' },
        { question: 'What is your revision policy?', answer: 'Each package includes a specific number of revision rounds. We work collaboratively to ensure you\'re satisfied with the final result.' },
        { question: 'Do you offer ongoing support?', answer: 'Yes! All packages include post-launch support. We also offer monthly maintenance plans for continued assistance.' },
        { question: 'Can I upgrade my package later?', answer: 'Absolutely. You can upgrade at any time by paying the difference between packages. We\'ll seamlessly continue your project.' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F0]">
            {/* JSON-LD Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        name: service.title,
                        description: service.hookLine || service.title,
                        provider: {
                            '@type': 'Organization',
                            name: 'UdyomX',
                        },
                        offers: service.packages?.map(pkg => ({
                            '@type': 'Offer',
                            name: pkg.title,
                            price: pkg.discountPrice || pkg.price,
                            priceCurrency: 'USD',
                        })),
                    }),
                }}
            />

            {/* ═══════════════════════════════════════════════════════════
                1. HERO SECTION - Cover Image + Title Card
            ═══════════════════════════════════════════════════════════ */}
            <ServiceHero
                title={service.title}
                hookLine={service.hookLine}
                category={service.category}
                deliveryTime={service.packages?.[0]?.deliveryTime}
                coverImage={service.coverImage || service.thumbnail}
            />

            {/* ═══════════════════════════════════════════════════════════
                2. SERVICE DESCRIPTION (HTML/MDX) - Second Box
            ═══════════════════════════════════════════════════════════ */}
            {service.description && (
                <section className="py-6 md:py-10 bg-[#F5F5F0]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div
                            className="
                                bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                                p-6 md:p-10 overflow-hidden
                            "
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                hyphens: 'auto'
                            }}
                        >
                            {/* Render based on content format */}
                            {service.contentFormat === 'html' ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: service.description }}
                                    className="
                                        prose prose-lg max-w-none
                                        prose-headings:font-black prose-headings:text-[#2C2416]
                                        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h2:mt-8
                                        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3
                                        prose-p:text-[#5A5247] prose-p:font-medium prose-p:leading-relaxed prose-p:text-[16px]
                                        prose-a:text-[#2196F3] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-[#2C2416] prose-strong:font-black
                                        prose-ul:text-[#5A5247] prose-ol:text-[#5A5247]
                                        prose-li:font-medium prose-li:text-[16px]
                                    "
                                    style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal'
                                    }}
                                />
                            ) : (
                                <MDXRenderer 
                                    content={service.description} 
                                    className="prose-lg"
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                3. PROBLEM & SOLUTION SPLIT
            ═══════════════════════════════════════════════════════════ */}
            {(service.problems?.length || service.solutions?.length) && (
                <ProblemSolution
                    problems={service.problems || []}
                    solutions={service.solutions || []}
                />
            )}

            {/* ═══════════════════════════════════════════════════════════
                4. SERVICE FEATURES / WHAT YOU GET
            ═══════════════════════════════════════════════════════════ */}
            {service.features && service.features.length > 0 && (
                <FeaturesGrid features={service.features} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                5. PRICING / PACKAGES (Subscription Model)
            ═══════════════════════════════════════════════════════════ */}
            {service.packages && service.packages.length > 0 && (
                <PricingPackages packages={service.packages} onCheckout={handleCheckout} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                6. FAQ SECTION
            ═══════════════════════════════════════════════════════════ */}
            <ServiceFAQ faqs={serviceFaqs} />

            {/* ═══════════════════════════════════════════════════════════
                7. GALLERY & DOWNLOADS
            ═══════════════════════════════════════════════════════════ */}
            {service.showGallery && service.gallery && service.gallery.length > 0 && (
                <div className="py-6 md:py-10 bg-[#F0F0F3]">
                    <div className="max-w-7xl mx-auto px-4">
                        <MediaGallery 
                            images={service.gallery as GalleryItem[]} 
                            title="Service Gallery"
                        />
                    </div>
                </div>
            )}

            {/* Downloads Section */}
            {service.showDownloads && service.downloads && service.downloads.length > 0 && (
                <section className="py-6 md:py-10 bg-[#F5F5F0]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="bg-[#F5F1E8] border-[4px] border-[#2C2416] p-6 md:p-8 shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]">
                            {/* Section Header */}
                            <div className="mb-6 pb-4 border-b-[3px] border-[#2C2416]">
                                <h3 className="text-2xl md:text-3xl font-black text-[#2C2416] flex items-center gap-3">
                                    <span className="w-12 h-12 flex items-center justify-center bg-[#2196F3] border-[3px] border-[#2C2416] shadow-[3px_3px_0_0_#2C2416] text-2xl">
                                        📥
                                    </span>
                                    Downloads
                                </h3>
                                <p className="text-[#5A5247] font-medium text-sm mt-2 ml-[60px]">
                                    Click to download resources and files
                                </p>
                            </div>
                            
                            {/* Downloads Grid */}
                            <div className="grid gap-3 md:gap-4">
                                {service.downloads.map((download) => (
                                    <a
                                        key={download.id}
                                        href={download.fileUrl}
                                        download
                                        className="
                                            group flex items-center justify-between p-4 md:p-5
                                            bg-white border-[3px] border-[#2C2416]
                                            shadow-[4px_4px_0_0_rgba(44,36,22,0.3)]
                                            hover:-translate-x-1 hover:-translate-y-1
                                            hover:shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                                            hover:bg-[#F5C542]
                                            active:translate-x-0 active:translate-y-0
                                            active:shadow-[3px_3px_0_0_rgba(44,36,22,0.3)]
                                            transition-all duration-150
                                        "
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* File Icon */}
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#F5F1E8] border-[2px] border-[#2C2416] group-hover:bg-white transition-colors">
                                                <span className="text-2xl">
                                                    {download.fileType?.toLowerCase() === 'pdf' ? '📄' : 
                                                     download.fileType?.toLowerCase() === 'zip' || download.fileType?.toLowerCase() === 'rar' ? '📦' : 
                                                     download.fileType?.toLowerCase() === 'doc' || download.fileType?.toLowerCase() === 'docx' ? '📝' : 
                                                     download.fileType?.toLowerCase() === 'xls' || download.fileType?.toLowerCase() === 'xlsx' ? '📊' :
                                                     download.fileType?.toLowerCase() === 'png' || download.fileType?.toLowerCase() === 'jpg' || download.fileType?.toLowerCase() === 'jpeg' ? '🖼️' : '📎'}
                                                </span>
                                            </div>
                                            
                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-[#2C2416] text-[15px] md:text-[16px] leading-tight break-words" style={{overflowWrap: 'break-word', wordBreak: 'break-word'}}>
                                                    {download.label}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    {download.fileType && (
                                                        <span className="inline-block px-2 py-0.5 bg-[#2C2416] text-white text-[10px] font-bold uppercase tracking-wider">
                                                            {download.fileType}
                                                        </span>
                                                    )}
                                                    {download.fileSize && (
                                                        <span className="text-xs text-[#5A5247] font-medium">
                                                            {download.fileSize}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Download Arrow */}
                                        <div className="flex-shrink-0 ml-3">
                                            <div className="w-10 h-10 flex items-center justify-center border-[2px] border-[#2C2416] bg-[#F5F1E8] group-hover:bg-[#2C2416] transition-colors">
                                                <span className="text-[#2C2416] group-hover:text-white font-black text-xl transition-colors">
                                                    ↓
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                8. CLIENT TESTIMONIALS
            ═══════════════════════════════════════════════════════════ */}
            {service.testimonials && service.testimonials.length > 0 && (
                <TestimonialsSection testimonials={service.testimonials} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                9. RELATED PROJECTS / PORTFOLIO
            ═══════════════════════════════════════════════════════════ */}
            {relatedProjects.length > 0 && (
                <ServicePortfolio projects={relatedProjects} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                STICKY CTA
            ═══════════════════════════════════════════════════════════ */}
            {service.packages && service.packages.length > 0 && (
                <StickyCTA packages={service.packages} onCheckout={handleCheckout} />
            )}

            {/* Bottom padding for sticky CTA */}
            <div className="h-20" />

            {/* Media Lightbox */}
            <MediaLightbox trigger=".lightbox-trigger" />
        </div>
    );
}
