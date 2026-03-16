/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function App() {
  const leftColRef = useRef<HTMLDivElement>(null);
  const centerColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      [leftColRef.current, centerColRef.current, rightColRef.current],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
      }
    );

    tl.fromTo(
      [navRef.current, bottomRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.5'
    );
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#080808] font-sans overflow-hidden">
      {/* Fixed Video Background */}
      <video
        className="fixed top-0 left-0 w-screen h-screen object-cover z-[-2]"
        src="https://files.catbox.moe/ibhyo6.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="fixed inset-0 bg-black/65 z-[-1]" />

      {/* Atmosphere Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(180,60,10,0.35)_0%,transparent_70%)]" />
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full h-[52px] z-50 backdrop-blur-[14px] bg-[#080808]/80 border-b border-white/5 flex items-center justify-between px-[28px]"
      >
        <div className="flex items-center gap-[18px]">
          <div className="bg-white/10 border border-white/5 rounded-full px-[18px] py-[6px] text-[12px] text-[#F0E8D8] font-medium">
            Home
          </div>
          <button className="text-[12px] text-[#F0E8D8]/45 hover:text-[#F0E8D8] transition-colors">About</button>
          <button className="text-[12px] text-[#F0E8D8]/45 hover:text-[#F0E8D8] transition-colors">Chapters</button>
          <button className="text-[12px] text-[#F0E8D8]/45 hover:text-[#F0E8D8] transition-colors">Get Book</button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <div className="font-serif text-[18px] text-[#fcd464] tracking-[0.2em] leading-none uppercase">
            Social Anxiety
          </div>
          <div className="font-serif text-[10px] text-[#fcd464]/45 tracking-[0.2em] uppercase mt-1">
            And You
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-white/10 border border-white/5 rounded-full px-[18px] py-[6px] text-[12px] text-[#F0E8D8] font-medium cursor-pointer hover:bg-white/20 transition-colors">
            Explore →
          </div>
          <button className="ml-[14px] text-[#F0E8D8]/50 hover:text-[#F0E8D8] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Layout */}
      <div className="grid grid-cols-[38%_35%_27%] h-screen pt-[52px] px-[28px] items-center relative z-10">
        {/* Left Column */}
        <div ref={leftColRef} className="flex flex-col items-start">
          <div className="bg-[#fcd464]/10 border border-[#fcd464]/20 text-[#fcd464] text-[11px] rounded-full px-[12px] py-[4px] mb-[20px]">
            Afraid to Speak, Desperate to Be Heard
          </div>
          <h1 className="font-black text-[80px] leading-[0.88] text-[#F0E8D8] uppercase tracking-[-0.03em] drop-shadow-[0_0_80px_rgba(239,159,39,0.2)]">
            YOU WERE<br />NEVER<br />BROKEN.
          </h1>
          <p className="mt-[18px] text-[13px] text-[#F0E8D8]/60 max-width-[250px] leading-[1.8]">
            You were always made of fire.<br />
            Social anxiety was just the glass.<br />
            This book removes the glass.
          </p>
          <div className="mt-[28px] flex gap-[10px]">
            <button className="bg-[#fcd464] text-[#080808] text-[13px] font-bold rounded-full px-[24px] py-[12px] hover:scale-105 transition-transform">
              Read Free Chapter →
            </button>
            <button className="bg-transparent border border-[#F0E8D8]/20 text-[#F0E8D8] text-[13px] rounded-full px-[24px] py-[12px] hover:bg-[#F0E8D8]/10 transition-colors">
              Get the Ebook
            </button>
          </div>
        </div>

        {/* Center Column */}
        <div ref={centerColRef} className="relative h-full flex items-center justify-center">
          {/* Large Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,70,10,0.3)_0%,transparent_70%)] z-0" />
          
          {/* Human Silhouette Visual */}
          <div className="relative z-10 w-[160px] h-[420px] bg-gradient-to-b from-[#f0c864]/15 to-transparent rounded-t-[80px] rounded-b-[20px] shadow-[0_0_60px_rgba(239,159,39,0.2)] border border-white/5" />
        </div>

        {/* Right Column */}
        <div ref={rightColRef} className="flex flex-col gap-[12px]">
          <Card
            title="The Glass Wall"
            body="Watching warmth from the wrong side"
            accent="#fcd464"
          />
          <Card
            title="The Ignition"
            body="The fire was always inside you"
            accent="#EF9F27"
          />
          <Card
            title="The Transformation"
            body="Standing inside your own flame"
            accent="#BA7517"
          />
        </div>
      </div>

      {/* Bottom Strip */}
      <div ref={bottomRef} className="absolute bottom-[20px] left-0 right-0 flex justify-between px-[28px] text-[9px] uppercase tracking-[0.12em] text-[#F0E8D8]/30">
        <div>WRITTEN BY — THE AUTHOR · SOCIAL ANXIETY AND YOU · 2025</div>
        <div className="text-right max-w-[400px]">
          SOME WALLS NEVER STAY STANDING. ONCE THE LIGHT FINDS YOU, EVERYTHING CHANGES.
        </div>
      </div>
    </div>
  );
}

function Card({ title, body, accent }: { title: string; body: string; accent: string }) {
  return (
    <div className="relative h-[88px] rounded-[10px] overflow-hidden border border-white/10 bg-white/5 p-[14px_16px] cursor-pointer transition-all duration-300 hover:border-[#fcd464]/40 hover:bg-white/10 hover:-translate-y-[3px] group">
      <div
        className="absolute left-0 top-0 w-[3px] h-full"
        style={{ backgroundColor: accent }}
      />
      <div className="text-[12px] font-semibold text-[#F0E8D8] mb-[4px]">{title}</div>
      <div className="text-[11px] text-[#F0E8D8]/50 leading-[1.5]">{body}</div>
    </div>
  );
}

