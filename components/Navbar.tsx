
import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { Menu, X, Share2, Instagram, ChevronDown, BookOpen, Lock, Unlock } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
  settings: SiteSettings;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, settings, isAdmin, setIsAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      name: 'HOME', 
      view: 'HOME'
    },
    { 
      name: '단체소개', 
      view: 'ABOUT',
      sub: [
        { name: '대표인사말', view: 'ABOUT', anchor: 'greeting' },
        { name: '단체연혁', view: 'ABOUT', anchor: 'history' }
      ]
    },
    { name: '공식 블로그', view: 'MEDIA' },
    { 
      name: '후원소식', 
      view: 'SPONSORSHIP_NEWS',
      sub: [
        { name: '후원소식', view: 'SPONSORSHIP_NEWS' },
        { name: '후원보고', view: 'SPONSORSHIP_REPORT' }
      ]
    },
  ];

  const handleNavClick = (view: any, anchor?: string) => {
    setView(view);
    setMobileMenuOpen(false);
    setActiveSubMenu(null);
    if (anchor) {
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 glass border-b border-purple-100/50 shadow-2xl bg-white/90' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => handleNavClick('HOME')}>
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl group-hover:bg-purple-900 transition-all duration-500">
            꿈
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter leading-none text-[#111111]">꿈뜨레</span>
            <span className="text-[9px] font-black text-purple-900 uppercase tracking-[0.3em] mt-1 opacity-60">Changwon Community</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="relative group/item"
              onMouseEnter={() => item.sub && setActiveSubMenu(item.name)}
              onMouseLeave={() => item.sub && setActiveSubMenu(null)}
            >
              <button 
                onClick={() => handleNavClick(item.view)}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center ${currentView === item.view || (item.sub && item.sub.some(s => s.view === currentView)) ? 'text-purple-900' : 'text-[#111111]/60 hover:text-purple-900'}`}
              >
                {item.name}
                {item.sub && <ChevronDown className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover/item:rotate-180" />}
              </button>
              
              {item.sub && (
                <div className={`absolute top-full left-0 pt-6 transition-all duration-300 ${activeSubMenu === item.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                  <div className="glass p-5 rounded-[2rem] border-purple-100 w-48 flex flex-col space-y-4 bg-white shadow-2xl">
                    {item.sub.map(sub => (
                      <button 
                        key={sub.name} 
                        onClick={() => handleNavClick(sub.view, sub.anchor)}
                        className="text-[11px] font-black text-left text-gray-400 hover:text-purple-900 transition-colors uppercase tracking-[0.1em]"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center space-x-5 pl-6 border-l border-purple-100">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 rounded-xl transition-all ${isAdmin ? 'bg-purple-900 text-white shadow-lg' : 'text-gray-300 hover:text-purple-900'}`}
              title={isAdmin ? '관리자 모드 끄기' : '관리자 모드 켜기'}
            >
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
            <a href={settings.blogUrlMain} target="_blank" rel="noopener noreferrer" title="공식 블로그">
              <BookOpen className="w-5 h-5 text-gray-300 cursor-pointer hover:text-black transition-colors" />
            </a>
            <Instagram className="w-5 h-5 text-gray-300 cursor-pointer hover:text-black transition-colors" />
            <Share2 className="w-5 h-5 text-gray-300 cursor-pointer hover:text-black transition-colors" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-4 glass rounded-2xl border-purple-200 text-black active:scale-90 transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-0 h-screen w-full bg-white z-[-1] transition-all duration-700 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-10 px-8">
          <div className="text-[10px] font-black text-purple-900 uppercase tracking-[0.6em] mb-6 opacity-40">Navigation</div>
          {navItems.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <button 
                className={`text-4xl font-black transition-all tracking-tighter ${currentView === item.view ? 'text-purple-900 scale-110' : 'text-[#111111] hover:text-purple-900'}`}
                onClick={() => handleNavClick(item.view)}
              >
                {item.name}
              </button>
              {item.sub && (
                <div className="flex space-x-8 mt-6">
                  {item.sub.map(sub => (
                    <button 
                      key={sub.name} 
                      onClick={() => handleNavClick(sub.view, sub.anchor)}
                      className="text-sm font-black text-gray-400 hover:text-purple-900 transition-colors uppercase tracking-[0.2em]"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-16 flex space-x-10">
            <Instagram className="w-10 h-10 text-gray-300 hover:text-black" />
            <Share2 className="w-10 h-10 text-gray-300 hover:text-black" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
