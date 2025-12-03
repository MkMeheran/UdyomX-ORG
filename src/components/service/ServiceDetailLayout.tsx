'use client';

import { useRouter } from 'next/navigation';
import { ServiceHero } from './service-hero';
import { ProblemSolution } from './problem-solution';
import { FeaturesGrid } from './features-grid';
import { ServicePortfolio } from './service-portfolio';
import { TestimonialsSection } from './testimonials-section';
import { PricingPackages } from './pricing-packages';
import { ServiceFAQ } from './service-faq';
import { GalleryDownloads } from './gallery-downloads';
import { StickyCTA } from './sticky-cta';
import { MDXRenderer } from '@/components/common/MDXRenderer';
import type { ServiceFull } from '@/types/service';
import type { Project, FAQ } from '@/types';

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
                <section className="py-10 md:py-14 bg-[#F5F5F0]">
                    <div className="max-w-5xl mx-auto px-4">
                        <div
                            className="
                                bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                                p-6 md:p-10
                            "
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
            {((service.showGallery && service.gallery?.length) || (service.showDownloads && service.downloads?.length)) && (
                <GalleryDownloads
                    gallery={service.gallery}
                    downloads={service.downloads}
                    showGallery={service.showGallery}
                    showDownloads={service.showDownloads}
                />
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
        </div>
    );
}
