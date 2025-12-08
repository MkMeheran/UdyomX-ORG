import { serviceAPI } from '@/lib/api';
import { ContentListClient } from '@/components/content-list-client';
import { Wrench } from 'lucide-react';

// ISR: Regenerate page every 60 seconds
export const revalidate = 60;

// Fetch all services (server-side)
async function getServicesForCards() {
    try {
        const services = await serviceAPI.getAll();
        return services;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export default async function ServicesPage() {
    const allServices = await getServicesForCards();

    return (
        <div className="min-h-screen bg-[#F5F5F0] py-6 md:py-12 px-3 md:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div>
                        <span
                            className="
                                inline-flex items-center gap-2 px-4 py-2
                                bg-[#2196F3] text-white
                                border-[3px] border-[#2C2416]
                                shadow-[4px_4px_0_0_#2C2416]
                                text-[12px] font-black uppercase tracking-wider
                            "
                        >
                            <Wrench className="w-4 h-4" strokeWidth={2.5} />
                            Services
                        </span>
                    </div>
                </div>

                {/* Client-side content list with search, filter, and load-more */}
                <ContentListClient
                    contentType="service"
                    initialItems={allServices}
                    categories={[
                        'All Categories',
                        'Web Development',
                        'Design',
                        'Consulting',
                        'Marketing',
                    ]}
                />
            </div>
        </div>
    );
}
