"use client";

import { motion } from "framer-motion";

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden theme-warm" style={{ background: "#F6EFE3" }}>
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/images/hero.webp"
          alt=""
          className="w-full h-full object-cover"
          style={{ animation: "heroZoom 16s ease-out forwards" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,239,227,0.35) 0%, rgba(246,239,227,0.10) 30%, rgba(30,24,16,0.30) 78%, rgba(20,16,10,0.55) 100%)",
          }}
        />
      </div>
      <style>{`@keyframes heroZoom{from{transform:scale(1.08)}to{transform:scale(1)}}`}</style>

      <div className="relative z-10 max-w-[1160px] mx-auto px-4 sm:px-6 min-h-[calc(100svh-64px)] flex flex-col justify-center py-24">
        <div className="max-w-[34rem]">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="eyebrow text-[#7a5a2a]"
          >
            WHEN THE DAY HEATS UP
          </motion.span>
          <h1 className="font-display font-semibold tracking-[-0.02em] text-[#241d12] text-[2.4rem] sm:text-5xl lg:text-[3.9rem] leading-[1.02] mt-4">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Heat doesn&rsquo;t wait.
            </motion.span>
            <motion.span custom={2} variants={fadeUp} initial="hidden" animate="show" className="block">
              Neither should you.
            </motion.span>
          </h1>
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-base md:text-lg leading-[1.5] text-[#40372a] max-w-[46ch]"
          >
            Meet Frezora — hands-free airflow for warm commutes, desk days and everyday movement.
          </motion.p>
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#journey"
              className="btn-lift inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#181410] text-[#f6efe3] text-sm font-medium shadow-[0_12px_30px_rgba(40,25,10,0.25)]"
            >
              Meet Frezora →
            </a>
            <a
              href="#colors"
              className="btn-lift inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white/55 text-[#241d12] text-sm font-medium border border-[rgba(60,45,20,0.22)]"
            >
              Explore colors
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
