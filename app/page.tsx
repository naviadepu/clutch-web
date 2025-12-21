import Image from "next/image";
import SnowyBackground from "./snowybg";
import Navbar from "./navbar";
import { Bodoni_Moda } from 'next/font/google';

// Standardizing to Bodoni Moda for that "sexy" editorial look
const sexyFont = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['700'],
  style: ['italic', 'normal'],
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 1. Background Layer */}
      <SnowyBackground />

      {/* 2. Navbar Layer */}
      <Navbar />

      {/* 3. Main Content Layer */}
      <div className="relative z-10 pt-32">
        
        {/* --- MAIN CONTENT SECTION --- */}
        <section className="relative w-full min-h-[600px] flex items-center overflow-hidden py-20">
          
          {/* HIGHLIGHT: PAINTED BRUSH STROKE GINGHAM (SVG) */}
          <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="brush">
                  <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
                </filter>
                
                <pattern id="paintedGingham" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <rect width="120" height="120" fill="#ffffff" />
                  <rect x="40" y="0" width="45" height="120" fill="#FFECF2" filter="url(#brush)" opacity="0.9" />
                  <rect x="0" y="40" width="120" height="45" fill="#FFECF2" filter="url(#brush)" opacity="0.9" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#paintedGingham)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-12 w-full">
            
            {/* HIGHLIGHT: UPDATED TEXT SECTION WITH INDENTATION */}
            <div className="flex flex-col items-start text-left">
              <h2 className={`${sexyFont.className} text-[#D23669] leading-[0.8] tracking-tighter uppercase`}>
                
                <span className="text-6xl md:text-8xl block">
                  Feminine
                </span>
                
                <span className="block ml-16 md:ml-44 italic lowercase text-5xl md:text-7xl py-4">
                  help on
                </span>
                
                <span className="text-6xl md:text-8xl block">
                  Standby!
                </span>
              </h2>
              
              <div className="mt-8 ml-4 text-[#D23669] text-3xl opacity-60 animate-pulse">
                ♡
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}