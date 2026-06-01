import React from 'react';

interface ToyArtProps {
  type: 'elephant' | 'train' | 'dino' | 'rainbow' | 'user' | 'physics' | 'chemistry' | 'jumbokit';
  className?: string;
}

export const ToyArt: React.FC<ToyArtProps> = ({ type, className = 'w-16 h-16' }) => {
  if (type === 'physics') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#e0f2fe] dark:bg-sky-950/40 border-4 border-sky-100 dark:border-sky-900/60 flex flex-col items-center justify-center p-3 text-center shadow-inner ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] select-none">
          {/* Background glow circle */}
          <circle cx="50" cy="50" r="35" fill="#bae6fd" opacity="0.4" />
          
          {/* Magnet */}
          <path d="M 32,58 A 18,18 0 0,1 68,58" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
          <path d="M 32,58 A 18,18 0 0,1 50,42" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="square" />
          
          {/* Magnet Poles accents */}
          <rect x="27" y="56" width="10" height="4" fill="#ffffff" />
          <rect x="63" y="56" width="10" height="4" fill="#ffffff" />

          {/* Compass / Nucleus / Orbit */}
          <ellipse cx="50" cy="36" rx="20" ry="8" fill="none" stroke="#0369a1" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-15 50 36)" />
          <ellipse cx="50" cy="36" rx="8" ry="20" fill="none" stroke="#0369a1" strokeWidth="2" strokeDasharray="3 3" transform="rotate(45 50 36)" />
          
          {/* Glowing Protons in Center */}
          <circle cx="50" cy="36" r="5" fill="#f59e0b" className="animate-pulse" />
          <circle cx="47" cy="34" r="3" fill="#10b981" />
          <circle cx="53" cy="38" r="3" fill="#ef4444" />
        </svg>
        <div className="text-[6px] tracking-widest font-bold uppercase text-sky-800 dark:text-sky-300 font-display mt-0.5">POCKET PHYSICS</div>
        <div className="text-[4px] tracking-wider font-semibold text-amber-600 dark:text-amber-400 block leading-none">LAB SERIES</div>
      </div>
    );
  }

  if (type === 'chemistry') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#eef2ff] dark:bg-indigo-950/40 border-4 border-indigo-100 dark:border-indigo-900/60 flex flex-col items-center justify-center p-3 text-center shadow-inner ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] select-none">
          {/* Background glow */}
          <circle cx="50" cy="50" r="35" fill="#c7d2fe" opacity="0.4" />
          
          {/* Boiling Bubbles */}
          <circle cx="44" cy="22" r="2.5" fill="#818cf8" opacity="0.8" />
          <circle cx="56" cy="18" r="4" fill="#6366f1" opacity="0.6" />
          <circle cx="50" cy="30" r="2" fill="#4f46e5" opacity="0.9" />
          <circle cx="38" cy="35" r="3.5" fill="#4f46e5" opacity="0.5" />

          {/* Erlenmeyer Flask */}
          <path d="M 45,28 L 55,28 L 55,42 L 72,70 A 4,4 0 0,1 68,76 L 32,76 A 4,4 0 0,1 28,70 L 45,42 Z" fill="none" stroke="#312e81" strokeWidth="4.5" strokeLinejoin="round" />
          
          {/* Flask Lips */}
          <line x1="42" y1="28" x2="58" y2="28" stroke="#312e81" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="42" y1="26" x2="58" y2="26" stroke="#312e81" strokeWidth="3" strokeLinecap="round" />

          {/* Glowing Chemicals inside */}
          <path d="M 32,68 L 68,68 A 4,4 0 0,1 68,74 L 32,74 A 4,4 0 0,1 32,68 Z" fill="#4f46e5" opacity="0.85" />
          <path d="M 35,62 Q 50,56 65,62 L 68,68 L 32,68 Z" fill="#818cf8" opacity="0.7" />
          
          {/* Interactive sparks */}
          <circle cx="42" cy="71" r="1.5" fill="#ffffff" />
          <circle cx="54" cy="67" r="2" fill="#ffffff" />
          <circle cx="58" cy="70" r="1" fill="#ffffff" />
        </svg>
        <div className="text-[6px] tracking-widest font-bold uppercase text-indigo-800 dark:text-indigo-300 font-display mt-0.5">POCKET CHEMISTRY</div>
        <div className="text-[4px] tracking-wider font-semibold text-rose-500 dark:text-rose-400 block leading-none">REACTION KIT</div>
      </div>
    );
  }

  if (type === 'jumbokit') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#faf5ff] dark:bg-purple-950/40 border-4 border-purple-100 dark:border-purple-900/60 flex flex-col items-center justify-center p-3 text-center shadow-inner ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] select-none">
          {/* Purple Glow */}
          <circle cx="50" cy="50" r="35" fill="#e9d5ff" opacity="0.4" />
          
          {/* Science flask 1 */}
          <path d="M 35,42 L 42,42 L 42,52 L 52,68 A 2.5,2.5 0 0,1 50,72 L 24,72 A 2.5,2.5 0 0,1 22,68 L 35,52 Z" fill="#c084fc" opacity="0.6" stroke="#581c87" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Test tube 2 */}
          <rect x="58" y="32" width="10" height="34" rx="5" fill="#f472b6" opacity="0.75" stroke="#581c87" strokeWidth="3" />
          
          {/* Bubbles */}
          <circle cx="63" cy="24" r="2" fill="#ec4899" />
          <circle cx="66" cy="18" r="3.5" fill="#d946ef" opacity="0.5" />
          <circle cx="44" cy="34" r="1.5" fill="#a855f7" />

          {/* Atom Rings encircling */}
          <ellipse cx="48" cy="48" rx="28" ry="12" fill="none" stroke="#a21caf" strokeWidth="2.5" transform="rotate(-30 48 48)" />
          <circle cx="24" cy="34" r="3" fill="#eab308" />
          <circle cx="72" cy="62" r="3" fill="#06b6d4" />
        </svg>
        <div className="text-[6px] tracking-widest font-bold uppercase text-purple-800 dark:text-purple-300 font-display mt-0.5">JUMBO LAB</div>
        <div className="text-[4px] tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 block leading-none">COMBO EDITION</div>
      </div>
    );
  }

  if (type === 'elephant') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#fffefc] border-4 border-slate-100 flex flex-col items-center justify-center p-3 text-center shadow-inner ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] select-none">
          {/* Background circle and accents */}
          <circle cx="50" cy="46" r="32" fill="#fff5db" />
          
          {/* Elephant Ears */}
          <ellipse cx="26" cy="42" rx="14" ry="14" fill="#aee2f9" />
          <ellipse cx="26" cy="42" rx="9" ry="9" fill="#fbb0c9" />
          
          <ellipse cx="74" cy="42" rx="14" ry="14" fill="#aee2f9" />
          <ellipse cx="74" cy="42" rx="9" ry="9" fill="#fbb0c9" />
          
          {/* Elephant Body */}
          <circle cx="50" cy="54" r="18" fill="#aee2f9" />
          {/* White belly patch */}
          <ellipse cx="50" cy="56" rx="10" ry="12" fill="#e9f7ff" />
          
          {/* Elephant Head */}
          <circle cx="50" cy="42" r="16" fill="#aee2f9" />
          
          {/* Eyes */}
          <circle cx="44" cy="40" r="2.5" fill="#1e293b" />
          <circle cx="43" cy="39" r="0.8" fill="#ffffff" />
          <circle cx="56" cy="40" r="2.5" fill="#1e293b" />
          <circle cx="55" cy="39" r="0.8" fill="#ffffff" />
          
          {/* Cheeks */}
          <circle cx="39" cy="44" r="2" fill="#f48fb1" opacity="0.6" />
          <circle cx="61" cy="44" r="2" fill="#f48fb1" opacity="0.6" />
          
          {/* Trunk */}
          <path d="M 50,44 Q 50,54 53,52 Q 55,50 54,48" fill="none" stroke="#aee2f9" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Feet */}
          <ellipse cx="40" cy="68" rx="5" ry="4" fill="#84c9ea" />
          <ellipse cx="60" cy="68" rx="5" ry="4" fill="#84c9ea" />
          
          {/* Hands */}
          <ellipse cx="33" cy="52" rx="4" ry="4" fill="#84c9ea" />
          <ellipse cx="67" cy="52" rx="4" ry="4" fill="#84c9ea" />
        </svg>
        <div fill="#0f172a" className="text-[6px] tracking-widest font-bold uppercase text-[#0c6780] font-display mt-0.5">TOYCO STUDIO</div>
        <div fill="#64748b" className="text-[4px] tracking-wider font-semibold text-amber-600 block leading-none">PLAYFUL CREATIONS</div>
      </div>
    );
  }

  if (type === 'train') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#f6f5f4] flex items-center justify-center p-3 text-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] select-none">
          <circle cx="50" cy="50" r="40" fill="#eae8e7" />
          
          {/* Train tracks */}
          <line x1="20" y1="72" x2="80" y2="72" stroke="#6f787d" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="72" x2="30" y2="78" stroke="#6f787d" strokeWidth="2" />
          <line x1="50" y1="72" x2="50" y2="78" stroke="#6f787d" strokeWidth="2" />
          <line x1="70" y1="72" x2="70" y2="78" stroke="#6f787d" strokeWidth="2" />
          
          {/* Locomotive body */}
          <rect x="25" y="44" width="20" height="22" rx="2" fill="#a43c12" />
          <rect x="45" y="48" width="28" height="18" fill="#0c6780" />
          
          {/* Cab Roof */}
          <path d="M 22,44 L 48,44 L 44,40 L 26,40 Z" fill="#475569" />
          
          {/* Cabin Window */}
          <rect x="29" y="48" width="12" height="10" rx="1" fill="#ffffff" opacity="0.9" />
          
          {/* Train boiler & front nose */}
          <path d="M 73,48 L 77,52 L 77,62 L 73,66 Z" fill="#fe7e4f" />
          
          {/* Smoke stack */}
          <rect x="64" y="38" width="5" height="10" fill="#475569" />
          <path d="M 61,38 L 72,38 L 69,35 L 64,35 Z" fill="#1b1c1c" />
          
          {/* Wheels */}
          <circle cx="34" cy="68" r="6" fill="#1b1c1c" />
          <circle cx="34" cy="68" r="2" fill="#ffffff" />
          <circle cx="52" cy="68" r="6" fill="#1b1c1c" />
          <circle cx="52" cy="68" r="2" fill="#ffffff" />
          <circle cx="68" cy="68" r="6" fill="#1b1c1c" />
          <circle cx="68" cy="68" r="2" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (type === 'dino') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#fef5f0] flex items-center justify-center p-3 text-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] select-none">
          <circle cx="50" cy="50" r="40" fill="#ffece0" />
          
          {/* Dino Body */}
          <path d="M 30,65 Q 40,75 55,70 Q 70,65 72,50 Q 74,35 60,35 Q 50,35 48,22 Q 46,10 32,15 Q 18,20 22,35 Q 24,45 28,55 Z" fill="#865219" />
          
          {/* Dino Spikes */}
          <polygon points="46,12 40,6 38,13" fill="#fe7e4f" />
          <polygon points="30,14 24,10 24,16" fill="#fe7e4f" />
          <polygon points="20,24 14,22 17,28" fill="#fe7e4f" />
          <polygon points="21,40 15,41 18,46" fill="#fe7e4f" />
          
          {/* Eye */}
          <circle cx="58" cy="24" r="2.5" fill="#1b1c1c" />
          <circle cx="57" cy="23" r="0.8" fill="#ffffff" />
          
          {/* Cheek */}
          <circle cx="62" cy="28" r="1.5" fill="#ba1a1a" opacity="0.5" />
          
          {/* Mouth */}
          <path d="M 52,28 Q 55,30 58,28" fill="none" stroke="#1b1c1c" strokeWidth="1.5" />
          
          {/* Belly */}
          <path d="M 42,42 Q 52,50 48,64 Q 38,62 38,50 Z" fill="#ffdcbf" />
          
          {/* Bouncing handle (it's a bumper toy!) */}
          <path d="M 46,12 Q 44,4 52,6 Q 56,12 50,15" fill="none" stroke="#6f787d" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'rainbow') {
    return (
      <div className={`aspect-square rounded-2xl bg-[#e3f7ff] flex items-center justify-center p-3 text-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] select-none">
          <circle cx="50" cy="50" r="40" fill="#ccf0ff" />
          
          {/* Rainbow Arches */}
          {/* Outer red arch */}
          <path d="M 20,70 A 30,30 0 0,1 80,70" fill="none" stroke="#a43c12" strokeWidth="8" strokeLinecap="round" />
          
          {/* Middle yellow arch */}
          <path d="M 28,70 A 22,22 0 0,1 72,70" fill="none" stroke="#fbb674" strokeWidth="8" strokeLinecap="round" />
          
          {/* Inner blue arch */}
          <path d="M 36,70 A 14,14 0 0,1 64,70" fill="none" stroke="#0c6780" strokeWidth="8" strokeLinecap="round" />
          
          {/* Smallest pink arch */}
          <path d="M 44,70 A 6,6 0 0,1 56,70" fill="none" stroke="#fe7e4f" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // default profile avatar
  return (
    <div className={`relative rounded-full overflow-hidden border-2 border-[#ffffd5] shadow-sm ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-300 bg-slate-100">
        <rect width="100" height="100" fill="#ffdbcf" />
        <circle cx="50" cy="38" r="18" fill="#a43c12" />
        <path d="M 20,82 Q 20,54 50,54 Q 80,54 80,82 Z" fill="#0c6780" />
        {/* Childish features */}
        <circle cx="50" cy="38" r="14" fill="#ffd4c5" />
        {/* Smile */}
        <path d="M 46,42 Q 50,45 54,42" fill="none" stroke="#1b1c1c" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="45" cy="36" r="1.8" fill="#1b1c1c" />
        <circle cx="55" cy="36" r="1.8" fill="#1b1c1c" />
        {/* Cute hair blush */}
        <path d="M 33,32 Q 50,20 67,32" fill="none" stroke="#865219" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
