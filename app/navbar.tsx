'use client';

import { Pinyon_Script } from 'next/font/google';
import { useState } from 'react';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full pt-12 pb-8 px-8 z-50 flex items-center pointer-events-none">
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
                  onClick={() => setMenuOpen(false)}
                >
                  about
                </button>
                <button
                  className={`${scriptFont.className} w-full text-left px-6 py-3 text-3xl text-[#D23669] hover:bg-pink-50 transition-colors`}
                  onClick={() => setMenuOpen(false)}
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
    </nav>
  );
}