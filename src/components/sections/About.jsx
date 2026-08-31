import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const name = "UNNATI JADON";
  
  // Animation containers & children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const letterVariants = {
    hover: {
      y: -8,
      scale: 1.15,
      color: "#4f46e5",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="pt-12 pb-6 px-8 max-w-5xl mx-auto text-center" id="about">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Name with character-by-character interactive hover effect */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight select-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900"
        >
          {name.split("").map((char, index) => (
            <motion.span
              key={index}
              className="inline-block cursor-default"
              variants={letterVariants}
              whileHover="hover"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Elegant growing divider line */}
        <motion.div
          variants={lineVariants}
          className="h-[2px] w-24 bg-gradient-to-r from-slate-300 via-indigo-500 to-slate-300 mx-auto my-6 rounded-full origin-center"
        />

        {/* Subtitle / Badges */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl font-medium tracking-wide mb-8 flex flex-wrap justify-center items-center gap-2 md:gap-3 text-slate-600"
        >
          <span className="px-3 py-1 bg-indigo-50/60 text-indigo-800 rounded-full border border-indigo-100/80 text-sm font-semibold shadow-sm hover:scale-105 hover:bg-indigo-100/50 transition-all duration-200">
            Final-Year IT Student
          </span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="px-3 py-1 bg-indigo-50/60 text-indigo-800 rounded-full border border-indigo-100/80 text-sm font-semibold shadow-sm hover:scale-105 hover:bg-indigo-100/50 transition-all duration-200">
            8.5 CGPA
          </span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="px-3 py-1 bg-indigo-50/60 text-indigo-800 rounded-full border border-indigo-100/80 text-sm font-semibold shadow-sm hover:scale-105 hover:bg-indigo-100/50 transition-all duration-200">
            AI/ML & Full-Stack Developer
          </span>
        </motion.p>

        {/* Persuasive copy designed to impress recruiters */}
        <motion.p 
          variants={itemVariants}
          className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed font-light tracking-wide"
        >
          An aspiring Software Engineer specializing in the convergence of <span className="font-semibold text-slate-700">machine learning models</span> and modern <span className="font-semibold text-slate-700">Full-Stack engineering</span>. I architect responsive, high-performance web applications and design intelligent systems to build end-to-end user-centric solutions.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;

