'use client';

import { useEffect, useRef, useState } from 'react';
import { Pinyon_Script } from 'next/font/google';
const scriptFont = Pinyon_Script({
    weight: '400',
    subsets: ['latin'],
});
export default function EnvelopeAnimation() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCards, setShowCards] = useState(false);
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
        <section ref={sectionRef} className="relative min-h-screen flex items-start justify-center py-12 px-8">
            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 max-w-full w-full justify-center">
                {/* Envelope Container */}
                <div className="ml-0 md:-ml-20 mt-0 md:mt-4 relative w-[250px] h-[250px] md:w-[450px] md:h-[450px] flex items-center justify-center shrink-0">
                    {/* Closed Envelope */}
                    <img
                        src="/images/closedenv.png"
                        alt="Closed envelope"
                        className="absolute w-[200%] h-auto object-contain transition-opacity duration-[850ms] ease-in-out"
                        style={{ opacity: isOpen ? 0 : 1, transform: 'rotate(90deg)' }}
                    />

                    {/* Open Envelope */}
                    <img
                        src="/images/openenv.png"
                        alt="Open envelope"
                        className="absolute w-[200%] h-auto object-contain transition-opacity duration-[850ms] ease-in-out"
                        style={{ opacity: isOpen ? 1 : 0, transform: 'rotate(90deg)' }}
                    />
                </div>

                {/* Cards Display */}
                <div className="flex flex-row gap-12 md:gap-16 items-center">
                    {/* Card 1 */}
                    <div
                        className={`relative transition-all duration-700 ease-out group ${
                            showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                        }`}
                        style={{ transitionDelay: showCards ? '400ms' : '0ms' }}
                    >
                        <img
                            src="/images/card.png"
                            alt="Card 1"
                            className="w-[900px] h-auto md:w-[1200px] lg:w-[1600px] object-contain group-hover:scale-110 transition-transform duration-300 ease-out cursor-pointer"
                            style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                        />

                        {/* Text Overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-out"
                        >
                            <p
                                className={`${scriptFont.className} text-[#D23669] text-xl md:text-3xl lg:text-4xl font-bold text-center`}
                            >
                                Your Text Here
                            </p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div
                        className={`relative transition-all duration-700 ease-out group ${
                            showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                        }`}
                        style={{ transitionDelay: showCards ? '400ms' : '0ms' }}
                    >
                        <img
                            src="/images/card.png"
                            alt="Card 2"
                            className="w-[900px] h-auto md:w-[1200px] lg:w-[1600px] object-contain group-hover:scale-110 transition-transform duration-300 ease-out cursor-pointer"
                            style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                        />

                        {/* Text Overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-out"
                        >
                            <p
                                className={`${scriptFont.className} text-[#D23669] text-xl md:text-3xl lg:text-4xl font-bold text-center`}
                            >
                                Your Text Here
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div
                        className={`relative transition-all duration-700 ease-out group ${
                            showCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                        }`}
                        style={{ transitionDelay: showCards ? '400ms' : '0ms' }}
                    >
                        <img
                            src="/images/card.png"
                            alt="Card 3"
                            className="w-[900px] h-auto md:w-[1200px] lg:w-[1600px] object-contain group-hover:scale-110 transition-transform duration-300 ease-out cursor-pointer"
                            style={{ background: 'transparent', transform: 'rotate(270deg)' }}
                        />

                        {/* Text Overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-out"
                        >
                            <p
                                className={`${scriptFont.className} text-[#D23669] text-xl md:text-3xl lg:text-4xl font-bold text-center`}
                            >
                                Your Text Here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}