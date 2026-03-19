import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, ArrowLeft, ShieldCheck, Mail, Sparkles, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * ── SuccessPage (Personalized & Secure) ──────────
 * Redesigned for lead-capture support and personalization.
 * Includes a dedicated "Issue Resolution" section.
 * ───────────────────────────────────────────────── */

export default function SuccessPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('id') || 'RZP_VERIFIED';
  const userName = searchParams.get('name') || 'Friend';

  const handleDownload = () => {
    setIsDownloading(true);
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1cOpMSnV5Uws9P6sK0owuWTtBHk6hPh_k";
    window.location.href = downloadUrl;
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-liquid-dark text-[var(--fg-primary)] flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden selection:bg-red-600/30">
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-red-950/20 via-transparent to-transparent opacity-40 animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 bg-black/40 backdrop-blur-3xl border border-white/5 p-8 md:p-16 rounded-[40px] shadow-2xl"
      >
        {/* Left Side: Personalization & Status */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="flex items-center gap-4 mb-8 bg-red-600/10 border border-red-500/20 px-6 py-3 rounded-full">
            <CheckCircle2 className="size-6 text-red-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Payment Verified</span>
          </div>

          <h1 className="text-red-grey text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-glow">
            Welcome, <br />
            <span className="text-white">{userName.split(' ')[0]}</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl font-medium mb-12 max-w-md leading-tight">
            Your registration is complete. <span className="text-white/80 italic">The ebook has been authorized for your use.</span>
          </p>

          {/* Book Image (Compact) */}
          <div className="relative w-48 md:w-56 h-auto mb-12 hidden lg:block">
            <div className="absolute inset-0 bg-red-600/20 blur-[40px]" />
            <img 
              src="/ebook cover.png" 
              alt="Ebook Cover" 
              className="relative w-full rounded-lg shadow-2xl border border-white/10 brightness-110"
            />
          </div>

          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="size-4 text-zinc-600 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">Return Home</span>
          </div>
        </div>

        {/* Right Side: Download & Issue Resolution */}
        <div className="flex flex-col gap-10">
          
          {/* Download Center */}
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px] flex flex-col items-center">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.6em] mb-6">Extraction Ready</span>
            
            <button 
               onClick={handleDownload}
               disabled={isDownloading}
               className="btn min-w-full md:min-w-[340px] mb-8"
            >
              {isDownloading ? (
                <>
                  <Sparkles className="btn-svg" />
                  <span>Decrypting...</span>
                </>
              ) : (
                <>
                  <Download className="btn-svg" />
                  <span>Download (16MB PDF)</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8 mt-2">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <BookOpen className="size-3" /> Format
                </div>
                <span className="text-sm text-white font-bold">PDF / EPUB</span>
              </div>
              <div className="flex flex-col items-center lg:items-end">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Clock className="size-3" /> Access
                </div>
                <span className="text-sm text-white font-bold">Lifetime</span>
              </div>
            </div>
          </div>

          {/* ⚠️ ISSUE SECTION (Requested by User) */}
          <div className="bg-red-600/5 border border-red-500/10 p-6 md:p-8 rounded-[24px] space-y-4">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <AlertTriangle className="size-5" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Help & Assistance</h3>
            </div>
            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
              If you experienced any issues while downloading or didn't receive the file, <span className="text-white font-bold underline decoration-red-600/40">please check your email inbox (including spam).</span>
            </p>
            <p className="text-[12px] text-zinc-500 leading-relaxed font-normal">
              A permanent backup link has been sent to the email address you provided during checkout. For further help, contact <span className="text-white font-medium italic">officialunleashthebeast@gmail.com</span>
            </p>
          </div>

          <div className="mt-4 pt-8 border-t border-white/5 flex items-center justify-between text-zinc-600">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest">Transaction ID</span>
                <span className="text-[11px] font-bold text-zinc-500">{paymentId.slice(0, 16)}...</span>
             </div>
             <ShieldCheck className="size-5 opacity-20" />
          </div>

        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-liquid-dark {
          background: radial-gradient(circle at 50% 10%, #150505 0%, #080808 100%);
          background-size: 200% 200%;
        }
      `}} />
    </div>
  );
}
