
import React from 'react';
import { SiteSettings } from '../types';
import { ExternalLink, BookOpen, Heart, ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react';

interface MediaFeedProps {
  settings: SiteSettings;
}

const MediaFeed: React.FC<MediaFeedProps> = ({ settings }) => {
  const centers = [
    {
      no: "7호점",
      title: "다함께돌봄센터 7호점",
      description: "우리 아이들의 꿈이 자라는 공간, 7호점의 활기찬 일상과 유익한 프로그램 정보를 만나보세요.",
      image: settings.blogImage7,
      url: settings.blogUrl7,
      badge: "운영 중"
    },
    {
      no: "3호점",
      title: "다함께돌봄센터 3호점",
      description: "2026년 1월 새롭게 문을 여는 3호점의 준비 과정과 새로운 돌봄 소식을 가장 먼저 전해드립니다.",
      image: settings.blogImage3,
      url: settings.blogUrl3,
      badge: "26년 1월 오픈 예정"
    }
  ];

  return (
    <section className="pt-40 pb-32 bg-white/30 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-purple-900 font-black mb-4">Official Channels</h2>
            <h3 className="text-4xl md:text-6xl font-black text-purple-950 mb-8 tracking-tighter">꿈뜨레 공식 소통 창구</h3>
            <p className="text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
              꿈뜨레가 위탁 운영하는 <span className="text-purple-900 font-bold underline decoration-purple-200 underline-offset-4">다함께돌봄센터</span>의 생생한 교육 현장을 공식 블로그에서 확인하실 수 있습니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {centers.map((center, index) => (
              <div key={index} className="group relative glass overflow-hidden rounded-[3rem] border-purple-100 bg-white shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={center.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={center.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center space-x-3">
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-lg">
                      <Heart className={`w-4 h-4 ${index === 0 ? 'text-red-500 fill-red-500' : 'text-purple-600 fill-purple-600'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none mb-1">Center No.{center.no.replace('호점', '')}</span>
                      <span className="text-white/80 text-[8px] font-bold">{center.badge}</span>
                    </div>
                  </div>
                  {index === 1 && (
                    <div className="absolute top-6 right-6 bg-purple-900 text-white text-[9px] font-black px-4 py-1.5 rounded-full flex items-center shadow-2xl border border-purple-400/30">
                      <Sparkles className="w-3 h-3 mr-2" /> NEW CENTER
                    </div>
                  )}
                </div>

                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center font-black text-green-600 border border-green-100 text-xs">
                      N
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Naver Blog</span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-purple-950 mb-4 leading-tight">
                    {center.title} <br/> 공식 네이버 블로그
                  </h4>
                  
                  <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium flex-1">
                    {center.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href={center.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 bg-purple-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg active:scale-95 text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>블로그 방문</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    
                    <button 
                      onClick={() => alert('네이버 블로그에서 이웃 추가를 하실 수 있습니다.')}
                      className="flex-1 flex items-center justify-center space-x-2 glass border-purple-100 px-6 py-4 rounded-2xl font-black text-purple-950 hover:bg-purple-50 transition-all text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>이웃 추가</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Icons Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="glass p-8 rounded-[2.5rem] border-purple-50 bg-white/40 flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <div className="w-8 h-8 rounded-lg border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div>
                  <h5 className="font-black text-purple-900 text-sm">인스타그램</h5>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">@kkumttre_community</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-300 group-hover:text-purple-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            
            <div className="glass p-8 rounded-[2.5rem] border-purple-50 bg-white/40 flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-black shadow-lg">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h5 className="font-black text-purple-900 text-sm">카카오톡 채널</h5>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">실시간 1:1 채팅 문의</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-300 group-hover:text-purple-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaFeed;
