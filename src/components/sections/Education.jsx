import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  return (
    <section className="py-20 px-8 max-w-5xl mx-auto" id="education">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 border-b border-indigo-500/30 pb-4 inline-block">Education</h2>
        
        <div className="space-y-8">
          <div className="bg-[rgba(15,20,30,0.6)] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
              <h3 className="text-xl font-semibold text-indigo-300">Madhav Institute of Technology and Science, Gwalior</h3>
              <span className="text-sm text-slate-400 font-mono">2023 – 2027</span>
            </div>
            <p className="text-slate-300">Bachelor of Technology in Information Technology | Specialization in AIML</p>
            <p className="text-indigo-400 mt-2 font-mono">CGPA: 8.5 / 10</p>
          </div>

          <div className="bg-[rgba(15,20,30,0.6)] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
              <h3 className="text-xl font-semibold text-indigo-300">Delhi Public School, Rairu, Gwalior (M.P.)</h3>
              <span className="text-sm text-slate-400 font-mono">2023</span>
            </div>
            <p className="text-slate-300">Central Board of Secondary Education (CBSE)</p>
            <p className="text-indigo-400 mt-2 font-mono">Percentage: 87%</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Education;
