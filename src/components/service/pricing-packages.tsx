'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Package, Star, ArrowRight } from 'lucide-react';
import type { ServicePackage } from '@/types/service';

interface PricingPackagesProps {
    packages: ServicePackage[];
    onCheckout?: (pkg: ServicePackage) => void;
}

export function PricingPackages({ packages, onCheckout }: PricingPackagesProps) {
    if (packages.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
    };

    // Determine grid columns based on package count
    const getGridClass = () => {
        if (packages.length === 1) return 'md:grid-cols-1 max-w-md mx-auto';
        if (packages.length === 2) return 'md:grid-cols-2 max-w-3xl mx-auto';
        return 'md:grid-cols-3';
    };

    return (
        <section id="packages" className="py-6 md:py-10 bg-[#F0F0F3] scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black text-[#2C2416] mb-3">
                        Choose Your Package
                    </h2>
                    <p className="text-[#5A5247] font-medium text-lg max-w-2xl mx-auto">
                        Select the perfect plan for your needs. All packages include professional support.
                    </p>
                </div>

                {/* Packages Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`grid ${getGridClass()} gap-6`}
                >
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            variants={item}
                            className={`
                                relative bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                                hover:-translate-x-1 hover:-translate-y-1
                                hover:shadow-[8px_8px_0_0_rgba(44,36,22,0.4)]
                                transition-all duration-150
                                flex flex-col
                                ${pkg.isPopular ? 'md:-translate-y-2 md:scale-[1.02]' : ''}
                            `}
                        >
                            {/* Popular Badge */}
                            {pkg.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <div
                                        className="
                                            flex items-center gap-1.5 px-4 py-1.5
                                            bg-[#F5C542] text-[#2C2416]
                                            border-[3px] border-[#2C2416]
                                            shadow-[3px_3px_0_0_#2C2416]
                                            text-[11px] font-black uppercase tracking-wider
                                        "
                                    >
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        MOST POPULAR
                                    </div>
                                </div>
                            )}

                            {/* Package Header */}
                            <div className={`p-6 border-b-[4px] border-[#2C2416] ${pkg.isPopular ? 'bg-[#F5C542]/20' : ''}`}>
                                <h3 className="text-xl md:text-2xl font-black text-[#2C2416] mb-3">
                                    {pkg.title}
                                </h3>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    {pkg.discountPrice ? (
                                        <>
                                            <span className="text-lg text-[#7A7568] line-through font-semibold">
                                                ${pkg.price}
                                            </span>
                                            <span className="text-4xl font-black text-[#2C2416]">
                                                ${pkg.discountPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-black text-[#2C2416]">
                                            ${pkg.price}
                                        </span>
                                    )}
                                    <span className="text-[#5A5247] font-medium text-sm">/project</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="p-6 flex-1">
                                <ul className="space-y-3">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#16A34A]" strokeWidth={2.5} />
                                            <span className="text-[14px] text-[#5A5247] font-semibold">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Meta Info */}
                            <div className="px-6 py-3 bg-[#E8E4DC] border-t-[3px] border-[#2C2416] flex items-center justify-center gap-5">
                                <div className="flex items-center gap-1.5 text-[13px] text-[#5A5247] font-semibold">
                                    <Clock className="w-4 h-4" />
                                    <span>{pkg.deliveryTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[13px] text-[#5A5247] font-semibold">
                                    <Package className="w-4 h-4" />
                                    <span>{pkg.revisions} revisions</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="p-5">
                                <button
                                    onClick={() => onCheckout?.(pkg)}
                                    className={`
                                        w-full py-3.5 px-4 flex items-center justify-center gap-2
                                        border-[4px] border-[#2C2416]
                                        shadow-[4px_4px_0_0_#2C2416]
                                        font-black text-[14px] uppercase tracking-wider
                                        hover:shadow-[2px_2px_0_0_#2C2416]
                                        hover:translate-x-[2px] hover:translate-y-[2px]
                                        active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                                        transition-all duration-150
                                        ${pkg.isPopular 
                                            ? 'bg-[#F5C542] text-[#2C2416]' 
                                            : 'bg-white text-[#2C2416] hover:bg-[#F5C542]'
                                        }
                                    `}
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
