import SnowyBackground from "./snowybg";
import Navbar from "./navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background Layer */}
      <SnowyBackground />

      {/* Navbar Layer */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Gingham Container - full width, centered vertically */}
        <div className="relative z-10 bg-gingham w-full py-12 md:py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            {/* Catchline - Romantic Font Style, centered */}
            <p 
              className="text-4xl md:text-5xl lg:text-6xl text-[#D23669] font-semibold text-center"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              femin<span className="relative inline-block">
                <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-base md:text-lg">✦</span>
                i
              </span>ne health on standby
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
