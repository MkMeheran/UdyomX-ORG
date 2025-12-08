"use client";

import { Mail, Sparkles, MapPin, Link as LinkIcon, Github, Twitter, Users } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ProfileCard() {
  return (
    <div className="bg-white border-4 border-black p-4 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 border-4 border-black bg-[#F5C542] overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-[#2C2416]">
              U
            </div>
          </div>
          {/* Status indicator */}
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#5CB85C] border-3 border-black" />
        </div>

        {/* Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A]">
              UdyomX ORG
            </h1>
            <span className="inline-flex items-center px-4 py-1.5 bg-[#F5C542] text-[#2C2416] text-xs font-black border-3 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] w-fit uppercase tracking-wider">
              <Users className="w-3 h-3 mr-1.5" />
              Organization
            </span>
          </div>

          <p className="text-[#1A1A1A] mb-1 md:mb-2 text-lg font-bold">
            A <span className="text-[#FF6B6B]">Digital Solutions</span> Organization
          </p>

          <p className="text-[#5A5A5A] mb-3 md:mb-6 leading-relaxed max-w-3xl font-semibold">
            We turn ideas into reality with cutting-edge web development, design, 
            and digital services. Our team creates exceptional solutions that help 
            businesses thrive in the digital age.
          </p>

          {/* Contact Info Grid */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 border-3 border-black p-3 bg-[#F5F5F0] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-8 h-8 border-2 border-black bg-[#2196F3] flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#1A1A1A]">{siteConfig.founder.email}</span>
            </div>
            <div className="flex items-center gap-2 border-3 border-black p-3 bg-[#F5F5F0] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-8 h-8 border-2 border-black bg-[#FF6B6B] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#1A1A1A]">Full Stack Development</span>
            </div>
            <div className="flex items-center gap-2 border-3 border-black p-3 bg-[#F5F5F0] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-8 h-8 border-2 border-black bg-[#F5C542] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#1A1A1A]" />
              </div>
              <span className="font-bold text-[#1A1A1A]">Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 border-3 border-black p-3 bg-[#F5F5F0] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-8 h-8 border-2 border-black bg-[#5CB85C] flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#1A1A1A]">{siteConfig.urls.website.replace("https://", "")}</span>
            </div>
          </div>

          {/* Founder & Social Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mt-3 md:mt-6 pt-3 md:pt-6 border-t-4 border-black">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1A1A1A]/60">Founded by</span>
              <span className="px-3 py-1 bg-[#F5C542] text-[#2C2416] text-sm font-black border-2 border-black">
                {siteConfig.founder.name}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Connect:</span>
              <a href={siteConfig.urls.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-3 border-black bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                <Github className="w-5 h-5" />
              </a>
              <a href={siteConfig.urls.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-3 border-black bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={siteConfig.urls.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-3 border-black bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
