'use client';

import { MapPin, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const roles = ['Full-Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];

export function HeroSection() {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Typewriter effect
    useEffect(() => {
        const currentRole = roles[currentRoleIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentRole.length) {
                    setDisplayText(currentRole.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentRoleIndex]);

    return (
        <div className="w-full bg-earth-cream border-2 border-earth-brown rounded-xl shadow-offset-md p-6 md:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-earth-brown shadow-offset-md overflow-hidden bg-earth-white flex items-center justify-center">
                            <div className="w-full h-full bg-gradient-to-br from-earth-teal to-earth-ochre opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                👨‍💻
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-4">
                    {/* Name */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-earth-brown">
                        Your Name Here
                    </h1>

                    {/* Status Badge */}
                    <div className="inline-block">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-earth-teal text-earth-white text-sm font-medium rounded-full border-2 border-earth-brown shadow-offset-sm">
                            <Sparkles className="w-4 h-4" />
                            Available for Work
                        </span>
                    </div>

                    {/* Role with Typewriter Effect */}
                    <div className="text-base md:text-lg">
                        <span className="text-earth-brown font-medium">I'm a </span>
                        <span className="text-earth-orange font-bold">
                            {displayText}
                            <span className="animate-pulse">|</span>
                        </span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm md:text-base text-text-secondary-alt max-w-2xl leading-relaxed">
                        Passionate about creating exceptional digital experiences. Specializing in modern web technologies,
                        clean code, and user-centric design. Let's build something amazing together.
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 text-earth-teal" />
                        <span>Dhaka, Bangladesh</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
