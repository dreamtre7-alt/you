
import React from 'react';
import { SiteSettings } from '../types';
import { Sparkles, ArrowRight, Heart, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  settings: SiteSettings;
}

const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.heroImage} 
          alt="Pastoral Landscape" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/90" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <span className="inline-block text-white/90 text-sm font-medium tracking-[0.3em] uppercase mb-6 drop-shadow-md">
            공동체와 혁신
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] font-serif tracking-tight whitespace-nowrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-200">
              {settings.siteName}
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-white/95 font-medium tracking-wide mb-12 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] font-serif italic">
            {settings.slogan}
          </p>
        </motion.div>
      </div>

      {/* Bottom Gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;
