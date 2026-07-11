import React from 'react';
import { motion } from 'framer-motion';

const Resume = () => {
  return (
    <section className="py-20 px-8 max-w-5xl mx-auto" id="resume">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-1 rounded-3xl"
      >
        <div className="bg-[rgba(15,20,30,0.8)] p-10 rounded-[22px] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Resume</h2>
            <p className="text-slate-400">View or download my full resume to see a detailed breakdown of my experience and skills.</p>
          </div>
          <button className="shrink-0 bg-white hover:bg-slate-200 text-black px-8 py-4 rounded-xl font-extrabold flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Resume
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Resume;
