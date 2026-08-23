"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "What do I receive?",
    a: "The Frezora AirFlow Neck Fan, a USB-C charging cable, the user manual, and protective retail packaging.",
  },
  { q: "How many airflow settings does Frezora have?", a: "Frezora has three selectable airflow settings." },
  { q: "What does the display show?", a: "The display shows the selected airflow level and available battery information." },
  { q: "How long can the battery run?", a: "Battery runtime is approximately 3–7 hours, depending on the selected speed and conditions." },
  { q: "How long does charging take?", a: "A full charge takes approximately 4.5 hours." },
  { q: "Which colors are available?", a: "Frezora is available in Blue, White and Black." },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 bg-paper">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        <h2 className="font-display font-semibold text-3xl mb-10 text-center">Questions? We keep it clear.</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="border border-line rounded-2xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between text-left px-5 py-4 font-medium text-sm"
              >
                {f.q}
                <span className="text-ink/40">{openIdx === i ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 overflow-hidden"
                  >
                    <p className="pb-4 text-sm text-ink/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
