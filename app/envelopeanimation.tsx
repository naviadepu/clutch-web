'use client';

import { useEffect, useRef, useState } from 'react';

export default function EnvelopeAnimation() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Wait 1 second then open the envelope
            setTimeout(() => {
              setIsOpen(true);
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
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24">
      <div
        className="ml-2 md:ml-4 mt-24 md:mt-32 relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] flex items-center justify-center"
      >
        {/* Closed Envelope */}
        <img
          src="/images/closedenv.png"
          alt="Closed envelope"
          className="absolute w-full h-full object-contain transition-opacity duration-[850ms] ease-in-out"
          style={{ opacity: isOpen ? 0 : 1, transform: 'rotate(90deg)' }}
        />

        {/* Open Envelope */}
        <img
          src="/images/openenv.png"
          alt="Open envelope"
          className="absolute w-full h-full object-contain transition-opacity duration-[850ms] ease-in-out"
          style={{ opacity: isOpen ? 1 : 0, transform: 'rotate(90deg)' }}
        />
      </div>
    </section>
  );
}
