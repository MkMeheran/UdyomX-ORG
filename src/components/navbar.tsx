'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-[#F5C542] border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all">
                                <span className="text-xl font-black text-[#2C2416]">U</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-[#2C2416] leading-none">
                                    UdyomX
                                </span>
                                <span className="text-[10px] font-bold text-[#2C2416]/60 uppercase tracking-widest">
                                    ORG
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            <NavLink href="/blog">Blog</NavLink>
                            <NavLink href="/projects">Projects</NavLink>
                            <NavLink href="/services">Services</NavLink>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 border-3 border-black bg-white hover:bg-[#F5F1E8] shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-[#2C2416]" />
                        ) : (
                            <Menu className="w-6 h-6 text-[#2C2416]" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t-4 border-black bg-[#F5F5F0]">
                        <div className="flex flex-col gap-3">
                            <MobileNavLink href="/blog" onClick={() => setMobileMenuOpen(false)}>
                                Blog
                            </MobileNavLink>
                            <MobileNavLink href="/projects" onClick={() => setMobileMenuOpen(false)}>
                                Projects
                            </MobileNavLink>
                            <MobileNavLink href="/services" onClick={() => setMobileMenuOpen(false)}>
                                Services
                            </MobileNavLink>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-2 text-sm font-black text-[#1A1A1A] hover:text-white hover:bg-[#2C2416] border-3 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all uppercase tracking-wider"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ 
    href, 
    children, 
    onClick 
}: { 
    href: string; 
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            className="px-4 py-3 text-sm font-black text-[#1A1A1A] hover:bg-[#2C2416] hover:text-white border-2 border-black transition-all uppercase tracking-wider"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}
