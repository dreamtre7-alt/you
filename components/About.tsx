
import React from 'react';
import { SiteSettings } from '../types';
import { Target, Heart, History, Quote, Calendar } from 'lucide-react';

interface AboutProps {
  settings: SiteSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  // 연혁 문자열을 배열로 변환하여 타임라인 구성
  const historyLines = settings.history.split('\n').filter(line => line.trim() !== '');

  return (
    <section className="pt-40 pb-24 bg-white/40 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-28">
          <h2 className="text-xs uppercase tracking-[0.4em] text-purple-800 font-black mb-5">Organization Intro</h2>
          <h3 className="text-4xl md:text-6xl font-black mb-10 text-[#111111]">"함께 심고 가꾸는 공동체의 뜰"</h3>
          <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed">
            {settings.siteName}은 창원을 기반으로 활동하며 <span className="text-purple-800 font-black">지역사회의 자생력</span>을 키우기 위해 모인 사람들의 네트워크입니다.
          </p>
        </div>

        {/* Representative Greeting Section - Photo Removed */}
        <div id="greeting" className="mb-36 scroll-mt-40">
          <div className="glass rounded-[3.5rem] p-10 md:p-24 relative overflow-hidden border-purple-100/50 shadow-2xl bg-white/60">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-10">
                <Quote className="w-16 h-16 text-purple-900/10" />
              </div>
              <h4 className="text-4xl font-black mb-12 text-[#111111] text-center">대표 인사말</h4>
              <div className="text-gray-800 text-lg md:text-xl leading-relaxed mb-16 font-medium whitespace-pre-wrap text-center md:text-left">
                {settings.representativeGreeting}
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="border-l-4 border-purple-900 pl-6 py-2">
                  <p className="text-[#111111] font-black text-3xl">{settings.representativeName}</p>
                  <p className="text-purple-800/60 text-xs uppercase tracking-[0.2em] font-black mt-2">{settings.siteName} 대표</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-10 mb-36">
          <div className="p-12 glass rounded-[2.5rem] border-purple-100/50 hover:border-purple-400 transition-all group bg-white shadow-sm hover:shadow-2xl">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl">
              <Target className="text-white w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black mb-5 text-[#111111]">비전 (Vision)</h4>
            <p className="text-gray-700 leading-relaxed font-medium text-lg">{settings.vision}</p>
          </div>

          <div className="p-12 glass rounded-[2.5rem] border-purple-100/50 hover:border-purple-400 transition-all group bg-white shadow-sm hover:shadow-2xl">
            <div className="w-16 h-16 bg-purple-900 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl">
              <Heart className="text-white w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black mb-5 text-purple-900">미션 (Mission)</h4>
            <p className="text-gray-700 leading-relaxed font-medium text-lg">{settings.mission}</p>
          </div>
        </div>

        {/* History Section (Timeline) */}
        <div id="history" className="scroll-mt-40">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6 bg-purple-50 px-6 py-2 rounded-full border border-purple-100">
              <History className="w-5 h-5 text-purple-900" />
              <span className="text-sm font-black text-purple-900 uppercase tracking-widest">Our Journey</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-[#111111]">꿈뜨레 단체 연혁</h3>
          </div>

          <div className="max-w-4xl mx-auto relative px-4">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-purple-900 to-purple-200 transform md:-translate-x-1/2 opacity-30"></div>

            <div className="space-y-12">
              {historyLines.map((line, index) => {
                const isEven = index % 2 === 0;
                const firstSpaceIndex = line.indexOf(' ');
                const datePart = firstSpaceIndex !== -1 ? line.substring(0, firstSpaceIndex) : line;
                const contentPart = firstSpaceIndex !== -1 ? line.substring(firstSpaceIndex + 1) : '';

                return (
                  <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white border-4 border-purple-900 rounded-full transform md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(91,33,182,0.3)]"></div>
                    
                    <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                      <div className="glass p-8 rounded-[2rem] border-purple-50 bg-white/80 hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className={`flex items-center space-x-3 mb-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-900 font-black text-sm tracking-tight">{datePart}</span>
                        </div>
                        <p className="text-gray-800 font-bold text-lg leading-snug group-hover:text-purple-900 transition-colors">
                          {contentPart}
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
