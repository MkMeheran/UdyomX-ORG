'use client';

import type { AudienceType } from '@/types/post';
import { Users, Crown, Link as LinkIcon, Globe } from 'lucide-react';

interface AudienceBadgeProps {
    audienceType: AudienceType;
    size?: 'sm' | 'md' | 'lg';
}

const audienceConfig = {
    public: {
        label: 'Public',
        icon: Globe,
        bg: 'bg-[#5CB85C]',
        text: 'text-white',
        border: 'border-black',
    },
    premium: {
        label: 'Premium',
        icon: Crown,
        bg: 'bg-[#F5C542]',
        text: 'text-[#1A1A1A]',
        border: 'border-black',
    },
    both: {
        label: 'All Access',
        icon: Users,
        bg: 'bg-[#2196F3]',
        text: 'text-white',
        border: 'border-black',
    },
    link: {
        label: 'Link Only',
        icon: LinkIcon,
        bg: 'bg-[#9C27B0]',
        text: 'text-white',
        border: 'border-black',
    },
};

const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
};

export function AudienceBadge({ audienceType, size = 'sm' }: AudienceBadgeProps) {
    const config = audienceConfig[audienceType];
    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 font-black uppercase tracking-wider
                border-3 ${config.border} ${config.bg} ${config.text}
                shadow-[2px_2px_0_0_rgba(0,0,0,1)]
                ${sizeClasses[size]}
            `}
        >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}
