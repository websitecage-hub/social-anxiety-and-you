/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import LoadingLines from './components/ui/loading-lines';
import { AnimatedNavFramer } from './components/ui/navigation-menu';
import { Footer } from './components/ui/footer-section';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, Smartphone, ArrowRight, Info, CheckCircle2, X, AlertCircle, Users, BarChart3, Heart, Mail, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Razorpay type definition
declare global {
  interface Window {
    Razorpay: any;
  }
}

// 📧 EBOOK EMAIL SYSTEM CONFIGURATION (Get these from emailjs.com)
const EMAILJS_SERVICE_ID = "service_xxxxxxx";   // EmailJS Service ID
const EMAILJS_TEMPLATE_ID = "template_xxxxxxx"; // EmailJS Template ID
const EMAILJS_PUBLIC_KEY = "xxxxxxxxxxxxxxxxx"; // EmailJS Public API Key
const EBOOK_DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=1cOpMSnV5Uws9P6sK0owuWTtBHk6hPh_k";

/* ── Uiverse Button Component ──────────────────── */
function UiverseButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div className="btn-wrapper">
      <button className="btn" onClick={onClick}>
        <Zap className="btn-svg" />
        <div className="flex">
          {text.split('').map((char, i) => (
            <span key={i} className="btn-letter" style={{ animationDelay: `${i * 0.08}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </button>
    </div>
  );
}

/* ── FAQ Accordion Component ────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] py-[var(--space-4)] md:py-[var(--space-5)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-start text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="font-bold text-[var(--fg-primary)] text-sm md:text-lg pr-8 group-hover:text-[var(--accent)] transition-colors duration-200">
          {question}
        </span>
        <span
          className="text-[var(--accent)] text-xl md:text-2xl font-light flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0 }}
      >
        <p className="text-[var(--fg-muted)] text-[13px] md:text-base leading-relaxed mt-[var(--space-4)] font-normal max-w-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ── Awareness Popup Component (Compact) ────────── */
function AwarenessPopup({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm bg-[var(--bg-elevated)] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
            <AlertCircle className="size-3" />
          </div>
          <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">Global Status</span>
        </div>

        <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-6">
          Over <span className="text-white font-black">300 Million</span> people globally struggle with anxiety. This is not a personal failure—it is a collective challenge.
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-700 transition-all active:scale-95"
        >
          Begin The Journey
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Chapter Card Component ─────────────────────── */
function ChapterCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-[var(--space-5)] md:p-[var(--space-6)] hover:border-[var(--accent-dim)] hover:bg-[var(--surface-hover)] transition-all duration-300 hover:-translate-y-2">
      <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[var(--accent)] to-transparent rounded-l-[var(--radius-md)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="text-[var(--accent-dim)] text-[10px] md:text-[11px] tracking-[0.4em] font-bold uppercase block mb-[var(--space-3)]">
        {number}
      </span>
      <h3 className="font-black text-[var(--fg-primary)] text-base md:text-xl uppercase tracking-tight mb-[var(--space-3)] group-hover:text-[var(--accent)] transition-colors">
        {title}
      </h3>
      <p className="text-[var(--fg-muted)] text-[12px] md:text-sm leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}

/* ── Main Landing Page ───────────────────────────────────── */
/* ── Liquid Three.js Background Component ── */
function LiquidBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(15, 10, 128, 128);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#330000') }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float noise = snoise(pos.xy * 0.5 + uTime * 0.2);
          pos.z += noise * 0.4;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.2, dist) * 0.4;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 2;

    const animate = () => {
      material.uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-1 pointer-events-none opacity-40 mix-blend-screen" />;
}

/* ── Main Landing Page ───────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', mobile: '' });
  const [formErrors, setFormErrors] = useState({ email: '', mobile: '' });
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const frameCount = 1785;
  const airbnb = useRef({ frame: 0 });

  // Framer Motion Scroll
  const { scrollYProgress } = useScroll();
  const ctaGlowOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  // 🧊 Optimized Progressive Loader (Extreme Performance Mode)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 12 : 8; // Heavy optimization: Loading fewer frames to save memory
    const totalToLoad = Math.ceil(frameCount / step);
    const loadedImages: HTMLImageElement[] = new Array(totalToLoad);
    let loadedCount = 0;

    const loadBatch = async (indices: number[]) => {
      await Promise.all(indices.map(i => {
        return new Promise((resolve) => {
          const frameIndex = (i * step) + 1;
          const img = new Image();
          img.src = `/frames 30/output_${frameIndex.toString().padStart(4, '0')}.jpg`;
          img.onload = () => {
            loadedImages[i] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
            resolve(null);
          };
          img.onerror = () => resolve(null);
        });
      }));
    };

    const startLoading = async () => {
      // 1. Critical Batch: Load first 180 frames worth of data (~30-60 images depending on step)
      const criticalCount = Math.ceil(180 / step);
      const criticalBatch = Array.from({ length: Math.min(criticalCount, totalToLoad) }, (_, i) => i);
      await loadBatch(criticalBatch);
      
      // Reconstruct initial map so we can at least show the first part
      const initialImages: HTMLImageElement[] = new Array(frameCount);
      for (let j = 0; j < initialImages.length; j++) {
        const idx = Math.floor(j / step);
        initialImages[j] = loadedImages[idx];
      }
      setImages(initialImages);
      imagesRef.current = initialImages;
      setIsLoaded(true);
      
      setShowPopup(true);

      // 2. Background Batching: Load rest in larger chunks for 30fps
      const remainingIndices = Array.from({ length: totalToLoad - criticalCount }, (_, i) => i + criticalCount);
      for (let i = 0; i < remainingIndices.length; i += 30) {
        const batch = remainingIndices.slice(i, i + 30);
        await loadBatch(batch);
        
        // Update images map periodically as background loads finish
        if (i % 120 === 0 || i + 30 >= remainingIndices.length) {
          const updatedImages: HTMLImageElement[] = new Array(frameCount);
          for (let j = 0; j < updatedImages.length; j++) {
            const idx = Math.floor(j / step);
            updatedImages[j] = loadedImages[idx] || initialImages[j];
          }
          imagesRef.current = updatedImages;
          setImages(updatedImages);
        }
      }
    };

    startLoading();
  }, []);

  // Canvas + GSAP
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = () => {
      const idx = Math.min(Math.floor(airbnb.current.frame), frameCount - 1);
      const img = imagesRef.current[idx];
      if (img && img.complete) {
        const cA = canvas.width / canvas.height;
        const iA = img.width / img.height;
        let dW, dH, oX = 0, oY = 0;

        if (cA > iA) {
          dW = canvas.width;
          dH = canvas.width / iA;
          oY = (canvas.height - dH) / 2;
        } else {
          dH = canvas.height;
          dW = canvas.height * iA;
          oX = (canvas.width - dW) / 2;
        }

        context.drawImage(img, oX, oY, dW, dH);
      }
      if (progressRef.current) {
        progressRef.current.style.width = `${(idx / (frameCount - 1)) * 100}%`;
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Section reveals, Background Story-Sync, and Mobile Interactivity
    document.querySelectorAll('section').forEach((section, index) => {
      // 30 FPS Scaled Flow Points
      const sectionFlow = [
        { id: 'hero', start: 0, end: 320 },
        { id: 'problem', start: 321, end: 720 },
        { id: 'stuck', start: 721, end: 1050 },
        { id: 'ignition', start: 1051, end: 1260 },
        { id: 'chapters', start: 1261, end: 1530 },
        { id: 'who-it-is-for', start: 1531, end: 1650 },
        { id: 'faq', start: 1651, end: 1710 },
        { id: 'cta', start: 1711, end: 1784 }
      ];

      const flow = sectionFlow.find(f => f.id === section.id);
      if (flow) {
        gsap.to(airbnb.current, {
          frame: flow.end,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            scrub: window.innerWidth < 768 ? 0.8 : 2.5, // Heavier scrub for buttery cinematic lag
            onUpdate: render
          }
        });
      }

      gsap.from(section.querySelectorAll('.reveal'), {
        y: 30,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          once: true
        }
      });

      // Mobile Interaction: Dynamic "Tap to Unleash" feedback
      if (window.innerWidth < 768) {
        section.addEventListener('touchstart', (e) => {
          gsap.to(section.querySelectorAll('.reveal'), {
            scale: 1.03,
            y: -5,
            duration: 0.3,
            opacity: 1,
            ease: "expo.out",
            stagger: 0.05
          });
          gsap.to(overlayRef.current, { opacity: op - 0.1, duration: 0.2 });
        });
        section.addEventListener('touchend', () => {
          gsap.to(section.querySelectorAll('.reveal'), { scale: 1, y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(overlayRef.current, { opacity: op, duration: 0.4 });
        });
      }

      let op = 0.5;
      if (section.classList.contains('intense-moment')) op = 0.2;
      if (section.id === 'hero') op = 0.3;

      ScrollTrigger.create({
        trigger: section, start: "top 50%",
        onEnter: () => gsap.to(overlayRef.current, { opacity: op, duration: 2, ease: "power2.out" }),
        onEnterBack: () => gsap.to(overlayRef.current, { opacity: op, duration: 2, ease: "power2.out" })
      });
    });

    return () => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [isLoaded]);

  // Custom Cursor
  useEffect(() => {
    if (!isLoaded) return;
    const cursor = document.getElementById('cursor-dot');
    const move = (e: MouseEvent) => { gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" }); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isLoaded]);

  // 🧹 CLEANUP & RESET FORM
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoadingCheckout(false);
    // Only reset data if fully closing to avoid frustration on accidental clicks, 
    // but here we follow user request for full reset.
    setUserData({ name: '', email: '', mobile: '' });
    setFormErrors({ email: '', mobile: '' });
  };

  // ── CONFIGURATION ──
  const BASE_URL = "https://say-backend-ux5j.onrender.com";

  // Razorpay Handle Payment
  const initiateCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // 🔍 FORM VALIDATION
    let errors = { email: '', mobile: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!emailRegex.test(userData.email)) errors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(userData.mobile)) errors.mobile = "Please enter a valid mobile number.";

    if (errors.email || errors.mobile) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({ email: '', mobile: '' });
    setIsLoadingCheckout(true);

    // 📓 Log data to console for tracking
    console.log("Checkout Initiated:", userData);
    
    try {
      // 1. 📇 Backend Lead Capture (Parallel)
      fetch(`${BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).catch(() => {}); // ignore capture failure during checkout

      // 2. 🎟️ Create Real Razorpay Order via Backend
      const orderResponse = await fetch(`${BASE_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }) // ₹1.00 for testing
      });

      const orderData = await orderResponse.json();

      if (!orderData.success || !orderData.order_id) {
        throw new Error(orderData.message || "Backend failed to generate order_id");
      }

      console.log("📦 Order Created:", orderData.order_id);

      // 2.5 🗄️ Save User to Supabase (Pending)
      await fetch(`${BASE_URL}/save-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.mobile,
          order_id: orderData.order_id
        })
      }).catch(err => console.error("Supabase Save Error:", err));

      // 3. 💳 Launch Dynamic Razorpay Checkout
      const options = {
        key: "rzp_test_SSfFE0Q0wDz1az", // Test Key
        amount: 100, 
        currency: "INR",
        name: "Unleash The Beast",
        description: "Social Anxiety And YOU - Ebook Access",
        order_id: orderData.order_id, // REAL Dynamic Order ID
        handler: async function (response: any) {
          try {
            // 🏆 Log captured payment values
            console.log("💰 CHECKOUT SUCCESS. VERIFYING SIGNATURE...");

            // 4. 🛰️ Send to Backend for Cryptographic Verification
            const verifyResponse = await fetch(`${BASE_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              console.log("✅ PAYMENT VERIFIED ON SERVER");

              // 5. 🗄️ Update Database to Success
              await fetch(`${BASE_URL}/update-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id
                })
              }).catch(err => console.error("Supabase Update Error:", err));

              alert(`🎉 PAYMENT SUCCESSFUL & VERIFIED!\n\nThank you, ${userData.name}. Your access is now live.`);
              
              setIsLoadingCheckout(false);
              setIsModalOpen(false);
              
              // Secure redirect to success page
              navigate(`/success?id=${response.razorpay_payment_id}&name=${encodeURIComponent(userData.name)}`);
            } else {
              throw new Error("Payment signature verification failed. Possible fraud.");
            }

          } catch (err: any) {
            console.error("❌ Verification Failed:", err);
            alert("Security Error: Payment verification failed. Please contact support.");
            setIsLoadingCheckout(false);
          }
        },
        prefill: { 
          name: userData.name, 
          email: userData.email, 
          contact: userData.mobile 
        },
        theme: { color: "#991b1b" },
        modal: {
          ondismiss: function() {
            setIsLoadingCheckout(false);
            console.log("💳 Checkout dismissed by user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("🚨 Checkout System Error:", err);
      alert("System Error: Unable to reach payment gateway. Please ensure backend is running.");
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[var(--bg-base)] font-sans overflow-x-hidden">
      {isLoaded && <AnimatedNavFramer />}

      {/* Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full object-cover z-0 contrast-[1.1] brightness-[0.85] will-change-transform"
        style={{ transform: 'translateZ(0)' }} // Force GPU
        aria-hidden="true" 
      />
      <div ref={overlayRef} className="fixed inset-0 bg-[var(--bg-base)] z-1 pointer-events-none" style={{ transition: 'opacity 2s var(--ease-out)', opacity: 0.3 }} aria-hidden="true" />

      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-2" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-[var(--accent-dim)]/15 blur-[180px] rounded-full translate-x-1/4 -translate-y-1/4 opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[var(--accent-dim)]/10 blur-[150px] rounded-full -translate-x-1/4 translate-y-1/4 opacity-30 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div id="cursor-dot" className="fixed w-3 h-3 bg-[var(--accent)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block" style={{ boxShadow: '0 0 15px var(--accent-glow)' }} aria-hidden="true" />

      {/* Progress */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[var(--border)] z-[60]" aria-hidden="true">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-[var(--accent-dim)] via-[var(--accent)] to-red-600" style={{ width: '0%', transition: 'width 0.15s linear', boxShadow: '0 0 16px var(--accent-glow)' }} />
      </div>

      {/* Liquid Background (Three.js) */}
      <LiquidBackground />

      {/* Loading */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[1000] bg-[var(--bg-deep)] flex items-center justify-center flex-col">
          <LoadingLines />
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="text-zinc-600 text-[10px] tracking-[0.6em] uppercase font-black animate-pulse">
              Establishing Horizon...
            </div>
            <div className="text-[var(--accent)] text-[11px] font-black font-mono tracking-widest">
              {loadProgress}%
            </div>
          </div>
        </div>
      )}

      {/* 📧 Lead Capture Checkout Modal (Sleek & Simple) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0c0c0c] border border-white/5 p-8 md:p-14 rounded-[40px] max-w-lg w-full relative shadow-[0_0_100px_rgba(0,0,0,1)] selection:bg-red-600/30"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>

              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Secure Checkout</h2>
                <div className="flex items-center gap-3">
                   <div className="h-[1px] w-8 bg-red-600" />
                   <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Unleash The Beast Access</p>
                </div>
              </div>

              <form onSubmit={initiateCheckout} className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  {/* Name Input */}
                  <div className="group relative">
                    <label className="absolute -top-2.5 left-4 bg-[#0c0c0c] px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-red-600 transition-colors z-10">
                      Full Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white placeholder:text-zinc-800 focus:border-red-600/50 focus:bg-white/[0.04] outline-none transition-all"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="group relative">
                    <label className="absolute -top-2.5 left-4 bg-[#0c0c0c] px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-red-600 transition-colors z-10">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className={`w-full bg-white/[0.02] border ${formErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white placeholder:text-zinc-800 focus:border-red-600/50 focus:bg-white/[0.04] outline-none transition-all`}
                        value={userData.email}
                        onChange={(e) => {
                          setUserData({...userData, email: e.target.value});
                          if (formErrors.email) setFormErrors({...formErrors, email: ''});
                        }}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">
                        <AlertCircle className="inline size-3 mr-1 align-middle" /> {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Input */}
                  <div className="group relative">
                    <label className="absolute -top-2.5 left-4 bg-[#0c0c0c] px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-red-600 transition-colors z-10">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        required
                        type="tel" 
                        placeholder="+91 00000 00000"
                        className={`w-full bg-white/[0.02] border ${formErrors.mobile ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white placeholder:text-zinc-800 focus:border-red-600/50 focus:bg-white/[0.04] outline-none transition-all`}
                        value={userData.mobile}
                        onChange={(e) => {
                          setUserData({...userData, mobile: e.target.value});
                          if (formErrors.mobile) setFormErrors({...formErrors, mobile: ''});
                        }}
                      />
                    </div>
                    {formErrors.mobile && (
                      <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">
                        <AlertCircle className="inline size-3 mr-1 align-middle" /> {formErrors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoadingCheckout}
                    className={`group relative w-full ${isLoadingCheckout ? 'bg-zinc-800 pointer-events-none' : 'bg-red-600 hover:bg-red-700'} text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl flex items-center justify-center gap-4 transition-all overflow-hidden shadow-[0_20px_40px_rgba(220,38,38,0.2)] active:scale-[0.98]`}
                  >
                    <span className="relative z-10">{isLoadingCheckout ? 'Processing...' : 'Proceed to Payment'}</span>
                    {!isLoadingCheckout && <ArrowRight className="size-4 relative z-10 group-hover:translate-x-1 transition-transform" /> }
                    {isLoadingCheckout && <Sparkles className="size-4 animate-spin" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 opacity-20 pt-4 grayscale">
                  <ShieldCheck className="size-4 text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Verified Secure Session</span>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Awareness Popup */}
      <AnimatePresence>
        {showPopup && <AwarenessPopup onClose={() => setShowPopup(false)} />}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          JOURNEY CONTENT
          ═══════════════════════════════════════════ */}
      <div className="relative z-10 w-full">

        {/* ── 2. HERO ──────────────────────────── */}
        <section id="hero" className="min-h-[110vh] flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/90 via-[var(--bg-base)]/40 to-transparent pointer-events-none z-[-1]" />

          <div className="max-w-4xl">
            <div className="reveal flex items-center gap-[var(--space-4)] mb-[var(--space-6)]">
              <div className="w-10 h-[1px] bg-[var(--accent)]" />
              <span className="text-[var(--accent)] text-[11px] tracking-[0.5em] font-bold uppercase">Begin the Journey</span>
            </div>

            <h1 className="reveal font-black text-[clamp(40px,9vw,100px)] leading-[0.85] text-[var(--fg-primary)] uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              You're Not<br />Socially Anxious.<br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-red-500 bg-clip-text text-transparent relative inline-block">
                You're Running a<br />Hidden Program.
                <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--accent)] via-red-500 to-transparent rounded-full" />
              </span>
            </h1>

            <p className="reveal mt-[var(--space-8)] text-lg md:text-xl text-[var(--fg-primary)] max-w-xl leading-relaxed font-semibold bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-lg">
              This isn't about confidence tricks, conversation tips, or "just be yourself" advice.
            </p>

            <p className="reveal mt-[var(--space-4)] text-[15px] md:text-lg text-[var(--fg-muted)] max-w-lg leading-relaxed font-normal">
              If you've ever felt your mind go blank, your body freeze, or your personality disappear in social situations… <span className="text-[var(--fg-primary)] font-medium italic">you already know something deeper is happening.</span>
            </p>

            <div className="reveal mt-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-6)]">
              <UiverseButton text={isLoadingCheckout ? "LOADING..." : "BUY NOW"} onClick={() => setIsModalOpen(true)} />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 text-[10px] md:text-[11px] text-[var(--fg-subtle)] font-bold uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> No Performance
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-[11px] text-[var(--fg-subtle)] font-bold uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Just Understanding
                </div>
              </div>
            </div>

            <p className="reveal mt-[var(--space-6)] text-[13px] text-[var(--fg-muted)] font-normal italic opacity-60">
              Everything changes after you see the program.
            </p>
          </div>
        </section>

        {/* ── 3. THE PROBLEM ───────────────────── */}
        <section id="problem" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/85 via-transparent to-transparent pointer-events-none z-[-1]" />
          <div className="max-w-3xl">
            <span className="reveal text-[var(--accent)] text-[12px] tracking-[0.5em] font-bold uppercase mb-[var(--space-5)] block">
              01 // The Conflict
            </span>

            <h2 className="reveal font-black text-[clamp(32px,6vw,72px)] leading-[0.92] text-[var(--fg-primary)] uppercase tracking-tighter mb-[var(--space-6)]">
              You struggle because something inside you shuts you down.
            </h2>

            <p className="reveal text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed font-normal mb-[var(--space-7)] max-w-2xl italic pl-6 border-l-2 border-[var(--accent-dim)]">
              "It feels like there's a version of you inside — confident, natural, expressive — but you can't access it when it matters."
            </p>

            <div className="reveal mb-[var(--space-5)]">
              <span className="text-[var(--fg-subtle)] text-xs font-bold uppercase tracking-[0.4em]">The Symptoms:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
              {[
                "Rehearsing words that never come out.",
                "Hours of post-conversation analysis.",
                "Feeling exposed and watched.",
                "Acting like a stranger to yourself.",
              ].map((item, i) => (
                <div key={i} className="reveal flex items-center gap-[var(--space-4)] bg-white/5 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                  <span className="text-[var(--accent)] font-black text-lg">0{i + 1}</span>
                  <p className="text-[var(--fg-muted)] text-[14px] leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. WHY YOU FEEL STUCK ────────────── */}
        <section id="stuck" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-black/20 pointer-events-none z-[-1]" />
          <div className="max-w-3xl">
            <span className="reveal text-[var(--accent)] text-[12px] tracking-[0.5em] font-bold uppercase mb-[var(--space-5)] block">
              02 // The Loop
            </span>

            <h2 className="reveal font-black text-[clamp(32px,6vw,72px)] leading-[0.92] text-[var(--fg-primary)] uppercase tracking-tighter mb-[var(--space-5)]">
              Your behavior is not<br />the problem.
            </h2>

            <p className="reveal text-[var(--fg-muted)] text-base md:text-lg leading-relaxed font-normal mb-[var(--space-8)] max-w-2xl">
              Most advice tells you to fix the surface. But when you try to force confidence, you're just adding another layer of performance. You filter, you hide, you perform.
            </p>

            <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-[var(--space-5)] mb-[var(--space-8)]">
              <div className="text-center p-6 border border-white/10 rounded-xl bg-black/20 backdrop-blur-lg">
                <div className="text-[var(--accent)] font-black text-2xl mb-2">FILTER</div>
                <p className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-widest">Your Thoughts</p>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-xl bg-black/20 backdrop-blur-lg">
                <div className="text-[var(--accent)] font-black text-2xl mb-2">HIDE</div>
                <p className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-widest">Your Reality</p>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-xl bg-black/20 backdrop-blur-lg">
                <div className="text-[var(--accent)] font-black text-2xl mb-2">PERFORM</div>
                <p className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-widest">For Others</p>
              </div>
            </div>

            <p className="reveal text-[var(--accent)] text-lg md:text-xl font-black uppercase tracking-tight">
              You lose connection with your real self.
            </p>
          </div>
        </section>

        {/* ── 5. THE IGNITION ──────────────────── */}
        <section id="ignition" className="min-h-screen flex items-center justify-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] text-center intense-moment relative">
          <div className="absolute inset-0 bg-black/50 pointer-events-none z-[-1]" />
          <div className="max-w-4xl">
            <span className="reveal text-[var(--accent)] text-[13px] tracking-[0.6em] font-bold uppercase mb-[var(--space-6)] block">
              III // The Realization
            </span>

            <h2 className="reveal font-black text-[clamp(40px,8vw,100px)] leading-[0.85] text-[var(--fg-primary)] uppercase tracking-tighter mb-[var(--space-6)] text-glow">
              You don't need to<br />become confident.
            </h2>

            <p className="reveal text-[clamp(24px,4vw,48px)] text-[var(--accent)] font-black uppercase tracking-tight mb-[var(--space-8)] drop-shadow-[0_0_20px_var(--accent)]">
              You already are.
            </p>

            <p className="reveal text-[var(--fg-muted)] text-base md:text-xl leading-relaxed font-normal max-w-2xl mx-auto bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/5">
              Confidence isn't something you gain. It's what's left when you stop running the program that suppresses it. When the resistance is gone, things become natural.
            </p>
          </div>
        </section>

        {/* ── 6. FIVE CHAPTERS ─────────────────── */}
        <section id="chapters" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-[-1]" />
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--space-8)] gap-[var(--space-4)]">
              <div className="max-w-xl">
                <span className="reveal text-[var(--accent)] text-[12px] tracking-[0.5em] font-bold uppercase mb-[var(--space-4)] block">
                  Inside the Mind
                </span>
                <h2 className="reveal font-black text-[clamp(36px,5vw,72px)] uppercase tracking-tighter text-[var(--fg-primary)] leading-[0.9]">
                  The Roadmap to Freedom
                </h2>
              </div>
              <p className="reveal text-[var(--fg-subtle)] text-[14px] md:text-right font-medium max-w-xs uppercase tracking-widest leading-loose">
                Five chapters that dissolve the invisible cage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-5)] lg:gap-[var(--space-6)]">
              <ChapterCard number="01" title="The Invisible Cage" description="Why it feels like you're trapped in your own mind, and why the same patterns keep repeating." />
              <ChapterCard number="02" title="The Mask You Wear" description="Why you feel fake around people, and how this 'mask' was created." />
              <ChapterCard number="03" title="The Fear Behind the Smile" description="What actually triggers social anxiety, panic, and overthinking." />
              <ChapterCard number="04" title="The Inner Mechanism" description="A simple method to dissolve anxiety from within — not suppress it." />
              <ChapterCard number="05" title="Effortless Confidence" description="What happens when you stop pretending and start being fully yourself." />
              <div className="hidden lg:flex items-center justify-center p-8 border border-dashed border-white/10 rounded-xl opacity-40">
                <span className="text-[11px] uppercase tracking-[0.5em] font-bold">Unleash the Beast</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. WHY THIS IS DIFFERENT ──────────── */}
        <section id="different" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/90 via-transparent to-transparent pointer-events-none z-[-2]" />
          <div className="max-w-3xl">
            <span className="reveal text-[var(--accent)] text-[12px] tracking-[0.5em] font-bold uppercase mb-[var(--space-5)] block">
              05 // The Approach
            </span>

            <h2 className="reveal font-black text-[clamp(32px,6vw,72px)] leading-[0.92] text-[var(--fg-primary)] uppercase tracking-tighter mb-[var(--space-6)]">
              This is not motivation.<br />This is understanding.
            </h2>

            <p className="reveal text-[var(--fg-muted)] text-base md:text-lg leading-relaxed font-normal mb-[var(--space-8)]">
              Motivation is a temporary spark. Understanding is the light that stays on. This book doesn't give you scripts — it gives you the eyes to see what's actually controling you.
            </p>

            <div className="space-y-[var(--space-6)] relative">
              <div className="absolute left-0 top-0 w-[1px] h-full bg-white/10" aria-hidden="true" />
              {[
                "Dissolve the root instead of trimming the branches.",
                "See the mechanism in real-time as it happens.",
                "End the internal war between 'Safe' and 'Real'.",
                "Access your natural personality effortlessly.",
              ].map((item, i) => (
                <div key={i} className="reveal flex items-center gap-[var(--space-5)] pl-[var(--space-6)] group">
                  <div className="w-2 h-2 rounded-full border border-[var(--accent)] group-hover:bg-[var(--accent)] transition-all duration-300" />
                  <p className="text-[var(--fg-primary)] text-[15px] md:text-lg font-bold tracking-tight">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. WHO THIS IS FOR ───────────────── */}
        <section id="who-it-is-for" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-black/50 pointer-events-none z-[-1]" />
          <div className="max-w-4xl w-full mx-auto">
            <h2 className="reveal font-black text-[clamp(36px,6vw,84px)] leading-[0.85] text-center text-[var(--fg-primary)] uppercase tracking-tighter mb-[var(--space-10)]">
              Is This For You?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-6)]">
              <div className="reveal bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-10">
                <h3 className="text-[var(--accent)] text-xs font-black uppercase tracking-[0.4em] mb-8">The Solution If:</h3>
                <div className="space-y-[var(--space-5)]">
                  {[
                    "You feel real when alone, but fake around people.",
                    "Overthinking is your default social state.",
                    "You feel trapped behind a polite surface.",
                    "You want to stop coping and start living.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-[var(--accent)] mt-0.5">●</span>
                      <p className="text-[var(--fg-primary)] text-[14px] md:text-[15px] font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal bg-white/5 border border-white/5 rounded-2xl p-8 md:p-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <h3 className="text-[var(--fg-subtle)] text-xs font-black uppercase tracking-[0.4em] mb-8">Not For You If:</h3>
                <div className="space-y-[var(--space-5)]">
                  {[
                    "You want more masking techniques.",
                    "Self-reflection feels too dangerous.",
                    "You prefer superficial transformations.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 opacity-70">
                      <span className="text-[var(--fg-subtle)] mt-1">○</span>
                      <p className="text-[var(--fg-muted)] text-[14px] font-normal leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. FAQ ───────────────────────────── */}
        <section id="faq" className="min-h-screen flex items-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/90 via-transparent to-transparent pointer-events-none z-[-1]" />
          <div className="w-full max-w-3xl">
            <span className="reveal text-[var(--accent)] text-[12px] tracking-[0.5em] font-bold uppercase mb-[var(--space-4)] block">
              Assurance
            </span>
            <h2 className="reveal font-black text-[clamp(40px,7vw,80px)] uppercase tracking-tighter text-[var(--fg-primary)] mb-[var(--space-8)]">
              FAQ
            </h2>

            <div className="reveal relative z-10 border-t border-white/10">
              <FaqItem
                question="Will this remove social anxiety instantly?"
                answer="No. But it will show you exactly why it exists and how to dissolve it step by step."
              />
              <FaqItem
                question="Is this just theory?"
                answer="No. Everything is explained in a way you can directly observe and apply."
              />
              <FaqItem
                question="Do I need to practice techniques daily?"
                answer="No strict routines. This is about awareness, not forcing habits."
              />
              <FaqItem
                question="What happens after I buy?"
                answer="After successful payment, you'll be redirected to a private download page where you can access your ebook instantly."
              />
              <FaqItem
                question="Is payment secure?"
                answer="Yes. All payments are handled securely through Razorpay."
              />
            </div>
          </div>
        </section>

        <section id="cta" className="min-h-[120vh] flex items-center justify-center px-[var(--space-6)] md:px-[var(--space-9)] py-[var(--space-9)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 pointer-events-none z-[-1]" aria-hidden="true" />

          {/* Refined Ambient Glow */}
          <motion.div
            style={{ opacity: ctaGlowOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl flex flex-col items-center relative z-10 w-full">
            {/* Dynamic Reveal Book Cover */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="mb-[var(--space-10)] relative group active:scale-95 transition-transform cursor-pointer"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-[var(--accent)]/20 blur-[80px] rounded-full scale-110 group-hover:scale-135 transition-transform duration-1000" aria-hidden="true" />

              <div className="relative z-10 transition-all duration-700 animate-[float-cover_8s_infinite_ease-in-out]">
                {/* Book Image */}
                <img
                  src="/ebook cover.png"
                  alt="Social Anxiety And YOU — Ebook Cover"
                  className="w-[260px] md:w-[400px] h-auto rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.9)] brightness-110 contrast-110 group-hover:contrast-125 transition-all duration-500"
                />

                {/* Shine/Sweep Reveal Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                  <motion.div
                    initial={{ left: '-100%' }}
                    whileInView={{ left: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    className="absolute top-0 w-24 h-full bg-white/20 -skew-x-20 blur-xl"
                  />
                </div>
              </div>
            </motion.div>

            <div className="reveal space-y-4 mb-[var(--space-8)]">
              <p className="text-[var(--fg-muted)] text-base md:text-xl leading-relaxed font-medium max-w-lg mb-2">
                You've already tried fixing this from the outside.<br />
                <span className="text-[var(--fg-primary)] font-black uppercase text-2xl tracking-tight">It didn't last.</span>
              </p>
              <h3 className="text-[var(--fg-primary)] text-xl md:text-3xl font-black uppercase tracking-tight text-glow-white">
                Understand it from within.
              </h3>
            </div>

            <div className="reveal">
              <UiverseButton text={isLoadingCheckout ? "LOADING..." : "BUY THE EBOOK"} onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Instant Access Section Refinement */}
            <div className="reveal mt-[var(--space-10)] grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl opacity-80">
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)]/30 border border-[var(--accent)]/50 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <Zap className="size-6 fill-[var(--accent)]/20" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-widest font-black block text-[var(--fg-primary)] mb-1">Instant Access</span>
                  <span className="text-[10px] text-[var(--fg-subtle)] font-medium leading-tight">Download path shared immediately.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)]/30 border border-[var(--accent)]/50 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="size-6 fill-[var(--accent)]/20" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-widest font-black block text-[var(--fg-primary)] mb-1">Encrypted Pay</span>
                  <span className="text-[10px] text-[var(--fg-subtle)] font-medium leading-tight">100% secure via Razorpay gateway.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)]/30 border border-[var(--accent)]/50 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <Smartphone className="size-6 fill-[var(--accent)]/20" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-widest font-black block text-[var(--fg-primary)] mb-1">Mobile Optimized</span>
                  <span className="text-[10px] text-[var(--fg-subtle)] font-medium leading-tight">Read easily on any phone or tablet.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. FOOTER ───────────────────────── */}
        <Footer />

      </div>
    </div>
  );
}
