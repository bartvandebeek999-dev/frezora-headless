"use client";
import { motion } from "framer-motion";

const FACTS = [
  { title: "3 airflow speeds", text: "Choose the airflow that fits the moment.", icon: "M12 2v20M4.9 6l14.2 12M19.1 6 4.9 18M2 12h20" },
  { title: "Hands-free comfort", text: "Wear it around your neck and keep moving.", icon: "M5 12a7 7 0 0 1 14 0v5a3 3 0 0 1-3 3h-1v-7h4M5 13h4v7H8a3 3 0 0 1-3-3v-5Z" },
  { title: "USB-C charging", text: "Recharge the 4000mAh battery when needed.", icon: "M13 2 5 14h6l-1 8 9-13h-6l0-7Z" },
];

export default function Facts() {
  return (
    <section id="facts" className="py-24">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-8">
        {FACTS.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-line"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8 mb-4 text-ice">
              <path d={f.icon} />
            </svg>
            <p className="font-medium mb-1">{f.title}</p>
            <p className="text-sm text-ink/60">{f.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
