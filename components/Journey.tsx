"use client";

import { useEffect, useRef, useState } from "react";
import { sampleJourney } from "@/lib/journey-data";

type Props = { modelSrc: string };

export default function Journey({ modelSrc }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLElement & { cameraOrbit: string; cameraTarget: string; fieldOfView: string; jumpCameraToGoal: () => void }>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);
  const rafId = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      rawProgress.current = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const chapters = [
      0.18, 0.38, 0.58, 0.76, 0.88, 1.0, // must match JOURNEY chapter p-values
    ];
    const tick = () => {
      smoothProgress.current += 0.16 * (rawProgress.current - smoothProgress.current);
      const p = smoothProgress.current;
      const sample = sampleJourney(p);

      if (bgRef.current) bgRef.current.style.backgroundColor = sample.bg;
      const mv = modelRef.current;
      if (mv && ready) {
        mv.cameraOrbit = sample.cameraOrbit;
        mv.cameraTarget = sample.cameraTarget;
        mv.fieldOfView = sample.fieldOfView;
        mv.jumpCameraToGoal();
      }

      chapters.forEach((cp, idx) => {
        const dist = Math.abs(p - cp);
        const alpha = Math.max(0, 1 - dist / 0.13);
        const g = alpha * alpha * (3 - 2 * alpha);
        const node = chapterRefs.current[idx];
        if (node) {
          node.style.opacity = String(g);
          node.style.transform = `translateY(${(30 * (1 - g)).toFixed(2)}px) scale(${(0.88 + 0.12 * g).toFixed(4)})`;
          node.style.filter = g > 0.995 ? "none" : `blur(${(9 * (1 - g)).toFixed(2)}px)`;
          node.style.pointerEvents = g > 0.6 ? "auto" : "none";
        }
      });

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [ready]);

  const chapters = [
    { eyebrow: "FREZORA", title: "Meet Frezora.", copy: "A bladeless neck fan you wear, not hold." },
    {
      eyebrow: "CONTACT PADS",
      title: "Your comfort is the whole point.",
      copy: "Contoured pads rest against your neck.",
    },
    {
      eyebrow: "BLADELESS AIRFLOW",
      title: "Three speeds. No blades.",
      copy: "Air moves through the outlet, not past a spinning blade.",
    },
    {
      eyebrow: "USB-C",
      title: "Charge it with what you already own.",
      copy: "A full charge takes approximately 4.5 hours.",
    },
    {
      eyebrow: "LED DISPLAY",
      title: "See your setting. See your power.",
      copy: "The display shows the selected airflow level and battery information.",
    },
    { eyebrow: "THREE COLOURS", title: "One product. Built around your day." },
  ];

  return (
    <section id="journey" className="relative">
      <div ref={wrapRef} className="relative" style={{ height: "540vh" }}>
        <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div ref={bgRef} className="absolute inset-0 transition-colors" style={{ backgroundColor: "rgb(26,24,22)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <model-viewer
              ref={modelRef}
              src={modelSrc}
              interaction-prompt="none"
              shadow-intensity="1.05"
              exposure="1.05"
              environment-image="neutral"
              disable-zoom
              disable-tap
              loading="eager"
              min-camera-orbit="-Infinity 0deg 0.4m"
              max-camera-orbit="Infinity 180deg 40m"
              style={{ width: "100%", height: "100%", background: "transparent" }}
              onLoad={() => setReady(true)}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="max-w-[1160px] mx-auto h-full px-4 sm:px-6 relative">
              {chapters.map((c, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                  className="absolute left-4 sm:left-6 bottom-[9%] sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 w-[min(92%,540px)] rounded-[22px] p-7 sm:p-9"
                  style={{
                    opacity: 0,
                    background: "rgba(10,12,16,0.55)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#f2f4f7",
                    boxShadow: "0 30px 80px -34px rgba(0,0,0,.8)",
                  }}
                >
                  <span className="eyebrow" style={{ color: "#8fc7ff" }}>
                    {c.eyebrow}
                  </span>
                  <h3 className="font-display font-semibold text-[2rem] sm:text-[3.25rem] mt-2 leading-[1.02] tracking-[-0.025em]">
                    {c.title}
                  </h3>
                  {c.copy && <p className="mt-3 text-sm sm:text-base text-white/70">{c.copy}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
