'use client';

import { Pinyon_Script } from 'next/font/google';
import { useState, useEffect } from 'react';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full pt-12 pb-8 px-8 z-50 flex items-center pointer-events-none transition-all duration-300 ${hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      {/* Star Icon (Menu Toggle) and Clutch - Far Left */}
      <div className="pointer-events-auto absolute -left-4 z-50 flex items-center gap-2">
        <div className="relative">
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

        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:opacity-80 transition-opacity cursor-pointer`}>
          Clutch
        </h1>
      </div>

      {/* Newsletter — retro pixel button (top right) */}
      <a
        href="https://clutch-newsletter.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-white border-2 border-[#D23669] px-3 py-2 sm:px-4 sm:py-2.5 text-[#D23669] text-[8px] sm:text-[10px] uppercase tracking-wide hover:bg-[#FFEAF5] active:translate-x-[1px] active:translate-y-[1px] transition-colors duration-100"
        style={{
          fontFamily: 'var(--font-press-start), monospace',
          boxShadow: '2px 2px 0 #D23669',
          imageRendering: 'pixelated',
        }}
      >
        newsletter
      </a>
    </nav>
  );
}
