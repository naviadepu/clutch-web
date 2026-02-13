'use client';

import { Pinyon_Script } from 'next/font/google';
import { useState } from 'react';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showName, setShowName] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full pt-4 sm:pt-12 pb-4 sm:pb-8 px-4 sm:px-8 z-50 flex items-center pointer-events-none">
      {/* Star Icon (Menu Toggle) and Clutch - Far Left */}
      <div className="pointer-events-auto absolute -left-2 sm:-left-4 z-50 flex items-center gap-1 sm:gap-2">
        <div
          className="relative"
          onMouseEnter={() => setShowName(true)}
          onMouseLeave={() => setShowName(false)}
          onTouchStart={() => setShowName(true)}
          onTouchEnd={() => setTimeout(() => setShowName(false), 1500)}
        >
          <img
            src="/images/star.png"
            alt="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-28 h-28 hover:opacity-80 transition-opacity cursor-pointer"
          />

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border-4 border-[#D23669] rounded-lg shadow-xl min-w-[200px] overflow-hidden">
              <div className="bg-[#FFD6EC] px-4 py-2 border-b-2 border-[#D23669]">
                <span className={`${scriptFont.className} text-2xl text-[#D23669]`}>menu</span>
              </div>
              <div className="py-2">
                <button
                  className={`${scriptFont.className} w-full text-left px-6 py-3 text-3xl text-[#D23669] hover:bg-pink-50 transition-colors`}
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  about
                </button>
                <button
                  className={`${scriptFont.className} w-full text-left px-6 py-3 text-3xl text-[#D23669] hover:bg-pink-50 transition-colors`}
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  access
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop only: always visible (1024px+) */}
        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:opacity-80 transition-opacity cursor-pointer hidden lg:block`}>
          Clutch
        </h1>
        {/* Mobile/tablet: only visible on star hover/tap (below 1024px) */}
        <h1
          className={`${scriptFont.className} text-6xl text-[#D23669] transition-all duration-300 cursor-pointer lg:hidden ${
            showName ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          Clutch
        </h1>
      </div>
    </nav>
  );
}
