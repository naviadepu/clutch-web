import { Playfair_Display } from 'next/font/google';

const romanticFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['italic', 'normal'],
});

export default function PrivateAccessButton() {
  return (
    <div className="flex justify-center w-full mb-8">
      {/* Container needs 'group' for hover effects */}
      <button className="group relative flex items-center gap-3 px-8 py-3 rounded-full border border-[#D23669]/20 bg-white/60 backdrop-blur-md shadow-sm hover:border-[#D23669]/50 transition-all duration-300 active:scale-95 overflow-visible">
        
        {/* Animated Status Dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D23669] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D23669]"></span>
        </span>
        
        {/* Romantic Text */}
        <span className={`${romanticFont.className} text-2xl font-normal italic text-[#D23669] tracking-tight`}>
          Private Access
        </span>

        {/* Floating Glitter/Sparkles */}
        {/* These only show on hover using group-hover:opacity-100 */}
        <div className="absolute inset-0 pointer-events-none">
            <span className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all text-[#D23669] text-lg">✦</span>
            <span className="absolute -bottom-3 right-4 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all delay-75 text-[#D23669] text-md">✧</span>
            <span className="absolute top-1 -right-3 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all delay-150 text-[#D23669] text-sm">✦</span>
        </div>

        {/* Arrow Icon */}
        <svg 
          className="w-4 h-4 text-[#D23669] group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}