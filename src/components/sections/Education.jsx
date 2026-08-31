import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  return (
    <section className="py-6 sm:py-8 px-4 sm:px-8 max-w-5xl mx-auto" id="education">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-6 sm:mb-8">
          <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 01. Academic Pathway
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Education
            <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
          </h2>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600">Madhav Institute of Technology and Science, Gwalior</h3>
              <span className="text-xs sm:text-sm text-slate-500 font-mono shrink-0">2023 – 2027</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Bachelor of Technology in Information Technology | Specialization in AIML</p>
            <p className="text-blue-600 mt-2 font-mono text-xs sm:text-sm font-bold">CGPA: 8.5 / 10</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600">Delhi Public School, Rairu, Gwalior (M.P.)</h3>
              <span className="text-xs sm:text-sm text-slate-500 font-mono shrink-0">2023</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Class XII (Senior Secondary) | Central Board of Secondary Education (CBSE)</p>
            <p className="text-blue-600 mt-2 font-mono text-xs sm:text-sm font-bold">Percentage: 87%</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600">Delhi Public School, Rairu, Gwalior (M.P.)</h3>
              <span className="text-xs sm:text-sm text-slate-500 font-mono shrink-0">2021</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">Class X (Secondary) | Central Board of Secondary Education (CBSE)</p>
            <p className="text-blue-600 mt-2 font-mono text-xs sm:text-sm font-bold">Percentage: 97%</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Education);
