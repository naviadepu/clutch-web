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
          
          {/* GINGHAM BACKGROUND - EXTENDS FROM LEFT */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-1/2 z-0">
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

          {/* TEXT CONTENT */}
          <div className="relative z-10 max-w-7xl mx-auto px-12 w-full">
            <div className="flex flex-col items-end text-right">
              {/* STACKED TEXT LIKE PINTEREST REFERENCE */}
              <h2 className={`${sexyFont.className} text-[#D23669] leading-[0.9] tracking-tight font-bold`}>
                <span className="text-5xl md:text-7xl block uppercase">
                  FEMININE
                </span>
                <span className="text-5xl md:text-7xl block uppercase">
                  HELP ON
                </span>
                {/* STANDBY with heart looping the Y */}
                <span className="text-5xl md:text-7xl block uppercase relative inline-block">
                  STANDB
                  <span className="relative inline-block">
                    Y
                    {/* Heart that loops around the Y */}
                    <svg 
                      className="absolute -top-3 -right-6 md:-top-4 md:-right-8 w-16 h-16 md:w-20 md:h-20" 
                      viewBox="0 0 100 100" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 50,30 C 30,10 0,20 0,45 C 0,70 50,90 50,90 C 50,90 100,70 100,45 C 100,20 70,10 50,30 Z"
                        fill="none"
                        stroke="#D23669"
                        strokeWidth="2.5"
                        opacity="0.7"
                      />
                    </svg>
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}