import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white border-t-4 border-black">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-[#F5C542] border-3 border-white flex items-center justify-center">
                                <span className="text-xl font-black text-[#2C2416]">U</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white leading-none">UdyomX</span>
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">ORG</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#E0E0E0] mb-6 leading-relaxed font-semibold">
                            Building exceptional digital experiences with modern technologies and creative solutions.
                        </p>
                        <p className="text-xs text-[#E0E0E0]/60 mb-4">
                            Founded by <span className="text-[#F5C542] font-bold">Mokammel Morshed</span>
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-10 h-10 border-3 border-white bg-white hover:bg-[#2196F3] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(255,255,255,1)]">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border-3 border-white bg-white hover:bg-[#2196F3] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(255,255,255,1)]">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border-3 border-white bg-white hover:bg-[#2196F3] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(255,255,255,1)]">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border-3 border-white bg-[#FF6B6B] hover:bg-[#FF4444] text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(255,255,255,1)]">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <div className="w-1 h-6 bg-[#2196F3]" />
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="text-[#E0E0E0] hover:text-[#2196F3] transition-all hover:translate-x-1 inline-block font-bold">
                                    → Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-[#E0E0E0] hover:text-[#2196F3] transition-all hover:translate-x-1 inline-block font-bold">
                                    → Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-[#E0E0E0] hover:text-[#2196F3] transition-all hover:translate-x-1 inline-block font-bold">
                                    → Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-[#E0E0E0] hover:text-[#2196F3] transition-all hover:translate-x-1 inline-block font-bold">
                                    → Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <div className="w-1 h-6 bg-[#FF6B6B]" />
                            Services
                        </h3>
                        <ul className="space-y-3 text-sm text-[#E0E0E0]">
                            <li className="flex items-center gap-2 font-bold">
                                <span className="w-2 h-2 bg-[#2196F3]" />
                                Web Development
                            </li>
                            <li className="flex items-center gap-2 font-bold">
                                <span className="w-2 h-2 bg-[#FF6B6B]" />
                                UI/UX Design
                            </li>
                            <li className="flex items-center gap-2 font-bold">
                                <span className="w-2 h-2 bg-[#F5C542]" />
                                Consulting
                            </li>
                            <li className="flex items-center gap-2 font-bold">
                                <span className="w-2 h-2 bg-[#5CB85C]" />
                                Custom Solutions
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <div className="w-1 h-6 bg-[#F5C542]" />
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm text-[#E0E0E0]">
                            <li className="flex items-center gap-2 font-bold">
                                <span className="text-[#2196F3] text-lg">•</span>
                                Dhaka, Bangladesh
                            </li>
                            <li className="flex items-center gap-2 font-bold">
                                <span className="text-[#FF6B6B] text-lg">•</span>
                                contact@udyomx.com
                            </li>
                            <li className="flex items-center gap-2 font-bold">
                                <span className="text-[#F5C542] text-lg">•</span>
                                +880 1234 567890
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t-4 border-white flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#E0E0E0]">
                    <p className="flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 bg-[#F5C542]" />
                        &copy; 2025 UdyomX ORG. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-[#2196F3] transition-colors font-bold">
                            Privacy Policy
                        </Link>
                        <span className="text-white">|</span>
                        <Link href="#" className="hover:text-[#2196F3] transition-colors font-bold">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
