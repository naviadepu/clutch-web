import SnowyBackground from "./snowybg";
import Navbar from "./navbar";
import EnvelopeAnimation from "./envelopeanimation";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background Layer */}
      <SnowyBackground />

      {/* Navbar Layer */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Gingham Container - full width */}
        <div className="relative z-10 bg-gingham w-full pt-12 pb-8 md:pt-16 md:pb-10 px-8 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Left Side - Icon */}
              <div className="shrink-0 flex items-center justify-center">
                <img
                  src="/images/typewriter2.png"
                  alt="Typewriter icon"
                  className="w-auto h-80 md:h-96 object-contain max-w-full"
                  style={{ background: 'transparent' }}
                />
              </div>

              {/* Right Side - Stacked Text */}
              <div className="flex-1 text-center md:text-left">
                <div
                  className="text-[#D23669] leading-[0.9]"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '0ms' }}>FEMININE</div>
                  <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '150ms' }}>HELP</div>
                  <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '300ms' }}>ON YOUR</div>
                  <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '450ms' }}>STANDBY!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Envelope Animation Section */}
      <EnvelopeAnimation />
    </main>
  );
}
