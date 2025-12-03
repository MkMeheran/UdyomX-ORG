import { ProfileCard } from '@/components/home/profile-card';
import { WelcomeSection } from '@/components/home/welcome-section';
import { LatestUpdates } from '@/components/home/latest-updates';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F5F5F0]">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Profile Card */}
                <div>
                    <ProfileCard />
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-8">
                    {/* Left Column: Welcome Section */}
                    <div>
                        <WelcomeSection />
                    </div>

                    {/* Right Column: Latest Updates */}
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-4">
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
