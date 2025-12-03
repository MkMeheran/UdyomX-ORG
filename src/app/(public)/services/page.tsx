import { serviceAPI } from '@/lib/api';
import { ServiceCard } from '@/components/service-card';
import { Wrench, Sparkles } from 'lucide-react';

export default async function ServicesPage() {
    const services = await serviceAPI.getAll();

    return (
        <div className="min-h-screen bg-[#F5F5F0] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* ═══════════════════════════════════════════════════════════
                    HERO HEADER - Chunky Brutalist Style
                ═══════════════════════════════════════════════════════════ */}
                <div className="mb-12">
                    {/* Category Badge */}
                    <div className="mb-6">
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

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2C2416] mb-4 leading-[1.1]">
                        <span className="relative inline-block">
                            All Services
                            <span 
                                className="absolute -bottom-1 left-0 w-full h-3 bg-[#F5C542] -z-10"
                                style={{ transform: 'skewX(-3deg)' }}
                            />
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-[#5A5247] font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#F5C542]" />
                        Professional services tailored to your needs
                    </p>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SERVICES GRID - Wider cards on desktop
                ═══════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <div 
                                key={service.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ServiceCard service={service} index={index} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div
                                className="
                                    bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                    shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                    p-16 text-center
                                "
                            >
                                <div
                                    className="
                                        w-20 h-20 mx-auto mb-6
                                        bg-[#2196F3] text-white
                                        border-[4px] border-[#2C2416]
                                        shadow-[4px_4px_0_0_#2C2416]
                                        flex items-center justify-center
                                    "
                                >
                                    <Wrench className="w-10 h-10" />
                                </div>
                                <p className="text-[#2C2416] text-xl font-black mb-2">
                                    No services available
                                </p>
                                <p className="text-[#7A7568] font-medium">
                                    Check back soon for new offerings!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
