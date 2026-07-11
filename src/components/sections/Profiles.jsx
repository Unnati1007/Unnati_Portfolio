import React from 'react';
import { motion } from 'framer-motion';

const Profiles = () => {
  const profiles = [
    { name: "GitHub", url: "https://github.com/Unnati1007", handle: "Unnati1007" },
    { name: "LinkedIn", url: "https://linkedin.com/in/unnati-jadon", handle: "unnati-jadon" },
    { name: "LeetCode", url: "https://leetcode.com/u/Unnati_1705", handle: "Unnati_1705" },
    { name: "Codeforces", url: "https://codeforces.com/profile/unnati_1711", handle: "unnati_1711" },
    { name: "GeeksforGeeks", url: "https://auth.geeksforgeeks.org/user/23it100fyb", handle: "23it100fyb" },
    { name: "HackerRank", url: "https://hackerrank.com/unnatijadon17", handle: "unnatijadon17" },
    { name: "Kaggle", url: "https://kaggle.com/unnatijadon", handle: "unnatijadon" },
  ];

  return (
    <section className="py-20 px-8 max-w-5xl mx-auto" id="profiles">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 border-b border-indigo-500/30 pb-4 inline-block">Coding Profiles</h2>
        
        <div className="flex flex-wrap gap-4">
          {profiles.map((profile, index) => (
            <a 
              key={index} 
              href={profile.url} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 bg-[rgba(15,20,30,0.6)] px-5 py-3 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
            >
              <span className="text-slate-300 font-semibold">{profile.name}</span>
              <span className="text-indigo-400 font-mono text-sm">{profile.handle}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Profiles;
