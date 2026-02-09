
import React from 'react';
import { SiteSettings } from '../types';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
}

const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center space-x-3 bg-white/40 px-6 py-2.5 rounded-full border border-white/60 text-[10px] md:text-xs text-purple-900 font-black mb-12 uppercase tracking-[0.3em] backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>창원시 비영리 민간단체</span>
          <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
          <span>공동체 혁신 프로젝트</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black mb-12 leading-[0.9] tracking-tighter text-[#111111] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <span className="block mb-4 drop-shadow-sm">{settings.siteName}</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-900 to-black pb-4 drop-shadow-sm">
            {settings.slogan}
          </span>
        </h1>

        <p className="max-w-4xl mx-auto text-xl md:text-3xl text-gray-700/80 mb-20 font-medium leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          창원의 내일을 밝히는 깊고 선명한 빛처럼, <br className="hidden md:block"/>
          우리는 이웃을 연결하여 더 <span className="text-purple-900 font-black italic">빛나는</span> 지역사회를 디자인합니다.
        </p>
      </div>
      
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-30 flex flex-col items-center animate-bounce duration-[3s]">
        <span className="text-[10px] uppercase tracking-[0.8em] mb-6 font-black text-black">SCROLL</span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-purple-900 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
