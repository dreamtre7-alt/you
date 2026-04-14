
import React, { useState, useEffect } from 'react';
import { Post, SiteSettings, View } from './types.ts';
import { INITIAL_POSTS, INITIAL_SETTINGS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import HomeSections from './components/HomeSections.tsx';
import About from './components/About.tsx';
import Sponsorship from './components/Sponsorship.tsx';
import Footer from './components/Footer.tsx';
import MediaFeed from './components/MediaFeed.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { PostCategory } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('kkumttre_admin') === 'true';
  });
  const [adminPreSetCategory, setAdminPreSetCategory] = useState<PostCategory | undefined>(undefined);

  const SETTINGS_VERSION = '20260414_v1'; // Bump this to force reset old settings
  const savedVersion = localStorage.getItem('kkumttre_settings_version');
  const isVersionMismatch = savedVersion !== SETTINGS_VERSION;

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kkumttre_settings');

    if (saved && !isVersionMismatch) {
      try {
        const parsed = JSON.parse(saved);
        // Merge parsed over INITIAL_SETTINGS so user changes are preserved
        return { ...INITIAL_SETTINGS, ...parsed };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return INITIAL_SETTINGS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kkumttre_posts');

    if (saved && !isVersionMismatch) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : INITIAL_POSTS;
      } catch (e) {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  useEffect(() => {
    if (isVersionMismatch) {
      localStorage.setItem('kkumttre_settings_version', SETTINGS_VERSION);
    }
  }, [isVersionMismatch]);

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
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

  // Force update old blog URLs if they exist in state (migration for existing users)
  useEffect(() => {
    const oldMainUrl = "https://blog.naver.com/dreamtr7";
    const newMainUrl = "https://blog.naver.com/dreamtre1108";
    const target7thUrl = "https://blog.naver.com/zaminan";

    if (settings.blogUrlMain === oldMainUrl || settings.blogUrl7 === "https://blog.naver.com/dreamtre1108" || settings.blogUrl7 === "https://m.blog.naver.com/zaminan") {
      setSettings(prev => ({
        ...prev,
        blogUrlMain: prev.blogUrlMain === oldMainUrl ? newMainUrl : prev.blogUrlMain,
        blogUrl7: (prev.blogUrl7 === "https://blog.naver.com/dreamtre1108" || prev.blogUrl7 === "https://m.blog.naver.com/zaminan") ? target7thUrl : prev.blogUrl7
      }));
    }
  }, [settings.blogUrlMain, settings.blogUrl7]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-blue', settings.primaryColor);
    document.documentElement.style.setProperty('--theme-brightness', (settings.themeBrightness / 100).toString());
    const hex = settings.primaryColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        document.documentElement.style.setProperty('--primary-blue-rgb', `${r}, ${g}, ${b}`);
      }
    }
  }, [settings]);

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <>
            <Hero settings={settings} />
            <HomeSections settings={settings} posts={posts} setView={setCurrentView} />
          </>
        );
      case 'ABOUT':
        return <About settings={settings} />;
      case 'NOTICES':
        return (
          <Sponsorship 
            posts={posts.filter(p => p.category === 'NOTICES')} 
            settings={settings} 
            onAddPost={addPost}
            onDeletePost={deletePost}
            currentCategory="NOTICES"
            isAdmin={isAdmin}
            onOpenAdmin={(category) => {
              setAdminPreSetCategory(category);
              setCurrentView('ADMIN');
            }}
          />
        );
      case 'SPONSORSHIP_NEWS':
        return (
          <Sponsorship 
            posts={posts.filter(p => p.category === 'SPONSORSHIP_NEWS')} 
            settings={settings} 
            onAddPost={addPost}
            onDeletePost={deletePost}
            currentCategory="SPONSORSHIP_NEWS"
            isAdmin={isAdmin}
            onOpenAdmin={(category) => {
              setAdminPreSetCategory(category);
              setCurrentView('ADMIN');
            }}
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
            onOpenAdmin={(category) => {
              setAdminPreSetCategory(category);
              setCurrentView('ADMIN');
            }}
          />
        );
      case 'ADMIN':
        return (
          <AdminDashboard 
            posts={posts}
            settings={settings}
            onAddPost={addPost}
            onDeletePost={deletePost}
            onUpdateSettings={setSettings}
            onClose={() => {
              setCurrentView('HOME');
              setAdminPreSetCategory(undefined);
            }}
            preSetCategory={adminPreSetCategory}
          />
        );
      case 'MEDIA':
        return <MediaFeed settings={settings} />;
      default:
        return <Hero settings={settings} />;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-900 bg-transparent text-[#111111]">
      <Navbar currentView={currentView} setView={setCurrentView} settings={settings} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <main className="relative z-10">
        {renderView()}
      </main>

      <Footer settings={settings} />
    </div>
  );
};

export default App;
