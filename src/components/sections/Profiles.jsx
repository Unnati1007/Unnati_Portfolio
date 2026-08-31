import React from 'react';
import { motion } from 'framer-motion';

const Profiles = () => {
  const profiles = [
    { 
      name: "GitHub", 
      url: "https://github.com/Unnati1007", 
      handle: "Unnati1007",
      color: "#181717",
      glowColor: "rgba(24, 23, 23, 0.25)",
      icon: (
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      url: "https://linkedin.com/in/unnati-jadon", 
      handle: "unnati-jadon",
      color: "#0A66C2",
      glowColor: "rgba(10, 102, 194, 0.35)",
      icon: (
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    { 
      name: "LeetCode", 
      url: "https://leetcode.com/u/Unnati_1705", 
      handle: "Unnati_1705",
      color: "#FFA116",
      glowColor: "rgba(255, 161, 22, 0.35)",
      icon: (
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
        </svg>
      )
    },
    { 
      name: "Codeforces", 
      url: "https://codeforces.com/profile/unnati_1711", 
      handle: "unnati_1711",
      color: "#1F8ACB",
      glowColor: "rgba(31, 138, 203, 0.35)",
      icon: (
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"/>
        </svg>
      )
    },
    { 
      name: "GeeksforGeeks", 
      url: "https://auth.geeksforgeeks.org/user/23it100fyb", 
      handle: "23it100fyb",
      color: "#2F8D46",
      glowColor: "rgba(47, 141, 70, 0.35)",
      icon: (
        <img 
          src="https://img.icons8.com/?size=100&id=AbQBhN9v62Ob&format=png&color=2F8D46" 
          alt="GeeksforGeeks" 
          loading="lazy"
          decoding="async"
          className="w-8 h-8 object-contain" 
        />
      )
    },
    { 
      name: "HackerRank", 
      url: "https://hackerrank.com/unnatijadon17", 
      handle: "unnatijadon17",
      color: "#2EC866",
      glowColor: "rgba(46, 200, 102, 0.35)",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24">
          {/* Green Hexagon Background */}
          <path 
            d="M11.5 2.3L3.8 6.8a1.5 1.5 0 00-.8 1.3v9c0 .5.3 1 .7 1.2l7.7 4.5a1.5 1.5 0 001.5 0l7.7-4.5c.4-.2.7-.7.7-1.2v-9a1.5 1.5 0 00-.8-1.3l-7.7-4.5a1.5 1.5 0 00-1.4 0z" 
            fill="#2EC866" 
          />
          {/* White H with Arrows */}
          <path 
            d="M10 5.5L7 8.5h2v9a1 1 0 001 1h0a1 1 0 001-1v-9h2l-3-3z M13 6.5a1 1 0 011-1h0a1 1 0 011 1v9h2l-3 3-3-3h2v-9z M10 11.5h4v1.5h-4z" 
            fill="#FFFFFF" 
          />
        </svg>
      )
    },
    { 
      name: "Kaggle", 
      url: "https://kaggle.com/unnatijadon", 
      handle: "unnatijadon",
      color: "#20BEFF",
      glowColor: "rgba(32, 190, 255, 0.35)",
      icon: (
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M18.825 21.85h-3.3l-5.61-7.92-2.145 2.062v5.858H4.8v-19.7h2.97v10.956l7.359-7.106h3.696l-7.722 7.425z"/>
        </svg>
      )
    },
  ];

  // Motion variants for stagger container
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  // Helper to return entry motion variants (alternating top/bottom wave entrance)
  const getCircleVariants = (index) => {
    const isEven = index % 2 === 0;
    return {
      hidden: { 
        opacity: 0, 
        y: isEven ? 35 : -35 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 14,
          duration: 0.7
        }
      }
    };
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-8 max-w-5xl mx-auto" id="profiles">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-85px" }}
        variants={containerVariants}
      >
        <div className="mb-6 sm:mb-8">
          <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 03. Digital Presence
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Coding Profiles
            <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
          </h2>
        </div>
        
        {/* Responsive Staggered Alternating Grid */}
        <div className="flex flex-wrap justify-center items-center gap-x-3.5 sm:gap-x-6 md:gap-x-8 gap-y-5 sm:gap-y-6 md:gap-y-10 py-2 min-h-[140px]">
          {profiles.map((profile, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.a 
                key={index} 
                href={profile.url} 
                target="_blank" 
                rel="noreferrer"
                variants={getCircleVariants(index)}
                aria-label={`Visit ${profile.name} profile`}
                // Apply a translation offset on medium screens to achieve the permanent visual zig-zag/wave layout
                className={`group flex flex-col items-center transition-all duration-300 ${
                  isEven ? 'md:translate-y-3.5' : 'md:-translate-y-3.5'
                }`}
              >
                {/* Brand Circle Node */}
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center relative cursor-pointer shadow-sm transition-all duration-300 select-none [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8 [&>img]:w-6 [&>img]:h-6 sm:[&>img]:w-7 sm:[&>img]:h-7 md:[&>img]:w-8 md:[&>img]:h-8"
                  style={{ 
                    color: profile.color 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 15px 30px ${profile.glowColor}`;
                    e.currentTarget.style.borderColor = profile.color;
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  {profile.icon}

                  {/* Username Tooltip */}
                  <div 
                    className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white font-bold text-[10px] sm:text-xs font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-2xl border border-slate-700/80 flex items-center gap-1"
                  >
                    <span className="text-blue-400 font-bold">@</span>
                    <span className="text-white font-bold tracking-wide">{profile.handle}</span>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] sm:border-[6px] border-transparent border-t-[#0f172a]" />
                  </div>
                </div>

                {/* Sub-label under circle */}
                <div className="text-center mt-1.5 sm:mt-2 select-none">
                  <span className="block text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {profile.name}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Profiles);
