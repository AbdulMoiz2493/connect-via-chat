import { useState, useEffect, useRef } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    stats: false,
    mission: false,
    cards: false
  });

  const sections = useRef({
    hero: null,
    stats: null,
    mission: null,
    cards: null
  });

  // Scroll animation observer
  useEffect(() => {
    const observers = [];
    
    Object.entries(sections.current).forEach(([key, ref]) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setIsVisible(prev => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.2 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Parallax movement on mouse move
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={el => sections.current.hero = el}
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 mb-6">
              About Us
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold leading-tight text-gray-800 mb-6">
                  We create digital experiences that delight and inspire
                </h2>
                <p className="text-lg leading-relaxed text-gray-600 mb-8">
                  Our mission is to make exceptional design accessible to everyone. We combine cutting-edge technology with timeless design principles to create products that stand out in today's crowded digital landscape.
                </p>
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-300/30 transform hover:-translate-y-1">
                  Get to know us
                </button>
              </div>
              
              <div className="relative">
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500"
                  style={{ 
                    transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                  }}
                >
                  <img
                    src="https://i.ibb.co/RjNH7QB/Rectangle-122-1.png"
                    alt="Design team collaborating"
                    className="w-full object-cover"
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        ref={el => sections.current.stats = el}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {[
              { icon: "🏆", title: "Founded 2015", description: "Starting from a small studio to an award-winning digital agency in just a few years." },
              { icon: "✨", title: "50M+ Monthly Views", description: "Our clients' products reach millions of people every month, driving engagement and growth." },
              { icon: "👥", title: "400K+ Happy Users", description: "We've helped build products that users love and recommend to their friends." }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{stat.title}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section 
        ref={el => sections.current.mission = el}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible.mission ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 inline-block relative">
                Our Mission
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-indigo-500"></span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that great design should be accessible to everyone. Our mission is to democratize design by creating beautiful, functional, and user-friendly digital experiences that solve real problems.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Through thoughtful research, innovative thinking, and meticulous execution, we strive to push the boundaries of what's possible in digital design while maintaining a deep commitment to user needs and business goals.
              </p>
              <p className="text-lg text-gray-600">
                Each project we undertake is an opportunity to create something meaningful that positively impacts people's lives, whether it's making everyday tasks easier or bringing joy through delightful interactions.
              </p>
            </div>
            
            <div className="relative">
              <div 
                className="w-full h-80 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 transform rotate-3 absolute top-6 -right-6"
                style={{ 
                  transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px) rotate(3deg)`,
                }}
              ></div>
              <div 
                className="w-full h-80 rounded-2xl bg-indigo-600 absolute -top-6 left-6"
                style={{ 
                  transform: `translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.1}px)`,
                }}
              ></div>
              <div 
                className="relative z-10 bg-white p-8 rounded-2xl shadow-xl"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Core Values</h3>
                <ul className="space-y-4">
                  {["User-centered design", "Innovative thinking", "Attention to detail", "Continuous improvement"].map((value, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                      </span>
                      <span className="text-gray-700">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Cards */}
      <section 
        ref={el => sections.current.cards = el}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible.cards ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {[
              { 
                icon: "👥", 
                title: "Our Team", 
                description: "A diverse group of passionate designers, developers, and strategists working together to create exceptional digital experiences." 
              },
              { 
                icon: "🤝", 
                title: "Leadership", 
                description: "Experienced leaders with a vision for innovation and a commitment to fostering a culture of creativity and excellence." 
              },
              { 
                icon: "📣", 
                title: "Press", 
                description: "Featured in leading industry publications for our innovative approach to design and technology integration." 
              }
            ].map((card, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors duration-300">
                    <span className="text-3xl group-hover:text-white transition-colors duration-300">{card.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                  <svg className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}