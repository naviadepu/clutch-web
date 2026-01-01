import { Pinyon_Script } from 'next/font/google';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});


export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full p-8 z-50 flex items-center pointer-events-none">
      {/* Star Icon and Clutch - Far Left */}
      <div className="pointer-events-auto absolute -left-4 z-50 flex items-center gap-2">
        <img
          src="/images/star.png"
          alt="Star"
          className="w-28 h-28 hover:opacity-80 transition-opacity cursor-pointer"
        />
        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:opacity-80 transition-opacity cursor-pointer`}>
          Clutch
        </h1>
      </div>

      {/* About and Access - Center-Right */}
      <div className="pointer-events-auto ml-auto mr-4 flex items-center gap-24">
        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:underline decoration-1 hover:opacity-80 transition-all cursor-pointer`}>
          about
        </h1>
        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:underline decoration-1 hover:opacity-80 transition-all cursor-pointer`}>
          access
        </h1>
      </div>
    </nav>
  );
}