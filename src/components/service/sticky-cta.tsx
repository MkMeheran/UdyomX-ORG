'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, Clock, Package } from 'lucide-react';
import type { ServicePackage } from '@/types/service';

interface StickyCTAProps {
    packages: ServicePackage[];
    onCheckout?: (pkg: ServicePackage) => void;
}

export function StickyCTA({ packages, onCheckout }: StickyCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            // Show CTA after scrolling past 600px (roughly past hero)
            setIsVisible(latest > 600);
        });

        return () => unsubscribe();
    }, [scrollY]);

    useEffect(() => {
        if (packages.length > 0 && !selectedPackage) {
            // Default to popular package or first package
            const popular = packages.find(p => p.isPopular);
            setSelectedPackage(popular || packages[0]);
        }
    }, [packages, selectedPackage]);

    if (packages.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: isVisible ? 0 : 100,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="
                fixed bottom-0 left-0 right-0 z-40
                bg-[#2C2416] border-t-[4px] border-[#F5C542]
                shadow-[0_-4px_20px_0_rgba(0,0,0,0.3)]
            "
            style={{
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Package Selector */}
                    <div className="flex items-center gap-4 flex-1">
                        <select
                            value={selectedPackage?.id || ''}
                            onChange={(e) => {
                                const pkg = packages.find(p => p.id === e.target.value);
                                setSelectedPackage(pkg || null);
                            }}
                            className="
                                px-4 py-2.5
                                bg-[#F5F1E8] text-[#2C2416]
                                border-[3px] border-[#F5C542]
                                shadow-[3px_3px_0_0_#F5C542]
                                font-bold text-[14px]
                                focus:outline-none focus:ring-0
                                cursor-pointer
                            "
                        >
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.title} - ${pkg.discountPrice || pkg.price}
                                </option>
                            ))}
                        </select>

                        {/* Package Info */}
                        {selectedPackage && (
                            <div className="hidden md:flex items-center gap-4 text-white/80 text-sm font-semibold">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {selectedPackage.deliveryTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-4 h-4" />
                                    {selectedPackage.revisions} revisions
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => selectedPackage && onCheckout?.(selectedPackage)}
                        className="
                            w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2
                            bg-[#F5C542] text-[#2C2416]
                            border-[4px] border-[#F5F1E8]
                            shadow-[4px_4px_0_0_#F5F1E8]
                            font-black text-[14px] uppercase tracking-wider
                            hover:shadow-[2px_2px_0_0_#F5F1E8]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                            transition-all duration-150
                        "
                    >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
