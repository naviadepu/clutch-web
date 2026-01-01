'use client';

import { useState } from 'react';

export default function EnvelopeAnimation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="relative min-h-screen flex items-center py-24">
      <div
        className="ml-8 md:ml-16 relative cursor-pointer"
        onClick={handleClick}
      >
        {/* Closed Envelope */}
        <img
          src="/images/closedenv.png"
          alt="Closed envelope"
          className="w-80 md:w-96 h-auto object-contain transition-opacity duration-500"
          style={{ opacity: isOpen ? 0 : 1 }}
        />

        {/* Open Envelope */}
        <img
          src="/images/openenv.png"
          alt="Open envelope"
          className="w-80 md:w-96 h-auto object-contain absolute top-0 left-0 transition-opacity duration-500"
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      </div>
    </section>
  );
}
