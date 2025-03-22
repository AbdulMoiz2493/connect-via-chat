import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [count, setCount] = useState(3);

  // Countdown effect for button with redirect
  useEffect(() => {
    let timer;
    if (isHovering && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (count === 0) {
      // Redirect to home page when count reaches 0
      timer = setTimeout(() => navigate("/"), 300);
    }
    
    if (!isHovering && count !== 3) {
      setCount(3);
    }
    
    return () => clearTimeout(timer);
  }, [isHovering, count, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden">
      <div className="relative z-10 text-center px-6 py-16 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
        {/* Static 404 number */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-extrabold opacity-20 select-none absolute -top-16 left-1/2 -translate-x-1/2">
            404
          </h1>
          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
            404
          </h1>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
          Oops! This Page Doesn't Exist
        </h2>
        
        <p className="text-lg text-white/70 mb-10 max-w-md mx-auto">
          The page you're looking for might have been moved, deleted, or never existed in the first place.
        </p>
        
        <button 
          className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="relative z-10">
            {isHovering && count > 0 ? `Redirecting in ${count}...` : "Return to Home"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
        </button>
      </div>
      
      {/* Background elements with static positioning */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}