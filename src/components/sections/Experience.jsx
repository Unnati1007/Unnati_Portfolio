import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const TimelineItem = React.memo(({ exp, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 15,
        mass: 0.8,
        duration: 0.8
      }}
      className="relative flex items-start md:items-center justify-between md:justify-normal md:odd:flex-row-reverse gap-3 sm:gap-4 md:gap-0 group is-active mb-6 sm:mb-10"
    >
      {/* Rotating Blueprint/Tech Gear Node */}
      <div 
        className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-600 group-hover:text-blue-600 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] mt-1 md:mt-0"
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 fill-none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="m20 16-4-4 4-4" />
          <path d="m4 8 4 4-4 4" />
          <path d="m16 20-4-4-4 4" />
          <path d="m8 4 4 4 4-4" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      </div>
      
      {/* Experience Card Box with top border slide-reveal animation */}
      <div className="relative w-[calc(100%-2.75rem)] sm:w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-sm">
        {/* Micro-interactive laser beam line at top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-400 to-sky-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="flex flex-col mb-2">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">{exp.company}</h3>
          <span className="text-xs sm:text-sm md:text-base text-blue-600 font-semibold">{exp.role}</span>
          <span className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 sm:mt-1">{exp.date}</span>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{exp.description}</p>
      </div>
    </motion.div>
  );
});

const Experience = () => {
  const experiences = [
    {
      company: "DRDO",
      role: "Project Intern: DRDE, Gwalior (M.P.)",
      date: "May 2025 – July 2025",
      description: "Developed a Machine Learning Driven QSAR Regression Model and Docking GUI for Virtual Screening, involving data preprocessing, feature generation, and model integration within a GUI. Utilized Python, RDKit, Scikit-learn, AutoDock Vina, and Open Babel, and contributed to incorporating molecular docking workflows for drug discovery."
    },
    {
      company: "Ethara AI",
      role: "Post Training and LLM Intern",
      date: "Dec 2025 – Jan 2026",
      description: "Applied Reinforcement Learning from Human Feedback (RLHF) and Supervised Fine-Tuning (SFT) to optimize LLM performance. Built and improved data annotation and evaluation pipelines for better model alignment using Python, PyTorch, and Pandas, ensuring data quality throughout."
    },
    {
      company: "Praedico Global Research Pvt. Ltd.",
      role: "Full-Stack Developer Intern",
      date: "April 2026 – July 2026",
      description: "Contributed in a full-stack trading intelligence platform using React, Next.js, Node.js, Express, and MongoDB, featuring real-time dashboards with Socket.io and secure REST APIs with JWT authentication. Developed a responsive UI using Tailwind CSS and Framer Motion, along with robust data validation."
    }
  ];

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-8 max-w-5xl mx-auto" id="experience">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-6 sm:mb-8">
          <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 02. Professional History
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Experience
            <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
          </h2>
        </div>
        
        <div className="space-y-2 sm:space-y-4 relative">
          {/* Solid, Continuous Blue Timeline Line */}
          <div className="absolute top-4 bottom-4 left-4 sm:left-5 md:left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-blue-400 via-blue-500 to-blue-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.25)]" />

          {experiences.map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Experience);
