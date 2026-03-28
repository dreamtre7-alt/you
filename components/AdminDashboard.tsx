
import React, { useState, useEffect } from 'react';
import { Post, SiteSettings, PostCategory } from '../types';
import { X, Plus, Trash2, Image as ImageIcon, Save, LayoutDashboard, FileText, Bell, Heart, Sparkles, Settings, Camera, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
 
interface AdminDashboardProps {
  posts: Post[];
  settings: SiteSettings;
  onAddPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onClose: () => void;
  preSetCategory?: PostCategory;
}
 
const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, settings, onAddPost, onDeletePost, onUpdateSettings, onClose, preSetCategory }) => {
  const [activeTab, setActiveTab] = useState<'POSTS' | 'SETTINGS' | 'GALLERY'>('POSTS');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>(preSetCategory || 'NOTICES');
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingActivityPhoto, setIsAddingActivityPhoto] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrls: ['']
  });
  const [newActivityPhoto, setNewActivityPhoto] = useState({
    title: '',
    imageUrl: '',
    date: new Date().getFullYear().toString(),
    location: '꿈뜨레 지역공동체'
  });
  const [uploading, setUploading] = useState(false);
  const [editingSettings, setEditingSettings] = useState<SiteSettings>({
    ...settings,
    activityPhotos: settings.activityPhotos || []
  });

  useEffect(() => {
    if (preSetCategory) {
      setSelectedCategory(preSetCategory);
      setIsAddingPost(true);
    }
  }, [preSetCategory]);

  useEffect(() => {
    setEditingSettings({
      ...settings,
      activityPhotos: settings.activityPhotos || []
    });
  }, [settings]);
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const fileArray: File[] = Array.from(files);
    const readers = fileArray.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(readers);
      setNewPost(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls.filter(url => url !== ''), ...base64Images]
      }));
    } catch (error) {
      console.error("Error reading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingSettings(prev => ({
        ...prev,
        representativePhoto: reader.result as string
      }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    setNewPost({ ...newPost, imageUrls: [...newPost.imageUrls, ''] });
  };

  const handleRemoveImageUrl = (index: number) => {
    const updatedUrls = newPost.imageUrls.filter((_, i) => i !== index);
    setNewPost({ ...newPost, imageUrls: updatedUrls.length > 0 ? updatedUrls : [''] });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...newPost.imageUrls];
    updatedUrls[index] = value;
    setNewPost({ ...newPost, imageUrls: updatedUrls });
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalImageUrls = newPost.imageUrls.map(url => url.trim()).filter(url => url !== '');

    if (!newPost.title || !newPost.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      date: new Date().toLocaleDateString('ko-KR'),
      category: selectedCategory,
      imageUrls: finalImageUrls
    };

    onAddPost(post);
    setIsAddingPost(false);
    setNewPost({ title: '', content: '', imageUrls: [''] });
  };
 
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(editingSettings);
    alert('설정이 저장되었습니다.');
  };
 
  const handleAddAddress = () => {
    setEditingSettings({
      ...editingSettings,
      contactAddresses: [...editingSettings.contactAddresses, '']
    });
  };
 
  const handleRemoveAddress = (index: number) => {
    setEditingSettings({
      ...editingSettings,
      contactAddresses: editingSettings.contactAddresses.filter((_, i) => i !== index)
    });
  };
 
  const handleAddressChange = (index: number, value: string) => {
    const updated = [...editingSettings.contactAddresses];
    updated[index] = value;
    setEditingSettings({
      ...editingSettings,
      contactAddresses: updated
    });
  };

  const handleAddActivityPhoto = () => {
    setIsAddingActivityPhoto(true);
  };

  const handleNewActivityPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewActivityPhoto(prev => ({ ...prev, imageUrl: reader.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAddActivityPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityPhoto.imageUrl) {
      alert('이미지를 업로드해주세요.');
      return;
    }
    setEditingSettings({
      ...editingSettings,
      activityPhotos: [
        {
          id: Date.now().toString(),
          ...newActivityPhoto
        },
        ...(editingSettings.activityPhotos || [])
      ]
    });
    setIsAddingActivityPhoto(false);
    setNewActivityPhoto({
      title: '',
      imageUrl: '',
      date: new Date().getFullYear().toString(),
      location: '꿈뜨레 지역공동체'
    });
  };

  const handleRemoveActivityPhoto = (id: string) => {
    setEditingSettings({
      ...editingSettings,
      activityPhotos: (editingSettings.activityPhotos || []).filter(p => p.id !== id)
    });
  };

  const handleUpdateActivityPhoto = (id: string, field: string, value: string) => {
    setEditingSettings({
      ...editingSettings,
      activityPhotos: (editingSettings.activityPhotos || []).map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const handleActivityPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateActivityPhoto(id, 'imageUrl', reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };
 
  const filteredPosts = posts.filter(p => p.category === selectedCategory);

  const categories: { id: PostCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'NOTICES', label: '공지사항', icon: <Bell className="w-4 h-4" /> },
    { id: 'SPONSORSHIP_NEWS', label: '후원소식', icon: <Heart className="w-4 h-4" /> },
    { id: 'SPONSORSHIP_REPORT', label: '후원보고', icon: <Sparkles className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">관리자 대시보드</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Admin Control Panel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-full transition-all hover:rotate-90 shadow-sm border border-slate-100"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-6 hidden md:flex flex-col space-y-2">
            <button 
              onClick={() => setActiveTab('POSTS')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'POSTS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
            >
              <FileText className="w-4 h-4" />
              <span>게시물 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'SETTINGS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
            >
              <Settings className="w-4 h-4" />
              <span>사이트 설정</span>
            </button>
            <button 
              onClick={() => setActiveTab('GALLERY')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'GALLERY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
            >
              <Camera className="w-4 h-4" />
              <span>갤러리 관리</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'POSTS' && (
              <div className="space-y-8">
                {/* Category Selector */}
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${selectedCategory === cat.id ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'}`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
 
                {/* Actions */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {categories.find(c => c.id === selectedCategory)?.label} 목록
                    <span className="ml-3 text-sm font-medium text-slate-400">총 {filteredPosts.length}개</span>
                  </h3>
                  <button 
                    onClick={() => setIsAddingPost(true)}
                    className="flex items-center space-x-2 bg-blue-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 게시물 작성</span>
                  </button>
                </div>
 
                {/* Post List */}
                <div className="grid gap-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <div key={post.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-6">
                          {post.imageUrls && post.imageUrls.length > 0 && (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100">
                              <img src={post.imageUrls[0]} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">{post.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{post.date}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePost(post.id);
                          }}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">등록된 게시물이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
 
            {activeTab === 'SETTINGS' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">사이트 설정 관리</h3>
                </div>
 
                <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl">
                  {/* Basic Info */}
                  <div className="grid gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">기본 정보</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">사이트 이름</label>
                        <input 
                          type="text" 
                          value={editingSettings.siteName}
                          onChange={e => setEditingSettings({...editingSettings, siteName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">슬로건</label>
                        <input 
                          type="text" 
                          value={editingSettings.slogan}
                          onChange={e => setEditingSettings({...editingSettings, slogan: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">대표자 성함</label>
                        <input 
                          type="text" 
                          value={editingSettings.representativeName}
                          onChange={e => setEditingSettings({...editingSettings, representativeName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">대표자 사진</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                            {editingSettings.representativePhoto ? (
                              <img src={editingSettings.representativePhoto} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <label className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 outline-none transition-all cursor-pointer hover:bg-slate-50 flex items-center justify-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600 font-medium">사진 업로드</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {uploading && <p className="text-[10px] text-blue-600 font-bold mt-1 ml-1">업로드 중...</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">대표 약력</label>
                      <textarea 
                        value={editingSettings.representativeBio}
                        onChange={e => setEditingSettings({...editingSettings, representativeBio: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Organization Intro (About Page) */}
                  <div className="grid gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">단체소개 (About)</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">비전 (Vision)</label>
                      <input 
                        type="text" 
                        value={editingSettings.vision}
                        onChange={e => setEditingSettings({...editingSettings, vision: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">미션 (Mission)</label>
                      <input 
                        type="text" 
                        value={editingSettings.mission}
                        onChange={e => setEditingSettings({...editingSettings, mission: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">연혁 (History)</label>
                      <textarea 
                        value={editingSettings.history}
                        onChange={e => setEditingSettings({...editingSettings, history: e.target.value})}
                        rows={10}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">인사말 (Greeting)</label>
                      <textarea 
                        value={editingSettings.representativeGreeting}
                        onChange={e => setEditingSettings({...editingSettings, representativeGreeting: e.target.value})}
                        rows={10}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
 
                  {/* Contact Info */}
                  <div className="grid gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">연락처 정보</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">이메일 (여러 개일 경우 쉼표로 구분)</label>
                        <input 
                          type="text" 
                          value={editingSettings.contactEmail}
                          onChange={e => setEditingSettings({...editingSettings, contactEmail: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="example@mail.com, other@mail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">전화번호</label>
                        <input 
                          type="text" 
                          value={editingSettings.contactPhone}
                          onChange={e => setEditingSettings({...editingSettings, contactPhone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Addresses */}
                    <div>
                      <div className="flex items-center justify-between mb-2 ml-1">
                        <label className="block text-xs font-bold text-slate-500">사무실 주소</label>
                        <button 
                          type="button"
                          onClick={handleAddAddress}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-1" /> 주소 추가
                        </button>
                      </div>
                      <div className="space-y-3">
                        {editingSettings.contactAddresses.map((addr, idx) => (
                          <div key={idx} className="flex space-x-2">
                            <input 
                              type="text" 
                              value={addr}
                              onChange={e => handleAddressChange(idx, e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                              placeholder="주소를 입력하세요"
                            />
                            <button 
                              type="button"
                              onClick={() => handleRemoveAddress(idx)}
                              className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
 
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      <span>설정 저장하기 (현재 브라우저)</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        const config = JSON.stringify(editingSettings, null, 2);
                        navigator.clipboard.writeText(config);
                        alert('설정 데이터가 클립보드에 복사되었습니다! 이 내용을 채팅창에 붙여넣어 주시면 제가 코드에 직접 반영하여 배포해 드릴 수 있습니다.');
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg"
                    >
                      <FileText className="w-5 h-5" />
                      <span>배포용 설정 데이터 복사</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'GALLERY' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">단체활동 갤러리 관리</h3>
                  <button 
                    onClick={handleAddActivityPhoto}
                    className="flex items-center space-x-2 bg-blue-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>사진 추가</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(editingSettings.activityPhotos || []).map(photo => (
                    <div key={photo.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 group">
                        <img src={photo.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleActivityPhotoUpload(e, photo.id)} 
                          />
                        </label>
                      </div>
                      
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">제목</label>
                          <input 
                            type="text" 
                            value={photo.title}
                            onChange={e => handleUpdateActivityPhoto(photo.id, 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">날짜</label>
                            <input 
                              type="text" 
                              value={photo.date || ''}
                              onChange={e => handleUpdateActivityPhoto(photo.id, 'date', e.target.value)}
                              className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                              placeholder="2024-2025"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">장소</label>
                            <input 
                              type="text" 
                              value={photo.location || ''}
                              onChange={e => handleUpdateActivityPhoto(photo.id, 'location', e.target.value)}
                              className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                              placeholder="꿈뜨레 지역공동체"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => handleRemoveActivityPhoto(photo.id)}
                          className="flex items-center space-x-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all text-xs font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <button 
                    onClick={handleSaveSettings}
                    className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    <span>갤러리 변경사항 저장하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Add Activity Photo Modal */}
      <AnimatePresence>
        {isAddingActivityPhoto && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingActivityPhoto(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-2xl font-bold text-slate-900">새 활동 사진 등록</h3>
                <button 
                  onClick={() => setIsAddingActivityPhoto(false)} 
                  className="p-2 hover:bg-white rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleConfirmAddActivityPhoto} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">활동 사진</label>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer transition-all border border-slate-200 group">
                        <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-bold">이미지 파일 선택</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleNewActivityPhotoFileChange} />
                      </label>
                      
                      {newActivityPhoto.imageUrl && (
                        <button 
                          type="button" 
                          onClick={() => setNewActivityPhoto(prev => ({ ...prev, imageUrl: '' }))}
                          className="px-4 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all border border-red-100 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-bold">이미지 제거</span>
                        </button>
                      )}
                    </div>

                    {newActivityPhoto.imageUrl ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 group">
                        <img src={newActivityPhoto.imageUrl} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-sm font-bold">이미지 미리보기</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50/50">
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-xs text-blue-600 font-bold">처리 중...</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-slate-300 mb-2" />
                            <p className="text-sm text-slate-400">활동 사진을 선택해주세요</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">활동 제목</label>
                    <input 
                      type="text" 
                      value={newActivityPhoto.title}
                      onChange={e => setNewActivityPhoto({...newActivityPhoto, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="활동 명칭을 입력하세요"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">날짜</label>
                      <input 
                        type="text" 
                        value={newActivityPhoto.date}
                        onChange={e => setNewActivityPhoto({...newActivityPhoto, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="2024-2025"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">장소</label>
                      <input 
                        type="text" 
                        value={newActivityPhoto.location}
                        onChange={e => setNewActivityPhoto({...newActivityPhoto, location: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="꿈뜨레 지역공동체"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!newActivityPhoto.imageUrl}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${newActivityPhoto.imageUrl ? 'bg-blue-900 text-white hover:bg-slate-900' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  갤러리에 추가하기
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Post Modal */}
      <AnimatePresence>
        {isAddingPost && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingPost(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-3xl font-bold text-slate-900">
                  {categories.find(c => c.id === selectedCategory)?.label} 작성
                </h3>
                <button 
                  onClick={() => setIsAddingPost(false)} 
                  className="p-3 hover:bg-white rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-8 h-8 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddPost} className="p-10 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">제목</label>
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">내용</label>
                  <textarea 
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-40 resize-none"
                    placeholder="내용을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">사진 첨부</label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {newPost.imageUrls.filter(url => url !== '').map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                          <img src={url} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImageUrl(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full transition-opacity hover:bg-red-500"
                            title="제거"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <Plus className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                    {uploading && <p className="text-xs text-blue-600 font-bold animate-pulse">사진을 읽어오는 중입니다...</p>}
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all shadow-xl">
                  게시하기
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
