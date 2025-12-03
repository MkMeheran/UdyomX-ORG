'use client';

import { motion } from 'framer-motion';
import { Code2, Palette, Rocket, Sparkles } from 'lucide-react';

const bentoItems = [
    {
        id: 1,
        title: 'Modern Design',
        description: 'Stunning, modern interfaces that captivate users',
        icon: Palette,
        className: 'md:col-span-2 md:row-span-2',
        bgColor: 'bg-earth-teal',
    },
    {
        id: 2,
        title: 'Clean Code',
        description: 'Maintainable, scalable architecture',
        icon: Code2,
        className: 'md:col-span-1',
        bgColor: 'bg-earth-ochre',
    },
    {
        id: 3,
        title: 'Fast Performance',
        description: 'Optimized for speed',
        icon: Rocket,
        className: 'md:col-span-1',
        bgColor: 'bg-earth-orange',
    },
    {
        id: 4,
        title: 'Modern Stack',
        description: 'Latest technologies',
        icon: Sparkles,
        className: 'md:col-span-2',
        bgColor: 'bg-earth-gold',
    },
];

export function BentoGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {bentoItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${item.className} ${item.bgColor} rounded-xl p-6 md:p-8 text-earth-white 
            border-2 border-earth-brown shadow-offset-md 
            hover:-translate-y-1 hover:shadow-offset-lg transition-all duration-200
            relative overflow-hidden group cursor-pointer`}
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <item.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-earth-white/90 text-sm md:text-base">{item.description}</p>
                        </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-earth-brown/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.div>
            ))}
        </div>
    );
}
