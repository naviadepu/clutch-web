'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AccessPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <main className="min-h-screen bg-gingham flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="max-w-[90vw] sm:max-w-md w-full">
                <Link
                    href="/"
                    className="inline-block mb-6 sm:mb-8 text-[#D23669] hover:underline text-sm"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                    &larr; Back to home
                </Link>

                <div
                    className="relative bg-[#FFB3D9] p-0.5 md:p-1"
                    style={{
                        boxShadow: `
                            0 0 0 1px #D23669,
                            0 0 0 2px #FFB3D9,
                            0 0 0 3px #D23669,
                            2px 2px 0 3px rgba(210, 54, 105, 0.3)
                        `,
                        imageRendering: 'pixelated'
                    }}
                >
                    {/* Window Header */}
                    <div className="bg-[#FFD6EC] border-b-2 border-[#D23669] px-2 sm:px-3 py-1.5 flex items-center justify-between">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-[#D23669]"></div>
                            <div className="w-1.5 h-1.5 bg-[#D23669]"></div>
                            <div className="w-1.5 h-1.5 bg-[#D23669]"></div>
                        </div>
                        <span
                            className="text-[#D23669] text-[10px] sm:text-xs font-bold"
                            style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
                        >
                            early access
                        </span>
                        <div className="flex gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                            <span>♥</span>
                            <span>★</span>
                            <span>♥</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-[#FFEAF5] p-5 sm:p-8">
                        <h1
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D23669] text-center mb-2 sm:mb-3"
                            style={{ fontFamily: 'var(--font-playfair), serif' }}
                        >
                            Get Early Access
                        </h1>
                        <p
                            className="text-gray-700 text-center mb-5 sm:mb-8 text-sm sm:text-base"
                            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: undefined }}
                        >
                            Enter your email to be the first to know when Clutch launches.
                        </p>

                        {status === 'success' ? (
                            <div className="text-center py-4">
                                <span className="text-4xl mb-3 block">♥</span>
                                <p
                                    className="text-[#D23669] font-bold text-lg sm:text-xl"
                                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                                >
                                    Thanks for signing up! Please be in the lookout for our upcoming newsletters
                                </p>
                                <p
                                    className="text-gray-600 mt-2 text-sm sm:text-base"
                                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                                >
                                    You&apos;re officially part of the Clutch fam. We&apos;ll let you know as soon as we launch!
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-[#D23669] rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D23669]/50 text-sm sm:text-base"
                                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-[#D23669] text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-[#b82d5a] transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
                                >
                                    {status === 'loading' ? 'submitting...' : 'sign me up'}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-500 text-center text-sm">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Pixel Corners */}
                    <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D23669]"></div>
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D23669]"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D23669]"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D23669]"></div>
                </div>
            </div>
        </main>
    );
}
