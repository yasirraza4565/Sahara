import React, { useState, useEffect } from 'react';

const slides = [
    // FIX: Change paths from './images/...' to '/images/...'
    '/images/Slide1.jpg', 
    '/images/Slide2.jpg',
    '/images/Slide3.jpg',
    // '/images/Slide4.jpg',
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => 
            (prevIndex + 1 ) % slides.length
            );
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return ( 
        <div className='slider-container'>
            <img 
            src={slides[currentIndex]} // This now pulls the correct absolute URL
            alt={`Promotional slide ${currentIndex + 1 }`} 
            className='slider-image'
            />
        </div>
    );
};

export default ImageSlider;