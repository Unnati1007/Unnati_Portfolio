import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
  const projects = [
    {
      title: "IntelliChoice: AI for Decision Making",
      tech: "React.js, FastAPI, LangChain, RAG, FAISS, Redis",
      links: [
        { label: "GitHub", url: "#" }
      ],
      description: "Developed an AI-based decision support system integrating RAG with FAISS for accurate, evidence-backed outputs. Implemented a multi-layer Guard Pipeline and multi-turn conversational flow to generate structured recommendations with reasoning. Optimized performance using Redis caching and embedding models."
    },
    {
      title: "Lingofy: Music-Integrated Language Learning Platform",
      tech: "React, TypeScript, Express, MongoDB",
      links: [
        { label: "Live Demo", url: "#" },
        { label: "GitHub", url: "#" }
      ],
      description: "Developed a music-driven language learning platform featuring real-time pronunciation feedback, gamified roadmap progression, and detailed performance analytics tracking. Designed an HCI experiment framework comparing Music vs Traditional learning modes via an analytics dashboard."
    }
  ];

  return (
    <section className="py-20 px-8 max-w-5xl mx-auto" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 border-b border-indigo-500/30 pb-4 inline-block">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-[rgba(15,20,30,0.6)] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-indigo-400 font-mono text-sm mb-4">{project.tech}</p>
              <p className="text-slate-300 text-sm leading-relaxed flex-grow mb-6">{project.description}</p>
              
              <div className="flex gap-4 mt-auto">
                {project.links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-indigo-400 border border-slate-700 hover:border-indigo-400 px-4 py-2 rounded-full transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
