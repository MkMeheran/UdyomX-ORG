'use client';

import { Check, Sparkles, Zap, Rocket, Palette, Code, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ 
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700']
});

export function CTASection() {
    const features = [
        { text: 'Multimedia Control', icon: <Palette className="w-6 h-6 text-[#2196F3]" /> },
        { text: 'Workflow Builder', icon: <Zap className="w-6 h-6 text-[#F5C542]" /> },
        { text: 'Full Access', icon: <Rocket className="w-6 h-6 text-[#FF6B6B]" /> },
        { text: 'Clean Code', icon: <Code className="w-6 h-6 text-[#5CB85C]" /> },
        { text: 'CLI Support', icon: <Terminal className="w-6 h-6 text-[#2196F3]" /> },
        // Duplicates for seamless loop
        { text: 'Multimedia Control', icon: <Palette className="w-6 h-6 text-[#2196F3]" /> },
        { text: 'Workflow Builder', icon: <Zap className="w-6 h-6 text-[#F5C542]" /> },
        { text: 'Full Access', icon: <Rocket className="w-6 h-6 text-[#FF6B6B]" /> },
        { text: 'Clean Code', icon: <Code className="w-6 h-6 text-[#5CB85C]" /> },
        { text: 'CLI Support', icon: <Terminal className="w-6 h-6 text-[#2196F3]" /> },
    ];

    return (
        <div className={`relative overflow-hidden p-4 md:p-12 border-t-4 border-[#2C2416] group ${spaceGrotesk.className} bg-[#F5F1E8]`}>
            {/* Light Theme Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#2C2416_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />
            
            {/* Animated Glow Orbs - Adjusted for Light Theme */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#2196F3]/20 rounded-full blur-[80px] animate-pulse mix-blend-multiply" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FF6B6B]/20 rounded-full blur-[80px] animate-pulse delay-1000 mix-blend-multiply" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#2C2416] text-[#2C2416] mb-3 md:mb-6 shadow-[4px_4px_0_0_#2C2416]">
                    <Sparkles className="w-4 h-4 animate-pulse text-[#FF6B6B]" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">System Online</span>
                </div>

                {/* Glitch Title - High Contrast Brand Colors */}
                <h2 className="text-4xl md:text-6xl font-black mb-3 md:mb-6 leading-tight tracking-tight text-[#2C2416]">
                    UNLOCK YOUR{' '}
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] via-[#FF6B6B] to-[#F5C542] animate-gradient-x drop-shadow-[2px_2px_0_rgba(44,36,22,1)]">
                        CREATIVE POWER
                    </span>
                </h2>

                <p className="text-[#2C2416]/80 mb-6 md:mb-12 text-lg md:text-xl leading-relaxed max-w-2xl font-bold">
                    Transform from maker to creator. Access the <span className="text-[#2196F3] font-black bg-[#2196F3]/10 px-2 rounded">next-gen</span> ecosystem with high-performance tools.
                </p>

                {/* Infinite Carousel */}
                <div className="w-full max-w-5xl mb-6 md:mb-12 overflow-hidden mask-linear-gradient-light">
                    <div className="flex gap-6 animate-scroll hover:pause">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="flex-shrink-0 w-64 bg-white border-2 border-[#2C2416] p-4 shadow-[4px_4px_0_0_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#2C2416] transition-all duration-300 group/card"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-[#F5F1E8] border border-[#2C2416] group-hover/card:bg-[#2196F3]/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[#2C2416] font-bold text-sm">
                                            {feature.text}
                                        </span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-[#5CB85C] border border-[#2C2416] animate-pulse" />
                                            <span className="text-[10px] text-[#2C2416]/60 uppercase tracking-wider font-bold">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cyber Buttons - Brand Colors */}
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <Link
                        href="/services"
                        className="relative flex-1 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#2196F3] border-2 border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] transition-all duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0_0_#2C2416]" />
                        <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest">
                            <Sparkles className="w-5 h-5" />
                            <span>Explore Plans</span>
                        </div>
                    </Link>

                    <Link
                        href="/projects"
                        className="relative flex-1 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white border-2 border-[#2C2416] shadow-[4px_4px_0_0_#2C2416] transition-all duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0_0_#2C2416]" />
                        <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-[#2C2416] font-black uppercase tracking-widest">
                            <span>View Projects</span>
                            <div className="w-2 h-2 bg-[#FF6B6B] rounded-full border border-[#2C2416] group-hover:animate-ping" />
                        </div>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
                .mask-linear-gradient-light {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                @keyframes shine {
                    100% { transform: translateX(100%); }
                }
                .animate-shine {
                    animation: shine 0.5s;
                }
            `}</style>
        </div>
    );
}