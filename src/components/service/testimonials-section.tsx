'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import type { Testimonial } from '@/types/service';

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
    if (testimonials.length === 0) return null;

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
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 },
    };

    // Determine grid columns based on testimonial count
    const getGridClass = () => {
        if (testimonials.length === 1) return 'md:grid-cols-1 max-w-2xl mx-auto';
        return 'md:grid-cols-2';
    };

    return (
        <section className="py-10 md:py-14 bg-[#F5F5F0]">
            <div className="max-w-5xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black text-[#2C2416] mb-3">
                        What Our Clients Say
                    </h2>
                    <p className="text-[#5A5247] font-medium text-lg max-w-2xl mx-auto">
                        Real feedback from satisfied customers
                    </p>
                </div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`grid ${getGridClass()} gap-6`}
                >
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            variants={item}
                            className="
                                relative bg-[#F5F1E8] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                hover:-translate-x-1 hover:-translate-y-1
                                hover:shadow-[8px_8px_0_0_rgba(44,36,22,0.3)]
                                transition-all duration-150
                                p-6 md:p-8
                            "
                        >
                            {/* Quote Icon */}
                            <div
                                className="
                                    absolute -top-4 -left-2
                                    w-10 h-10 flex items-center justify-center
                                    bg-[#F5C542] text-[#2C2416]
                                    border-[3px] border-[#2C2416]
                                    shadow-[3px_3px_0_0_#2C2416]
                                "
                            >
                                <Quote className="w-5 h-5" strokeWidth={2.5} />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex items-center gap-1 mb-4 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < testimonial.rating
                                                ? 'fill-[#F5C542] text-[#F5C542]'
                                                : 'text-[#D1D1D1]'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Quote Text */}
                            <blockquote className="text-[15px] text-[#5A5247] font-medium leading-relaxed mb-6 italic">
                                &ldquo;{testimonial.quote}&rdquo;
                            </blockquote>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 pt-4 border-t-[3px] border-[#E8E4DC]">
                                {testimonial.avatar ? (
                                    <div 
                                        className="
                                            relative w-14 h-14 overflow-hidden
                                            border-[3px] border-[#2C2416]
                                            shadow-[3px_3px_0_0_#D1D1D1]
                                        "
                                    >
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div 
                                        className="
                                            w-14 h-14 flex items-center justify-center
                                            bg-[#2196F3] text-white
                                            border-[3px] border-[#2C2416]
                                            shadow-[3px_3px_0_0_#D1D1D1]
                                            font-black text-xl
                                        "
                                    >
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-black text-[#2C2416] text-lg">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-[13px] text-[#7A7568] font-semibold">
                                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
