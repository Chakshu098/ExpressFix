import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const brands = [
  { name: 'Adobe', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=60&fit=crop&crop=center' },
  { name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=120&h=60&fit=crop&crop=center' },
  { name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&h=60&fit=crop&crop=center' },
  { name: 'Apple', logo: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=120&h=60&fit=crop&crop=center' },
  { name: 'Meta', logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=60&fit=crop&crop=center' },
  { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&h=60&fit=crop&crop=center' },
  { name: 'Spotify', logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=120&h=60&fit=crop&crop=center' },
  { name: 'Tesla', logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=120&h=60&fit=crop&crop=center' }
];

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 60 + 20,
  left: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 4
}));

export default function Landing() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);

  const handleGetStarted = () => {
    setShowIntro(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full bg-white/10 animate-bubble"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`
              }}
            />
          ))}
        </div>

        {/* Intro Content */}
        <div className="text-center z-10">
          <div className="mb-8">
            <img 
              src="/ExpressFix (2).svg" 
              alt="ExpressFix Logo" 
              className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-2xl animate-pulse"
            />
            <h1 className="text-6xl font-bold text-white mb-4">
              ExpressFix
            </h1>
            <div className="flex items-center justify-center gap-3 text-white/90 text-xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>Features by Adobe</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          
          <div className="text-white/80 text-lg animate-bounce">
            Initializing AI-Powered Tools...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center gap-3">
          <img 
            src="/ExpressFix (2).svg" 
            alt="ExpressFix Logo" 
            className="w-12 h-12 rounded-2xl shadow-lg"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            ExpressFix
          </span>
        </div>
        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Get Started <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-bold mb-8 leading-tight gradient-text transition-all duration-1000 ease-in-out hover:scale-105">
            Create with Us
          </h1>
          
          <p className="text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-in-out hover:text-gray-600">
            Your Vision, Our Design. Creative Solutions, Beautifully Delivered. Transforming Ideas into Design.
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap mb-16">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-16 py-8 text-2xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Start Creating Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-12 py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              Watch demo
            </Button>
          </div>

          {/* Trusted Brands Section with Company Logos */}
          <div className="mb-8">
            <p className="text-gray-600 mb-8 text-lg">Trusted by teams at</p>
            <div className="relative overflow-hidden">
              <div className="brand-scroll whitespace-nowrap flex items-center gap-12">
                {[...brands, ...brands].map((brand, index) => (
                  <img
                    key={index}
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 w-auto object-contain inline-block"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
