
import React from 'react';
import { SiteSettings } from '../types';
import { Instagram, Facebook, MessageCircle, ExternalLink, BookOpen } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const externalLinks = [
    { 
      name: '국세청', 
      url: 'https://www.nts.go.kr',
      logo: 'https://www.nts.go.kr/images/common/logo.png' 
    },
    { 
      name: '창원시청', 
      url: 'https://www.changwon.go.kr',
      logo: 'https://www.changwon.go.kr/images/common/logo.png'
    },
    { 
      name: '국민권익위원회', 
      url: 'https://www.acrc.go.kr',
      logo: 'https://www.acrc.go.kr/images/common/logo.png'
    },
    {
      name: '1365 자원봉사',
      url: 'https://www.1365.go.kr',
      logo: 'https://www.1365.go.kr/images/common/logo.png'
    }
  ];

  return (
    <footer className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-display text-white shadow-sm">꿈</div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">{settings.siteName}</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
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
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-slate-200 text-blue-600 shadow-sm"
                title="공식 블로그"
              >
                <BookOpen className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-slate-200 text-blue-600 shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-slate-200 text-blue-600 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* External Public Links Section */}
        <div className="mb-12 p-8 bg-white rounded-[2rem] border border-slate-200">
          <div className="flex flex-col items-center space-y-8">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">유관기관 바로가기</span>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {externalLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group transition-all"
                >
                  <div className="w-32 h-12 mb-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-2 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all overflow-hidden">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=128`} 
                      alt={link.name}
                      className="h-6 w-auto object-contain transition-all opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between pt-12 border-t border-slate-200 text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">
          <div className="space-y-1 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <span>© 2024 KKUMTTRE COMMUNITY. ALL RIGHTS RESERVED.</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
          <div>
            DESIGNED BY CREATIVE LAB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
