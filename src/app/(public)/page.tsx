import { ProfileCard } from '@/components/home/profile-card';
import { WelcomeSection } from '@/components/home/welcome-section';
import { LatestUpdates } from '@/components/home/latest-updates';
import { CTASection } from '@/components/home/cta-section';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

// ISR: Regenerate homepage every 60 seconds
export const revalidate = 60;

// SEO Metadata
export const metadata: Metadata = {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: siteConfig.founder.name, url: siteConfig.urls.website }],
    creator: siteConfig.founder.name,
    publisher: siteConfig.name,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.urls.website,
        siteName: siteConfig.name,
        title: siteConfig.seo.title,
        description: siteConfig.seo.description,
        images: [
            {
                url: siteConfig.seo.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: siteConfig.seo.twitterHandle,
        creator: siteConfig.seo.twitterHandle,
        title: siteConfig.seo.title,
        description: siteConfig.seo.description,
        images: [siteConfig.seo.ogImage],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: siteConfig.urls.website,
    },
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F5F5F0]">
            <div className="max-w-7xl mx-auto px-2 md:px-4 py-3 md:py-12">
                {/* Profile Card */}
                <div>
                    <ProfileCard />
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-[1fr_400px] gap-4 md:gap-8 mb-4 md:mb-8">
                    {/* Left Column: Welcome Section */}
                    <div>
                        <WelcomeSection />
                    </div>

                    {/* Right Column: Latest Updates */}
                    <div className="bg-white border-4 border-black p-3 md:p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-2 md:mb-4">
                            <div className="w-3 h-8 bg-[#2196F3] border-2 border-black" />
                            <h2 className="text-xl font-black text-[#1A1A1A]">Latest Updates</h2>
                        </div>
                        <LatestUpdates />
                    </div>
                </div>

                {/* CTA Section */}
                <div>
                    <CTASection />
                </div>
            </div>
        </div>
    );
}
