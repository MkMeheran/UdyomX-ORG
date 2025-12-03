'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X, Check } from 'lucide-react';
import type { ServiceProblem, ServiceSolution } from '@/types/service';

interface ProblemSolutionProps {
    problems: ServiceProblem[];
    solutions: ServiceSolution[];
}

export function ProblemSolution({ problems, solutions }: ProblemSolutionProps) {
    if (problems.length === 0 && solutions.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-10 md:py-14 bg-[#F5F5F0]">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-5">
                    {/* Problems Card - Red Theme */}
                    {problems.length > 0 && (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="
                                bg-[#FDE8E8] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                p-6 md:p-8
                            "
                        >
                            {/* Header with Red Accent */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-[3px] border-[#DC2626]">
                                <div
                                    className="
                                        w-12 h-12 flex items-center justify-center
                                        bg-[#DC2626] text-white
                                        border-[3px] border-[#2C2416]
                                        shadow-[3px_3px_0_0_#2C2416]
                                    "
                                >
                                    <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#DC2626]">
                                    Sound Familiar?
                                </h2>
                            </div>

                            {/* Problems List */}
                            <ul className="space-y-4">
                                {problems.map((problem) => (
                                    <motion.li
                                        key={problem.id}
                                        variants={item}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="
                                                w-7 h-7 flex-shrink-0 mt-0.5
                                                bg-[#DC2626] text-white
                                                border-[2px] border-[#2C2416]
                                                flex items-center justify-center
                                            "
                                        >
                                            <X className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                        <span className="text-[15px] text-[#7F1D1D] font-semibold leading-relaxed">
                                            {problem.text}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Solutions Card - Green Theme */}
                    {solutions.length > 0 && (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="
                                bg-[#E8FDF0] border-[4px] border-[#2C2416]
                                shadow-[6px_6px_0_0_rgba(44,36,22,0.3)]
                                p-6 md:p-8
                            "
                        >
                            {/* Header with Green Accent */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-[3px] border-[#16A34A]">
                                <div
                                    className="
                                        w-12 h-12 flex items-center justify-center
                                        bg-[#16A34A] text-white
                                        border-[3px] border-[#2C2416]
                                        shadow-[3px_3px_0_0_#2C2416]
                                    "
                                >
                                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#16A34A]">
                                    Our Solutions
                                </h2>
                            </div>

                            {/* Solutions List */}
                            <ul className="space-y-4">
                                {solutions.map((solution) => (
                                    <motion.li
                                        key={solution.id}
                                        variants={item}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="
                                                w-7 h-7 flex-shrink-0 mt-0.5
                                                bg-[#16A34A] text-white
                                                border-[2px] border-[#2C2416]
                                                flex items-center justify-center
                                            "
                                        >
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                        <span className="text-[15px] text-[#166534] font-semibold leading-relaxed">
                                            {solution.text}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
