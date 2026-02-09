
import React, { useState, useEffect } from 'react';
import { Post, SiteSettings, PostCategory, View } from './types';
import { INITIAL_POSTS, INITIAL_SETTINGS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import NoticeBoard from './components/NoticeBoard';
import Sponsorship from './components/Sponsorship';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import MediaFeed from './components/MediaFeed';
import { Lock, Unlock, ArrowRight, ShieldCheck, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [adminDefaultCategory, setAdminDefaultCategory] = useState<PostCategory>('NOTICE');
  const [currentView, setCurrentView] = useState<View>('HOME');

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kkumttre_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kkumttre_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('kkumttre_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kkumttre_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-purple', settings.primaryColor);
    document.documentElement.style.setProperty('--theme-brightness', (settings.themeBrightness / 100).toString());
    const hex = settings.primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (!isNaN(r)) {
      document.documentElement.style.setProperty('--primary-purple-rgb', `${r}, ${g}, ${b}`);
    }
  }, [settings]);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: string) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      setPosts(prev => {
        const filtered = prev.filter(p => p.id !== id);
        return [...filtered]; 
      });
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setAdminDefaultCategory('NOTICE');
      setShowAdminDashboard(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === '0788') {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPassword('');
      setAdminDefaultCategory('NOTICE');
      setShowAdminDashboard(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword('');
    }
  };

  const openAdminWithCategory = (category: PostCategory) => {
    setAdminDefaultCategory(category);
    setShowAdminDashboard(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <>
            <Hero settings={settings} />
            <section className="py-32 relative">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="glass p-12 rounded-[3rem] border-white/40 hover:shadow-2xl transition-all group">
                    <h4 className="text-2xl font-black mb-6 text-purple-900 flex items-center">
                      <span className="w-1.5 h-6 bg-purple-900 rounded-full mr-3"></span>
                      최근 공지사항
                    </h4>
                    <div className="space-y-5 mb-10">
                      {posts.filter(p => p.category === 'NOTICE').slice(0, 3).map(p => (
                        <div key={p.id} className="flex justify-between items-center border-b border-purple-50/50 pb-3 group/item cursor-pointer">
                          <span className="font-bold text-gray-800 truncate pr-4 group-hover/item:text-purple-700 transition-colors">{p.title}</span>
                          <span className="text-[10px] text-purple-400 font-black">{p.date}</span>
                        </div>
                      ))}
                      {posts.filter(p => p.category === 'NOTICE').length === 0 && (
                        <p className="text-sm text-gray-400">등록된 공지사항이 없습니다.</p>
                      )}
                    </div>
                    <button onClick={() => setCurrentView('NOTICES')} className="flex items-center text-[10px] font-black text-purple-900 uppercase tracking-widest hover:translate-x-2 transition-transform">
                      VIEW ALL NOTICES <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="glass p-12 rounded-[3rem] border-white/40 hover:shadow-2xl transition-all group">
                    <h4 className="text-2xl font-black mb-6 text-[#111111] flex items-center">
                      <span className="w-1.5 h-6 bg-black rounded-full mr-3"></span>
                      활동 갤러리
                    </h4>
                    <div className="grid grid-cols-2 gap-5 mb-10">
                      {posts.filter(p => p.category === 'ACTIVITY').slice(0, 2).map(p => (
                        <div key={p.id} className="aspect-square rounded-[2rem] overflow-hidden shadow-inner bg-purple-50">
                          <img src={p.imageUrls?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      ))}
                      {posts.filter(p => p.category === 'ACTIVITY').length === 0 && (
                        <div className="col-span-2 h-32 flex items-center justify-center text-sm text-gray-400 border border-dashed border-purple-100 rounded-[2rem]">
                          등록된 활동이 없습니다.
                        </div>
                      )}
                    </div>
                    <button onClick={() => setCurrentView('GALLERY')} className="flex items-center text-[10px] font-black text-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                      EXPLORE GALLERY <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      case 'ABOUT':
        return <About settings={settings} />;
      case 'GALLERY':
        return (
          <Gallery 
            posts={posts.filter(p => p.category === 'ACTIVITY')} 
            isAdmin={isAdmin}
            onWrite={() => openAdminWithCategory('ACTIVITY')}
            onAddPost={addPost}
          />
        );
      case 'NOTICES':
        return (
          <NoticeBoard 
            posts={posts.filter(p => p.category === 'NOTICE')} 
            isAdmin={isAdmin} 
            onWrite={() => openAdminWithCategory('NOTICE')} 
          />
        );
      case 'SPONSORSHIP':
        return (
          <Sponsorship 
            posts={posts.filter(p => p.category === 'SPONSORSHIP')} 
            settings={settings} 
            isAdmin={isAdmin} 
            onWrite={() => openAdminWithCategory('SPONSORSHIP')} 
          />
        );
      case 'MEDIA':
        return <MediaFeed settings={settings} />;
      case 'CONTACT':
        return (
          <Contact 
            settings={settings} 
            posts={posts.filter(p => p.category === 'INQUIRY')}
            onAddPost={addPost}
          />
        );
      default:
        return <Hero settings={settings} />;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-purple-200 selection:text-purple-900 bg-transparent text-[#111111]">
      <Navbar isAdmin={isAdmin} currentView={currentView} setView={setCurrentView} />
      
      <main className="relative z-10">
        {renderView()}
      </main>

      <Footer settings={settings} />

      {/* Admin Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl w-full max-w-md p-12 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-purple-900 tracking-tighter">마스터 인증</h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-black transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit}>
              <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">관리자 권한을 활성화하기 위해<br/>보안 비밀번호를 입력해 주세요.</p>
              <input 
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-purple-50/50 border border-purple-100 rounded-2xl px-6 py-5 outline-none focus:border-purple-600 font-bold mb-8 text-center text-4xl tracking-[0.3em] shadow-inner"
              />
              <button 
                type="submit"
                className="w-full bg-purple-900 text-white py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
              >
                인증하기
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={handleAdminToggle}
        className="fixed bottom-10 right-10 z-50 p-5 rounded-full glass border-white/50 hover:scale-110 transition-transform shadow-2xl group bg-white/40"
      >
        {isAdmin ? (
          <Unlock className="w-7 h-7 text-purple-600" />
        ) : (
          <Lock className="w-7 h-7 text-purple-400 group-hover:text-purple-600" />
        )}
      </button>

      {isAdmin && showAdminDashboard && (
        <AdminDashboard 
          settings={settings} 
          updateSettings={updateSettings} 
          posts={posts}
          addPost={addPost}
          updatePost={updatePost}
          deletePost={deletePost}
          onClose={() => setShowAdminDashboard(false)}
          initialCategory={adminDefaultCategory}
        />
      )}
    </div>
  );
};

export default App;
