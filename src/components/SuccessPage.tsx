import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

export default function SuccessPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Premium reveal for scrolly content
    gsap.from('.success-reveal', {
      y: 40,
      opacity: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: 'expo.out'
    });

    // Subtle float for the book
    gsap.to('.book-float', {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    // User's provided Google Drive direct download link
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1cOpMSnV5Uws9P6sK0owuWTtBHk6hPh_k";
    window.location.href = downloadUrl;
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center px-6 py-20 overflow-x-hidden selection:bg-red-600/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[90vw] h-[60vh] bg-red-900/10 blur-[180px] rounded-full opacity-40" />
      </div>

      <div className="max-w-3xl w-full z-10">
        <div className="flex flex-col items-center">
          
          {/* ── 1. PAYMENT STATUS ─────────────────── */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 bg-red-600/10 rounded-full border border-red-500/20"
          >
            <CheckCircle2 className="size-12 text-red-500" />
          </motion.div>

          <h1 className="success-reveal text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-center leading-[0.9]">
            Payment <span className="text-red-600">Successful</span>
          </h1>

          <p className="success-reveal text-zinc-400 text-lg md:text-xl font-medium mb-16 text-center max-w-xl leading-relaxed">
            Your access is now unlocked. <br />
            <span className="text-white/60 text-sm uppercase tracking-[0.3em] font-bold mt-4 block">Thank you for trusting this.</span>
          </p>

          <div className="w-full h-px bg-white/5 success-reveal mb-20" />

          {/* ── 2. DOWNLOAD SECTION ──────────────── */}
          <div className="success-reveal w-full mb-32">
             <div className="flex flex-col items-center text-center">
                <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Phase: Extraction</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12">Your Ebook is Ready</h2>
                
                <div className="book-float relative w-48 h-64 mb-12 group">
                   <div className="absolute inset-0 bg-red-600/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                   <img 
                      src="/ebook cover.png" 
                      alt="Ebook Cover" 
                      className="w-full h-full object-cover rounded shadow-2xl border border-white/10 brightness-110 contrast-110"
                   />
                </div>

                <p className="text-zinc-500 text-sm mb-10 uppercase tracking-widest font-bold">You can download your copy below.</p>

                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="group/btn relative flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all duration-500 transform active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(220,38,38,0.4)]"
                >
                  <Download className={`size-6 ${isDownloading ? 'animate-bounce' : 'group-hover/btn:-translate-y-1'} transition-transform`} />
                  {isDownloading ? 'UNLOCKED...' : 'Download "Social Anxiety And You"'}
                </button>
             </div>
          </div>

          <div className="w-full h-px bg-white/5 success-reveal mb-24" />

          {/* ── 3. INTROSPECTION CONTENT ─────────── */}
          <div className="success-reveal w-full space-y-32 text-center md:text-left">
            
            {/* Before You Read */}
            <div className="space-y-8">
              <h3 className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em] text-center md:text-left">Before You Read</h3>
              <div className="space-y-6 text-xl md:text-2xl font-bold leading-relaxed text-zinc-300">
                <p className="text-white">Don’t rush through this.</p>
                <p>This isn’t a book you “finish.”<br /><span className="text-zinc-500 font-medium">It’s something you understand, slowly.</span></p>
                <p>Some parts might feel uncomfortable. <br />Some parts might feel like they’re describing you exactly.</p>
                <p className="text-red-500/80 italic font-black">That’s normal.</p>
                <p className="text-base text-zinc-500 uppercase tracking-widest font-black leading-loose pt-4 border-t border-white/5">This is not surface-level advice. <br />It goes deeper than that.</p>
              </div>
            </div>

            {/* How to Approach */}
            <div className="space-y-8">
              <h3 className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em] text-center md:text-left">How to Approach This</h3>
              <div className="space-y-6 text-xl md:text-2xl font-bold leading-relaxed text-zinc-300">
                <p className="text-white">Read it with attention, not speed.</p>
                <p>Don’t try to apply everything at once.<br /><span className="text-zinc-500 font-medium">Just understand what’s being shown.</span></p>
                <p>The change doesn’t come from forcing yourself.<br /><span className="text-red-600 font-black uppercase tracking-tight">It comes from seeing clearly.</span></p>
              </div>
            </div>

            {/* One More Thing */}
            <div className="space-y-8">
              <h3 className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em] text-center md:text-left">One More Thing</h3>
              <div className="space-y-6 text-xl md:text-2xl font-bold leading-relaxed text-zinc-300">
                <p className="text-white">Nothing in this book is trying to make you someone new.</p>
                <p className="text-red-600 font-black">It’s helping you remove what’s already in the way.</p>
              </div>
            </div>

          </div>

          {/* ── 4. SIGN OFF ──────────────────────── */}
          <div className="success-reveal mt-40 mb-20 text-center">
            <p className="text-zinc-500 text-sm uppercase tracking-[0.6em] font-black italic mb-12">Take your time with it.</p>
            
            <div className="pt-20 border-t border-white/5 w-screen">
              <h2 className="text-[clamp(40px,10vw,120px)] font-black uppercase tracking-tighter text-zinc-900 leading-none">
                Unleash The Beast
              </h2>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="mt-20 group flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-[10px] uppercase font-black tracking-[0.4em] mx-auto"
            >
              <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
              Main Horizon
            </button>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ease-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
      `}} />
    </div>
  );
}
