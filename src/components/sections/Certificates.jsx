import React from 'react';
import { motion } from 'framer-motion';

const Certificates = () => {
  const achievements = [
    "IIITM Infotsav Grand Finalist 2025",
    "GSSoC Open Source Contributor 2026 (Top 500)",
    "500+ DSA problems solved",
    "Max Contest Rating: 1458 (LeetCode)",
    "Infosys Springboard Intern '26",
    "Technical Team Member, Google Developer Groups on Campus MITS",
    "Core Member, GeeksforGeeks",
    "VP, AI Club and DIY & Innovation Club MITS",
    "NCC Cadet (B & C Certificate)",
    "DSA Certifications (GeeksforGeeks, Udemy)",
    "HackerRank Python & Problem Solving 5 Stars"
  ];

  return (
    <section className="py-8 px-8 max-w-5xl mx-auto" id="achievements">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <span className="text-indigo-600 font-mono text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 05. Recognition & Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Achievements & Leadership
            <span className="absolute -bottom-1.5 left-0 w-12 h-0.5 bg-indigo-500 rounded-full"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-[rgba(15,20,30,0.6)] p-4 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
              <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Certificates;
