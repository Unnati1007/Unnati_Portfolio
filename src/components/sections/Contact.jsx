import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section className="py-8 px-8 max-w-5xl mx-auto text-center" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[rgba(15,20,30,0.6)] p-12 rounded-3xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        
        <h2 className="text-4xl font-bold mb-6 text-white relative z-10">Get In Touch</h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto relative z-10">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
          <a 
            href="mailto:unnatijadon1007@gmail.com" 
            className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Email Me
          </a>
          <a 
            href="tel:+917224929865" 
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-colors border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            +91-7224929865
          </a>
        </div>
      </motion.div>
      <div className="mt-20 text-slate-500 text-sm font-mono">
        <p>Built by Unnati Jadon</p>
      </div>
    </section>
  );
};

export default Contact;
