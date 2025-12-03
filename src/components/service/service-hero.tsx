'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Clock, Wrench } from 'lucide-react';

interface ServiceHeroProps {
    title: string;
    hookLine?: string;
    category?: string;
    deliveryTime?: string;
    coverImage?: string;
    theme?: string;
}

export function ServiceHero({ title, hookLine, category, deliveryTime, coverImage, theme = 'earth-ink' }: ServiceHeroProps) {
    const scrollToPackages = () => {
        document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 bg-[#F5F5F0]">
            <div className="max-w-5xl mx-auto px-4">
                {/* Chunky Brutalist Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="
                        bg-[#F5F1E8] border-[4px] border-[#2C2416]
                        shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                        p-6 md:p-10
                    "
                >
                    {/* Category Badge */}
                    {category && (
                        <div className="mb-5">
                            <span
                                className="
                                    inline-flex items-center gap-2 px-4 py-2
                                    bg-[#2196F3] text-white
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                    text-[12px] font-black uppercase tracking-wider
                                "
                            >
                                <Wrench className="w-4 h-4" />
                                {category}
                            </span>
                        </div>
                    )}

                    {/* Accent Heading */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2C2416] mb-5 leading-[1.1]">
                        <span className="relative inline-block">
                            {title}
                            <span 
                                className="absolute -bottom-1 left-0 w-full h-2.5 bg-[#F5C542] -z-10"
                                style={{ transform: 'skewX(-3deg)' }}
                            />
                        </span>
                    </h1>

                    {/* Hook Line */}
                    {hookLine && (
                        <p className="text-base md:text-lg text-[#5A5247] font-semibold mb-6 leading-relaxed">
                            {hookLine}
                        </p>
                    )}

                    {/* Meta Info & CTA */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Delivery Time Badge */}
                        {deliveryTime && (
                            <div
                                className="
                                    flex items-center gap-2 px-4 py-2
                                    bg-white text-[#2C2416]
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#D1D1D1]
                                    font-bold text-[13px]
                                "
                            >
                                <Clock className="w-4 h-4" />
                                <span>{deliveryTime}</span>
                            </div>
                        )}

                        {/* CTA Button */}
                        <button
                            onClick={scrollToPackages}
                            className="
                                group flex items-center gap-2 px-5 py-2
                                bg-[#F5C542] text-[#2C2416]
                                border-[3px] border-[#2C2416]
                                shadow-[3px_3px_0_0_#2C2416]
                                font-black text-[13px] uppercase tracking-wider
                                hover:shadow-[2px_2px_0_0_#2C2416]
                                hover:translate-x-[1px] hover:translate-y-[1px]
                                active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
                                transition-all duration-150
                            "
                        >
                            <span>View Packages</span>
                            <ChevronDown className="w-4 h-4 group-hover:animate-bounce" strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
