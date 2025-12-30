"use client";
import React, { useState } from 'react';

export default function Envelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div 
        className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={handleClick}
      >
        {/* Envelope */}
        <div className="relative">
          {/* Envelope body - cream/off-white, horizontal orientation */}
          <div 
            className="relative w-80 h-48 bg-[#F5F1E8] rounded shadow-lg"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
            }}
          >
            {/* Envelope flap */}
            <div 
              className={`absolute top-0 left-0 w-full h-4/5 bg-[#F5F1E8] origin-top transition-transform duration-700 ${
                isOpen ? 'rotate-[-180deg]' : 'rotate-0'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 0)',
                transformStyle: 'preserve-3d',
                borderRadius: '4px 4px 0 0',
              }}
            >
              {/* Wax seal on flap - centered horizontally, positioned on the triangular flap */}
              <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                {/* Wax seal with organic texture */}
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full bg-[#D23669] shadow-lg" 
                    style={{
                      boxShadow: '0 2px 8px rgba(210, 54, 105, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Wax texture with subtle imperfections */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D23669] via-[#C92A5E] to-[#B81D5A] opacity-90"></div>
                    <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-[#E84A7A] opacity-60"></div>
                    <div className="absolute bottom-2 right-1 w-1.5 h-1.5 rounded-full bg-[#B81D5A] opacity-50"></div>
                  </div>
                  {/* Elegant cursive "C" initial */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-3xl font-serif font-bold" 
                      style={{ 
                        fontFamily: 'serif',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-1px)',
                      }}>
                      C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Letter inside (appears when opened) */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                isOpen ? 'opacity-100 delay-300' : 'opacity-0'
              }`}
            >
              <div className="w-72 h-40 bg-white rounded shadow-inner p-6 flex items-center justify-center">
                <div className="text-center text-[#D23669] font-serif text-base">
                  Join the waitlist
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form appears when envelope is opened */}
      {isOpen && (
        <div className="mt-8 w-full max-w-md animate-fadeIn">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-[#D23669] focus:outline-none focus:ring-2 focus:ring-[#D23669] text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-[#D23669] text-white py-3 rounded-lg font-semibold hover:bg-[#B81D5A] transition-colors"
              >
                Join Waitlist
              </button>
            </form>
          ) : (
            <div className="text-center text-[#D23669] font-semibold">
              Thank you! We'll be in touch soon. ✨
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <p className="mt-4 text-gray-600 text-sm">Click the envelope to join our waitlist</p>
      )}
    </div>
  );
}

