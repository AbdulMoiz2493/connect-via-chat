import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateMovement = (factor = 0.02) => {
    const x = (mousePosition.x - window.innerWidth / 2) * factor;
    const y = (mousePosition.y - window.innerHeight / 2) * factor;
    return { x, y };
  };
  
  const movement = calculateMovement();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FCF8F1] to-white overflow-hidden">
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute top-10 left-10 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30 transition-all duration-700"
            style={{ transform: `translate(${-movement.x * 2}px, ${-movement.y * 2}px)` }}></div>
        <div className="animate-pulse absolute bottom-10 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 transition-all duration-700"
            style={{ transform: `translate(${movement.x * 2}px, ${movement.y * 2}px)` }}></div>
        <div className="animate-pulse absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 transition-all duration-700"
            style={{ transform: `translate(${-movement.x * 1.5}px, ${-movement.y * 1.5}px)` }}></div>
      </div>

      <section className="relative py-20 lg:py-32">
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Content Section with staggered animations */}
            <div className={`space-y-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="space-y-6">
                <p className="inline-block text-base font-semibold text-blue-600 uppercase 
                             px-4 py-1 rounded-full transform hover:scale-105 transition-transform">
                  A Platform to Connect with friends
                </p>
                
                <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl xl:text-7xl
                             transition-all duration-300 hover:text-blue-800">
                  Connect &amp; learn 
                  <span className="block text-yellow-400 mt-3">from others</span>
                </h1>
                
                <p className="text-lg text-gray-600 sm:text-xl max-w-lg
                             animate-fade-in-up">
                  Grow your career fast with the right mentor. Share ideas, get feedback, and build meaningful relationships.
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link
                  to="/chat"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-black
                            bg-yellow-300 rounded-full transition-all duration-300
                            hover:bg-yellow-400 hover:shadow-xl hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  <span className="relative z-10">Start Chat Now</span>
                  <svg
                    className="w-6 h-6 ml-4 transition-transform duration-300 group-hover:translate-x-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  
                  {/* Enhanced glow effect */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-0 
                                group-hover:opacity-40 blur-md transition-all duration-300"></div>
                </Link>

                
              </div>

              {/* Login Link with improved styling */}
              <p className="text-gray-600 flex items-center gap-2">
                Already joined us?{" "}
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 font-semibold transition-all duration-300 
                           hover:text-blue-800 group"
                >
                  <span className="border-b-2 border-transparent group-hover:border-blue-600">Log in</span>
                  <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </p>
            </div>

            {/* Right Image Section with parallax effect */}
            <div className={`relative group transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                 style={{ transform: `translate(${movement.x * 0.5}px, ${movement.y * 0.5}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-3xl transform rotate-3 
                           transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"></div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-70 blur-sm
                           transition-all duration-500 group-hover:scale-110"></div>
                           
              <img
                className="relative w-full rounded-2xl transform transition-all duration-500
                         group-hover:scale-[1.02] z-10"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
                alt="Platform illustration"
              />
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;