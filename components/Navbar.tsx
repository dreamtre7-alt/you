
import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { Menu, X, Share2, Instagram, ChevronDown, BookOpen, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
        { name: '단체연혁', view: 'ABOUT', anchor: 'history' },
        { name: '단체활동', view: 'ACTIVITIES' }
      ]
    },
    { name: '공지사항', view: 'NOTICES' },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-sm py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-3 group cursor-pointer" 
          onClick={() => handleNavClick('HOME')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-display text-white text-xl shadow-lg group-hover:bg-blue-700 transition-all duration-300 group-hover:rotate-6">
            꿈
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display tracking-tight leading-none text-blue-700 drop-shadow-sm whitespace-nowrap">{settings.siteName}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 whitespace-nowrap">Community Center</span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item, idx) => (
            <div 
              key={item.name} 
              className="relative group/item"
              onMouseEnter={() => item.sub && setActiveSubMenu(item.name)}
              onMouseLeave={() => item.sub && setActiveSubMenu(null)}
            >
              <button 
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-bold transition-all flex items-center py-2 ${currentView === item.view || (item.sub && item.sub.some(s => s.view === currentView)) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {item.name}
                {item.sub && <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeSubMenu === item.name ? 'rotate-180' : ''}`} />}
              </button>
              
              <AnimatePresence>
                {item.sub && activeSubMenu === item.name && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="bg-white p-4 rounded-xl border border-gray-100 w-48 flex flex-col space-y-2 shadow-xl">
                      {item.sub.map(sub => (
                        <button 
                          key={sub.name} 
                          onClick={() => handleNavClick(sub.view, sub.anchor)}
                          className="text-xs font-semibold text-left text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          <div className="flex items-center space-x-4 pl-8 border-l border-gray-100">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 rounded-lg transition-all ${isAdmin ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600 bg-gray-50'}`}
              title={isAdmin ? '관리자 모드 끄기' : '관리자 모드 켜기'}
            >
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </motion.button>
            <a href={settings.blogUrlMain} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
              <BookOpen className="w-5 h-5" />
            </a>
            <Instagram className="w-5 h-5 text-gray-400 cursor-pointer hover:text-pink-600 transition-colors" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col space-y-4">
                  <button 
                    className={`text-2xl font-bold text-left ${currentView === item.view ? 'text-blue-600' : 'text-gray-900'}`}
                    onClick={() => handleNavClick(item.view)}
                  >
                    {item.name}
                  </button>
                  {item.sub && (
                    <div className="flex flex-col space-y-3 pl-4 border-l-2 border-gray-100">
                      {item.sub.map(sub => (
                        <button 
                          key={sub.name} 
                          onClick={() => handleNavClick(sub.view, sub.anchor)}
                          className="text-sm font-semibold text-gray-500 hover:text-blue-600 text-left"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-6 flex space-x-6 border-t border-gray-100">
                <Instagram className="w-6 h-6 text-gray-400" />
                <Share2 className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
