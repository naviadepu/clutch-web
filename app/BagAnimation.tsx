import React, { useState, useEffect } from 'react';

const BagAnimation = ({ className = "", speed = 150 }) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    const frames = [
        '/images/bag-animation/Frame-1.png',
        '/images/bag-animation/Frame-3.png',
        '/images/bag-animation/Frame-4.png',
        '/images/bag-animation/Frame-5.png',
        '/images/bag-animation/Frame-6.png',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % frames.length);
        }, speed);

        return () => clearInterval(interval);
    }, [speed, frames.length]);

    return (
        <div className={`relative ${className}`}>
            <img
                src={frames[currentFrame]}
                alt="Animated bag with items"
                className="w-full h-full object-contain"
                style={{
                    imageRendering: 'crisp-edges',
                    background: 'transparent'
                }}
            />
        </div>
    );
};

export default BagAnimation;