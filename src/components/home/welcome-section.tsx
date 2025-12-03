"use client";

import { Sparkles, Zap, Target } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="bg-[#1A1A1A] text-white border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
      <div className="border-l-4 border-[#2196F3] pl-6 relative">
        <div className="absolute -top-2 -left-2">
          <Sparkles className="w-8 h-8 text-[#FFC107]" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
          Welcome To UdyomX
        </h2>

        <p className="text-[#E0E0E0] mb-4 leading-relaxed font-semibold">
          <span className="font-black text-white">UdyomX</span> is a modern{" "}
          <span className="text-[#2196F3] font-black px-2 py-1 bg-[#2196F3]/20 border-2 border-[#2196F3]">
            full-stack
          </span>{" "}
          development community creating amazing services, best practices, and resources 
          to help anyone, from beginner to expert. We offer real-world examples, clear 
          tutorials, detailed documentation, and insightful guides for everyone from 
          curious explorers to experienced developers.
        </p>

        <p className="text-[#E0E0E0] leading-relaxed font-semibold">
          Along with technical details, we also share news, project ideas, UI content,
          powerful tools, and project support — all designed to provide exceptional value. 
          All content is user-friendly and enjoyable, ensuring high-quality learning, 
          clarity, and consistent results.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="bg-[#2196F3] border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
          <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <h3 className="font-black text-white mb-1">Fast Development</h3>
          <p className="text-sm text-white/80 font-semibold">Build modern apps quickly</p>
        </div>
        
        <div className="bg-[#FF6B6B] border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
          <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <h3 className="font-black text-white mb-1">Best Practices</h3>
          <p className="text-sm text-white/80 font-semibold">Industry-standard code</p>
        </div>
        
        <div className="bg-[#F5C542] border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
          <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <h3 className="font-black text-[#1A1A1A] mb-1">High Quality</h3>
          <p className="text-sm text-[#1A1A1A]/80 font-semibold">Top-notch resources</p>
        </div>
      </div>

      {/* Quote section */}
      <div className="mt-8 pt-6 border-t-4 border-white">
        <p className="text-[#E0E0E0] italic leading-relaxed font-semibold">
          &quot;I&apos;m excited to design, share, and bring your ideas to life. Together,
          let&apos;s build solutions that deliver bold, high-quality results with 
          clarity and consistency.&quot;
        </p>
        <p className="text-[#F5C542] font-black mt-2">— UdyomX Team</p>
      </div>
    </div>
  );
}
