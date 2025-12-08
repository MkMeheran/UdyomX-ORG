'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FAQ } from '@/types';

interface ServiceFAQProps {
    faqs: FAQ[];
}

export function ServiceFAQ({ faqs }: ServiceFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-6 md:py-10 bg-[#F5F5F0]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="
                            w-12 h-12 flex items-center justify-center
                            bg-[#D35400] text-white
                            border-[3px] border-[#2C2416]
                            shadow-[3px_3px_0_0_#2C2416]
                        "
                    >
                        <HelpCircle className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#2C2416]">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* FAQ List */}
                <div
                    className="
                        bg-[#F5F1E8] border-[4px] border-[#2C2416]
                        shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                    "
                >
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={index !== faqs.length - 1 ? 'border-b-[3px] border-[#E8E4DC]' : ''}
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="
                                    w-full flex items-center justify-between gap-4 p-5
                                    text-left hover:bg-[#F0EDE5] transition-colors
                                "
                            >
                                <span className="flex-1 min-w-0 text-[16px] md:text-[18px] lg:text-[20px] font-bold text-[#2C2416] leading-tight break-words word-break">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDown 
                                        className={`w-6 h-6 ${openIndex === index ? 'text-[#D35400]' : 'text-[#7A7568]'}`} 
                                        strokeWidth={2.5} 
                                    />
                                </motion.div>
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5">
                                            <div className="pt-2 pl-0 border-l-[4px] border-[#D35400]">
                                                <p className="text-[15px] md:text-[17px] lg:text-[18px] text-[#3D3530] font-semibold leading-relaxed pl-4 break-words overflow-wrap-anywhere">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
