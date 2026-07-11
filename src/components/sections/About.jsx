import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="py-20 px-8 max-w-5xl mx-auto text-center" id="about">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
          UNNATI JADON
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 font-light mb-8">
          Third-Year IT Student | 8.5 CGPA | AI/ML Enthusiast & Full-Stack Developer
        </p>
        <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
          Passionate about building impactful software, training machine learning models, and solving complex algorithmic challenges. Always exploring the intersection of full-stack web development and artificial intelligence.
        </p>
      </motion.div>
    </section>
  );
};

export default About;
