import React from 'react';
import { motion } from 'framer-motion';

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
    <section className="py-20 px-8 max-w-5xl mx-auto" id="experience">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 border-b border-indigo-500/30 pb-4 inline-block">Experience</h2>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/50 before:to-transparent">
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                <svg className="w-5 h-5 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[rgba(15,20,30,0.6)] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex flex-col mb-2">
                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                  <span className="text-indigo-400 font-medium">{exp.role}</span>
                  <span className="text-sm text-slate-500 font-mono mt-1">{exp.date}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
