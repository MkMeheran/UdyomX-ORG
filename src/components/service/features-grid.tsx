'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ServiceFeature } from '@/types/service';

interface FeaturesGridProps {
    features: ServiceFeature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
    if (features.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 },
    };

    // Accent colors for variety
    const accentColors = [
        '#2196F3', // Blue
        '#F5C542', // Yellow
        '#D35400', // Orange
        '#16A34A', // Green
        '#9C27B0', // Purple
        '#E91E63', // Pink
    ];

    return (
        <section className="py-10 md:py-14 bg-[#F5F5F0]">
            <div className="max-w-5xl mx-auto px-4">
                {/* Section Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-[#2C2416] mb-2">
                        What You Get
                    </h2>
                    <p className="text-[#5A5247] font-medium text-base max-w-2xl mx-auto">
                        Key features and deliverables included with this service
                    </p>
                </div>

                {/* Features Grid - 2-3 columns */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {features.map((feature, index) => {
                        const accentColor = accentColors[index % accentColors.length];

                        return (
                            <motion.div
                                key={feature.id}
                                variants={item}
                                className="
                                    group bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                    shadow-[4px_4px_0_0_rgba(44,36,22,0.3)]
                                    hover:-translate-x-1 hover:-translate-y-1
                                    hover:shadow-[5px_5px_0_0_rgba(44,36,22,0.3)]
                                    transition-all duration-150
                                    overflow-hidden
                                "
                            >
                                {/* Left Accent Border */}
                                <div 
                                    className="h-full flex"
                                    style={{ borderLeft: `5px solid ${accentColor}` }}
                                >
                                    <div className="p-4 flex-1">
                                        {/* Title with Check */}
                                        <div className="flex items-start gap-2 mb-2">
                                            <div
                                                className="
                                                    w-5 h-5 flex-shrink-0 mt-0.5
                                                    flex items-center justify-center
                                                    border-[2px] border-[#2C2416]
                                                "
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                            <h3 className="text-[15px] font-black text-[#2C2416] leading-tight">
                                                {feature.title}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[13px] text-[#5A5247] font-medium leading-relaxed pl-7">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
