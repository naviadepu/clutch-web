import { Pinyon_Script } from 'next/font/google';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});


export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full p-8 z-50 flex items-center justify-between pointer-events-none">
      {/* Branding - Far Left */}
      <div className="pointer-events-auto">
        <h1 className={`${scriptFont.className} text-6xl text-[#D23669] hover:opacity-80 transition-opacity cursor-pointer`}>
          Clutch
        </h1>
      </div>

      {/* Navigation - Far Right (Optional) */}
      <div className="pointer-events-auto hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-[#4A4A4A]">
        <a href="#features" className="hover:underline underline-offset-4">Features</a>
        <a href="#mission" className="hover:underline underline-offset-4">Mission</a>
      </div>
    </nav>
  );
}