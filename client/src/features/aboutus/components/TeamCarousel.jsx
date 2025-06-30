import React, { useState, useEffect, useRef } from 'react';
import DeveloperCard from './DeveloperCard';

const TeamCarousel = ({ developers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // Auto-play configuration
  const AUTO_PLAY_INTERVAL = 3000; // 5 seconds

  // Handle auto-play
  useEffect(() => {
    const startAutoPlay = () => {
      if (developers.length <= 1) return;
      
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % developers.length);
      }, AUTO_PLAY_INTERVAL);
    };

    const stopAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return stopAutoPlay;
  }, [isAutoPlaying, developers.length]);

  // Navigation functions
  const goToSlide = (index) => {
    if (index < 0) {
      index = developers.length - 1;
    } else if (index >= developers.length) {
      index = 0;
    }
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), AUTO_PLAY_INTERVAL * 2);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* Minimal Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="Previous team member"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="Next team member"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-2xl w-full px-8">
      
          
          {/* Single Card Display */}
          <div className="relative h-[70vh]">
            {developers.map((dev, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <DeveloperCard 
                  {...dev} 
                  isActive={index === currentIndex}
                />
              </div>
            ))}
          </div>

          {/* Minimal Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {developers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCarousel;