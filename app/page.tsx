'use client';

import SnowyBackground from "./snowybg";
import Navbar from "./navbar";
import { useEffect, useRef, useState } from 'react';
import { Pinyon_Script } from 'next/font/google';

const scriptFont = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});

function FeaturesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Wait 1 second then open the envelope
              setTimeout(() => {
                setIsOpen(true);
                // Show cards 500ms after envelope opens
                setTimeout(() => {
                  setShowCards(true);
                }, 500);
              }, 1000);
            }
          });
        },
        { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
      <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center py-20 px-8">
        <h2
            className="text-5xl md:text-6xl font-bold text-center text-[#D23669] mb-16"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Why Choose Clutch?
        </h2>

        <div className="max-w-6xl w-full">
          {/* Envelope + Feature Cards Section */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-16">
            {/* Envelope Container */}
            <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] flex items-center justify-center shrink-0">
              {/* Closed Envelope */}
              <img
                  src="/images/closedenv.png"
                  alt="Closed envelope"
                  className="absolute w-[180%] h-auto object-contain transition-opacity duration-[850ms] ease-in-out"
                  style={{ opacity: isOpen ? 0 : 1, transform: 'rotate(90deg)' }}
              />

              {/* Open Envelope */}
              <img
                  src="/images/openenv.png"
                  alt="Open envelope"
                  className="absolute w-[180%] h-auto object-contain transition-opacity duration-[850ms] ease-in-out"
                  style={{ opacity: isOpen ? 1 : 0, transform: 'rotate(90deg)' }}
              />
            </div>

            {/* Decorative Feature Cards Sliding Out */}
            <div className="flex flex-row gap-8 md:gap-12 items-center">
              {/* Card 1 - Map-Based */}
              <div
                  onMouseEnter={() => setHoveredFeature('map')}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`relative transition-all duration-700 ease-out group ${
                      showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                  style={{ transitionDelay: showCards ? '400ms' : '0ms' }}
              >
                <img
                    src="/images/card.png"
                    alt="Map-Based Interface"
                    className={`w-[220px] h-auto md:w-[260px] object-contain transition-transform duration-300 ease-out cursor-pointer ${
                        hoveredFeature === 'map' ? 'scale-110' : ''
                    }`}
                    style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                />

                {/* Text Overlay on Card */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 ease-out px-10 ${
                    hoveredFeature === 'map' ? 'scale-110' : ''
                }`}>
                  <h3 className="text-[#D23669] text-2xl md:text-3xl font-black text-center mb-2"
                      style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                    Map-Based
                  </h3>
                  <p className="text-[#D23669] text-sm md:text-base text-center leading-tight font-bold"
                     style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 700 }}>
                    Find products nearby in real-time
                  </p>
                </div>
              </div>

              {/* Card 2 - Community */}
              <div
                  onMouseEnter={() => setHoveredFeature('community')}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`relative transition-all duration-700 ease-out group ${
                      showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                  style={{ transitionDelay: showCards ? '500ms' : '0ms' }}
              >
                <img
                    src="/images/card.png"
                    alt="Community Sharing"
                    className={`w-[220px] h-auto md:w-[260px] object-contain transition-transform duration-300 ease-out cursor-pointer ${
                        hoveredFeature === 'community' ? 'scale-110' : ''
                    }`}
                    style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                />

                {/* Text Overlay on Card */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 ease-out px-10 ${
                    hoveredFeature === 'community' ? 'scale-110' : ''
                }`}>
                  <h3 className="text-[#D23669] text-2xl md:text-3xl font-black text-center mb-2"
                      style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                    Community
                  </h3>
                  <p className="text-[#D23669] text-sm md:text-base text-center leading-tight font-bold"
                     style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 700 }}>
                    Give & request through verified students
                  </p>
                </div>
              </div>

              {/* Card 3 - Safe & Secure */}
              <div
                  onMouseEnter={() => setHoveredFeature('security')}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`relative transition-all duration-700 ease-out group ${
                      showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                  style={{ transitionDelay: showCards ? '600ms' : '0ms' }}
              >
                <img
                    src="/images/card.png"
                    alt="Safe & Secure"
                    className={`w-[220px] h-auto md:w-[260px] object-contain transition-transform duration-300 ease-out cursor-pointer ${
                        hoveredFeature === 'security' ? 'scale-110' : ''
                    }`}
                    style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                />

                {/* Text Overlay on Card */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 ease-out px-10 ${
                    hoveredFeature === 'security' ? 'scale-110' : ''
                }`}>
                  <h3 className="text-[#D23669] text-2xl md:text-3xl font-black text-center mb-2"
                      style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                    Safe & Secure
                  </h3>
                  <p className="text-[#D23669] text-sm md:text-base text-center leading-tight font-bold"
                     style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 700 }}>
                    Privacy protected with verified connections
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Large App Mockup at Bottom */}
          <div className="relative border-4 border-[#D23669] rounded-2xl bg-white p-8 overflow-hidden">
            {/* Phone Mockup Container */}
            <div className="bg-[#D23669] rounded-3xl p-4 mx-auto max-w-[400px] shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#D23669]">
                {/* Full App Screen with Zoom Transitions */}
                <div className="bg-gradient-to-b from-pink-50 to-white h-[600px] relative transition-all duration-500 ease-in-out"
                     style={{
                       transform: hoveredFeature === 'map' ? 'scale(1.8) translateY(-25%)' :
                                  hoveredFeature === 'community' ? 'scale(1.5) translateY(5%)' :
                                  hoveredFeature === 'security' ? 'scale(1.8) translateY(35%)' : 'scale(1)',
                       transformOrigin: 'center center'
                     }}>
                  {/* Header - Security Feature */}
                  <div className="p-4 border-b-2 border-[#D23669]/20 bg-white">
                    <h4 className="text-[#D23669] font-bold text-lg" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      Welcome, User
                    </h4>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      Atlanta Campus
                    </p>
                  </div>

                  {/* Give/Request Buttons - Community Feature */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#D23669] text-white text-center py-5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-shadow"
                           style={{ fontFamily: 'var(--font-playfair), serif' }}>
                        🎁 Give
                      </div>
                      <div className="bg-[#D23669] text-white text-center py-5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-shadow"
                           style={{ fontFamily: 'var(--font-playfair), serif' }}>
                        + Request
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gingham rounded-2xl p-4 mb-6 border-2 border-[#D23669]/30">
                      <p className="text-[#D23669] text-sm mb-3 font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                        Recent Activity
                      </p>
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded-xl text-sm text-gray-700 border border-[#D23669]/20"
                             style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                          Requested: Period Products
                        </div>
                        <div className="bg-white p-3 rounded-xl text-sm text-gray-700 border border-[#D23669]/20"
                             style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                          Donated: All Items
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation - Map Feature */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-[#D23669]/20">
                    <div className="grid grid-cols-3 gap-2 p-3">
                      <div className="flex flex-col items-center justify-center py-2 bg-pink-50 rounded-xl border border-[#D23669]/20">
                        <span className="text-xl mb-1">🏠</span>
                        <span className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Home</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 bg-[#D23669] rounded-xl shadow-md">
                        <span className="text-xl mb-1">🗺️</span>
                        <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Map</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 bg-pink-50 rounded-xl border border-[#D23669]/20">
                        <span className="text-xl mb-1">👥</span>
                        <span className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Community</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Text */}
            <p className="text-center text-[#D23669] text-base mt-6 font-semibold" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
              Hover over the cards above to see each feature in action ✨
            </p>
          </div>
        </div>
      </section>
  );
}

export default function Home() {
    return (
        <main className="relative min-h-screen">
            {/* Background Layer */}
            <SnowyBackground />

            {/* Navbar Layer */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
                <div className="relative z-10 bg-gingham w-full pt-12 pb-8 md:pt-16 md:pb-10 px-8 md:px-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Left Side - Icon with Animation */}
                            <div className="shrink-0 flex items-center justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <img
                                    src="/images/typewriter2.png"
                                    alt="Typewriter icon"
                                    className="w-auto h-80 md:h-96 object-contain max-w-full hover:scale-110 transition-transform duration-500 ease-out animate-float"
                                    style={{ background: 'transparent' }}
                                />
                            </div>

                            {/* Right Side - Stacked Text with Staggered Animations */}
                            <div className="flex-1 text-center md:text-left">
                                <div
                                    className="text-[#D23669] leading-[0.9]"
                                    style={{
                                        fontFamily: 'var(--font-playfair), serif',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '0.3s' }}>FEMININE</div>
                                    <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '0.4s' }}>HELP</div>
                                    <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '0.5s' }}>ON YOUR</div>
                                    <div className="text-6xl md:text-7xl lg:text-8xl uppercase animate-fadeInUp" style={{ fontWeight: 700, animationDelay: '0.6s' }}>STANDBY!</div>
                                </div>

                                {/* Subtitle with Animation */}
                                <p className="mt-6 text-lg md:text-xl text-gray-700 animate-fadeInUp" style={{ fontFamily: 'var(--font-cormorant), serif', animationDelay: '0.7s' }}>
                                    A women-focused menstrual product sharing and accessibility app for college campuses.
                                </p>

                                {/* CTA Button with Animation */}
                                <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                                    <button
                                        className="bg-[#D23669] hover:bg-[#B82E5A] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg text-2xl md:text-3xl uppercase animate-pulse-glow"
                                        style={{ fontFamily: 'var(--font-playfair), serif', letterSpacing: '0.1em', fontWeight: 700 }}
                                    >
                                        ACCESS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with Envelope Animation */}
            <FeaturesSection />

            {/* Testimonials Section */}
            <section className="relative py-20 px-8 bg-gingham">
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-5xl md:text-6xl font-bold text-center text-[#D23669] mb-16"
                        style={{ fontFamily: 'var(--font-playfair), serif' }}
                    >
                        What Our Users Say
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#D23669] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    S
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>Sarah M.</h4>
                                    <p className="text-sm text-gray-600">College Student</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem' }}>
                                "Clutch has been a lifesaver! I never worry about being caught unprepared anymore. The community is so supportive!"
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#D23669] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    E
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>Emily K.</h4>
                                    <p className="text-sm text-gray-600">Graduate Student</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem' }}>
                                "The map feature makes it so easy to find help nearby. It's amazing how this app brings our campus community together!"
                            </p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#D23669] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    M
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>Maya P.</h4>
                                    <p className="text-sm text-gray-600">Sophomore</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem' }}>
                                "I love how safe and private this platform is. It's empowering to help others while also having access to help when I need it."
                            </p>
                        </div>

                        {/* Testimonial 4 */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#D23669] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    L
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>Lisa T.</h4>
                                    <p className="text-sm text-gray-600">Junior</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.1rem' }}>
                                "Clutch has completely changed how I navigate emergencies on campus. The community support is incredible!"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer with Email CTA */}
            <footer className="relative py-16 px-8 bg-[#D23669]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: 'var(--font-playfair), serif' }}
                    >
                        Join Our Community
                    </h2>
                    <p className="text-white text-lg md:text-xl mb-8" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                        Get early access and stay updated on our launch!
                    </p>

                    {/* Email Signup Form */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full sm:flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/50"
                            style={{ fontFamily: 'var(--font-cormorant), serif' }}
                        />
                        <button
                            className="w-full sm:w-auto bg-white text-[#D23669] font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            style={{ fontFamily: 'var(--font-playfair), serif', letterSpacing: '0.05em' }}
                        >
                            SUBSCRIBE
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 pt-8 border-t border-white/30">
                        <p className="text-white/80 text-sm" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                            © 2026 Clutch. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}