
import React from 'react';
import { SiteSettings } from '../types';
import { Instagram, Facebook, MessageCircle, ExternalLink, BookOpen } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const externalLinks = [
    { name: '국세청', url: 'https://www.nts.go.kr' },
    { name: '창원시청', url: 'https://www.changwon.go.kr' },
    { name: '국민권익위원회', url: 'https://www.acrc.go.kr' }
  ];

  return (
    <footer className="py-20 bg-purple-50/50 border-t border-purple-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 purple-gradient rounded-lg flex items-center justify-center font-bold text-white shadow-sm">꿈</div>
              <span className="text-2xl font-black tracking-tight text-purple-900">{settings.siteName}</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm font-light leading-relaxed">
              창원시 비영리 민간단체 등록 제 2023-001호 <br/>
              주민과 함께 행복한 도시를 디자인합니다.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-6">
            <div className="flex space-x-6">
              <a 
                href={settings.blogUrlMain} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all border-purple-100 text-purple-600 shadow-sm bg-white"
                title="공식 블로그"
              >
                <BookOpen className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all border-purple-100 text-purple-600 shadow-sm bg-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all border-purple-100 text-purple-600 shadow-sm bg-white">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* External Public Links Section */}
        <div className="mb-12 p-8 glass rounded-[2rem] border-purple-100 bg-white/40">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <span className="text-[10px] font-black text-purple-900 uppercase tracking-[0.3em] opacity-40">유관기관 바로가기</span>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {externalLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-black text-gray-500 hover:text-purple-900 transition-all group"
                >
                  {link.name}
                  <ExternalLink className="ml-1.5 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between pt-12 border-t border-purple-100 text-[10px] md:text-xs text-purple-300 uppercase tracking-widest font-bold">
          <div className="space-y-1 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <span className="text-purple-400">© 2024 KKUMTTRE COMMUNITY. ALL RIGHTS RESERVED.</span>
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
          </div>
          <div className="text-purple-400">
            DESIGNED BY CREATIVE LAB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
