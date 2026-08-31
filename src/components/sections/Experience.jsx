import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TimelineItem = ({ exp, index }) => {
  const itemRef = useRef(null);
  
  // Track scroll progress of this specific item relative to the viewport
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end center"]
  });

  // 3D & Parallax transforms: fades in, slides up, scales, and tilts into place
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <motion.div 
      ref={itemRef}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        y,
        rotateX,
        opacity,
        scale
      }}
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-12"
    >
      {/* Rotating Blueprint/Tech Gear Node */}
      <motion.div 
        whileHover="hover"
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]"
      >
        {/* Clean, high-end concentric ripple rings */}
        <motion.span 
          variants={{
            hover: {
              scale: [1, 1.8],
              opacity: [0.5, 0],
              transition: { repeat: Infinity, duration: 1.5, ease: "easeOut" }
            }
          }}
          className="absolute inset-0 rounded-full border border-indigo-400 pointer-events-none"
        />
        <motion.span 
          variants={{
            hover: {
              scale: [1, 1.8],
              opacity: [0.5, 0],
              transition: { repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeOut" }
            }
          }}
          className="absolute inset-0 rounded-full border border-indigo-400 pointer-events-none"
        />

        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-5 h-5 fill-none transition-all duration-500 ease-out"
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
        </motion.svg>
      </motion.div>
      
      {/* Experience Card Box with top border slide-reveal animation */}
      <div className="relative w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[rgba(15,20,30,0.6)] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-sm">
        {/* Micro-interactive laser beam line at top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="flex flex-col mb-2">
          <h3 className="text-xl font-bold text-white">{exp.company}</h3>
          <span className="text-indigo-400 font-medium">{exp.role}</span>
          <span className="text-sm text-slate-500 font-mono mt-1">{exp.date}</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
      </div>
    </motion.div>
  );
};

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
    <section className="py-8 px-8 max-w-5xl mx-auto" id="experience">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <span className="text-indigo-600 font-mono text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 02. Professional History
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Experience
            <span className="absolute -bottom-1.5 left-0 w-12 h-0.5 bg-indigo-500 rounded-full"></span>
          </h2>
        </div>
        
        <div className="space-y-4 relative">
          {/* Bold Glowing Laser Timeline Line */}
          <div className="absolute top-0 bottom-0 left-5 md:left-1/2 -translate-x-1/2 w-[4px] bg-slate-200/80 rounded-full overflow-hidden">
            <motion.div
              animate={{
                y: ["-160px", "900px"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-indigo-600 to-transparent shadow-[0_0_12px_#4f46e5]"
            />
          </div>

          {experiences.map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
