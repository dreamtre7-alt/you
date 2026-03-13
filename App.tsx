
import React, { useState, useEffect } from 'react';
import { Post, SiteSettings, View } from './types.ts';
import { INITIAL_POSTS, INITIAL_SETTINGS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Sponsorship from './components/Sponsorship.tsx';
import Footer from './components/Footer.tsx';
import MediaFeed from './components/MediaFeed.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('kkumttre_admin') === 'true';
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kkumttre_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return INITIAL_SETTINGS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kkumttre_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const deletePost = (id: string) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  useEffect(() => {
    localStorage.setItem('kkumttre_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kkumttre_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kkumttre_admin', isAdmin.toString());
  }, [isAdmin]);

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

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Hero settings={settings} />;
      case 'ABOUT':
        return <About settings={settings} />;
      case 'SPONSORSHIP_NEWS':
        return (
          <Sponsorship 
            posts={posts.filter(p => p.category === 'SPONSORSHIP_NEWS')} 
            settings={settings} 
            onAddPost={addPost}
            onDeletePost={deletePost}
            currentCategory="SPONSORSHIP_NEWS"
            isAdmin={isAdmin}
          />
        );
      case 'SPONSORSHIP_REPORT':
        return (
          <Sponsorship 
            posts={posts.filter(p => p.category === 'SPONSORSHIP_REPORT')} 
            settings={settings} 
            onAddPost={addPost}
            onDeletePost={deletePost}
            currentCategory="SPONSORSHIP_REPORT"
            isAdmin={isAdmin}
          />
        );
      case 'MEDIA':
        return <MediaFeed settings={settings} />;
      default:
        return <Hero settings={settings} />;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-purple-200 selection:text-purple-900 bg-transparent text-[#111111]">
      <Navbar currentView={currentView} setView={setCurrentView} settings={settings} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <main className="relative z-10">
        {renderView()}
      </main>

      <Footer settings={settings} />
    </div>
  );
};

export default App;
