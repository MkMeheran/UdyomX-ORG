'use client';

import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
    const features = [
        { text: 'Multimedia platform control', icon: '🎨' },
        { text: 'Workflow builder usage', icon: '⚡' },
        { text: 'Access to all services', icon: '🚀' },
    ];

    return (
        <div className="bg-[#1A1A1A] border-4 border-black p-8 md:p-10 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border-3 border-white bg-[#FF6B6B] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="px-4 py-1.5 bg-[#FF6B6B] text-white text-xs font-black border-2 border-white uppercase tracking-wider">
                    Get Started
                </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight uppercase">
                Unlock Your{' '}
                <span className="text-[#F5C542]">
                    Creative Power
                </span>
            </h2>

            <p className="text-[#E0E0E0] mb-8 text-lg leading-relaxed max-w-2xl font-semibold">
                Transform from maker to creator. Get access to all services, 
                fast support, and custom solutions for your needs.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="flex items-start gap-3 bg-white border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                    >
                        <div className="text-2xl">{feature.icon}</div>
                        <div className="flex-1">
                            <div className="w-7 h-7 border-2 border-black bg-[#5CB85C] flex items-center justify-center mb-2">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[#1A1A1A] text-sm font-bold">{feature.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/services"
                    className="flex-1 py-4 bg-[#2196F3] text-white font-black text-center border-3 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-2 group uppercase tracking-wider"
                >
                    <Sparkles className="w-5 h-5" />
                    Explore Plans
                </Link>
                <Link
                    href="/projects"
                    className="flex-1 py-4 bg-white text-[#1A1A1A] font-black text-center border-3 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all uppercase tracking-wider"
                >
                    View Projects
                </Link>
            </div>
        </div>
    );
}
