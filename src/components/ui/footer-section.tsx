'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { InstagramIcon, YoutubeIcon, ShieldCheck, Download, Headphones } from 'lucide-react';

const BrandIcon = () => (
  <img src="/logo.jpg" alt="Unleash The Beast — Brand Logo" className="size-8 rounded-sm opacity-80 contrast-125" />
);

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'The Journey',
    links: [
      { title: 'The Problem', href: '#problem' },
      { title: 'Why You Feel Stuck', href: '#stuck' },
      { title: 'The Ignition', href: '#ignition' },
      { title: 'Chapters', href: '#chapters' },
    ],
  },
  {
    label: 'The Book',
    links: [
      { title: 'Why It\'s Different', href: '#different' },
      { title: 'Who It\'s For', href: '#who-it-is-for' },
      { title: 'FAQ', href: '#faq' },
      { title: 'Get the Book', href: '#cta' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: 'YouTube', href: 'https://www.youtube.com/@UnleashTBofficial', icon: YoutubeIcon },
      { title: 'Instagram', href: '#', icon: InstagramIcon },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative w-full border-t border-[var(--border)] bg-[var(--bg-deep)] py-[var(--space-7)] px-[var(--space-5)] md:px-[var(--space-9)] z-50 overflow-hidden" role="contentinfo">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent blur-[1px]" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[100px] bg-[var(--accent-dim)]/10 blur-[80px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid w-full gap-[var(--space-7)] lg:grid-cols-[1fr_2fr] xl:gap-[var(--space-8)]">

          {/* Brand Column */}
          <AnimatedContainer className="space-y-[var(--space-5)]">
            <BrandIcon />
            <div>
              <div className="font-black text-[var(--fg-primary)] tracking-widest text-sm uppercase">
                Unleash The Beast
              </div>
              <p className="text-[var(--fg-subtle)] text-xs font-normal mt-[var(--space-2)] leading-relaxed max-w-[280px]">
                Helping you break internal limits and become who you already are.
              </p>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-[var(--space-4)] pt-[var(--space-3)]">
              <div className="flex items-center gap-[var(--space-2)] text-[var(--fg-subtle)] text-[10px] uppercase tracking-widest font-medium">
                <ShieldCheck className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
                Secure Payments
              </div>
              <div className="flex items-center gap-[var(--space-2)] text-[var(--fg-subtle)] text-[10px] uppercase tracking-widest font-medium">
                <Download className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
                Instant Access
              </div>
            </div>
          </AnimatedContainer>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[var(--space-6)]">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                <div className="space-y-[var(--space-4)]">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] border-b border-[var(--accent-dim)]/20 pb-3">
                    {section.label}
                  </h3>
                  <ul className="text-[var(--fg-subtle)] space-y-3 text-[11px] font-medium tracking-wide">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="hover:text-[var(--accent)] inline-flex items-center transition-colors duration-200 cursor-pointer"
                        >
                          {link.icon && <link.icon className="me-2 size-3" aria-hidden="true" />}
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-[var(--space-7)] pt-[var(--space-5)] border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-[var(--space-3)]">
          <p className="text-[var(--fg-subtle)] text-[10px] uppercase font-medium tracking-widest">
            © {new Date().getFullYear()} Unleash The Beast. All rights reserved.
          </p>
          <p className="text-[var(--fg-subtle)] text-[10px] uppercase font-medium tracking-widest">
            Payments secured by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
  key?: string | number;
};

function AnimatedContainer({ className, delay = 0.1, children, key }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div key={key} className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(6px)', translateY: 16, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
