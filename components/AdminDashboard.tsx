
import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings, Post, PostCategory, SponsorshipAccount } from '../types';
import { X, Plus, Trash2, Layout, FileText, Settings, User, Palette, Image as ImageIcon, Info, CreditCard, CheckCircle2, Link as LinkIcon, Upload, MapPin, Phone, Mail, Loader2, Edit3, RotateCcw } from 'lucide-react';

interface AdminDashboardProps {
  settings: SiteSettings;
  updateSettings: (s: SiteSettings) => void;
  posts: Post[];
  addPost: (p: Post) => void;
  updatePost: (p: Post) => void;
  deletePost: (id: string) => void;
  onClose: () => void;
  initialCategory?: PostCategory;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  settings, updateSettings, posts, addPost, updatePost, deletePost, onClose, initialCategory = 'NOTICE'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'posts'>(initialCategory ? 'posts' : 'settings');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [newPost, setNewPost] = useState<{
    title: string;
    content: string;
    category: PostCategory;
    imageUrls: string;
    author: string;
  }>({
    title: '',
    content: '',
    category: initialCategory,
    imageUrls: '',
    author: '관리자'
  });
  
  const [uploadedPostImages, setUploadedPostImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputPostRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCategory) {
      setNewPost(prev => ({ ...prev, category: initialCategory }));
      setActiveTab('posts');
    }
  }, [initialCategory]);

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    alert('설정이 저장되었습니다.');
  };

  const handlePostImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setIsUploading(true);

    const promises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setUploadedPostImages(prev => [...prev, ...base64Images]);
      setIsUploading(false);
    });
  };

  const removeUploadedImage = (index: number) => {
    setUploadedPostImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      content: post.content,
      category: post.category,
      author: post.author || '관리자',
      imageUrls: post.imageUrls ? post.imageUrls.filter(url => !url.startsWith('data:image')).join('\n') : ''
    });
    setUploadedPostImages(post.imageUrls ? post.imageUrls.filter(url => url.startsWith('data:image')) : []);
    
    document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setNewPost({ title: '', content: '', category: initialCategory, imageUrls: '', author: '관리자' });
    setUploadedPostImages([]);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    
    const urlFromInput = newPost.imageUrls
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url !== '');
    
    const finalImageUrls = [...uploadedPostImages, ...urlFromInput];
    
    if (editingPostId) {
      const originalPost = posts.find(p => p.id === editingPostId);
      if (originalPost) {
        updatePost({
          ...originalPost,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          author: newPost.author,
          imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
        });
        alert('게시물이 수정되었습니다.');
      }
    } else {
      addPost({
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        author: newPost.author,
        imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
        date: new Date().toISOString().split('T')[0]
      });
      alert('새 콘텐츠가 발행되었습니다.');
    }

    handleCancelEdit();
  };

  const handleDeletePost = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deletePost(id);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-[#0a0a0a] border border-white/5 w-full max-w-6xl h-full max-h-[92vh] rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">꿈뜨레 CMS 마스터</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all group">
            <X className="w-8 h-8 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-72 border-r border-white/5 p-8 flex flex-col space-y-3 bg-white/[0.01]">
            <button onClick={() => setActiveTab('settings')} className={`flex items-center space-x-4 p-5 rounded-[1.5rem] transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <Layout className="w-5 h-5" /><span className="font-bold">기본 사이트 제어</span>
            </button>
            <button onClick={() => setActiveTab('posts')} className={`flex items-center space-x-4 p-5 rounded-[1.5rem] transition-all ${activeTab === 'posts' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <FileText className="w-5 h-5" /><span className="font-bold">발행 콘텐츠 관리</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-black/40">
            {activeTab === 'settings' ? (
              <div className="space-y-12 max-w-4xl">
                {/* 기존 설정 폼 유지 */}
                <section className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">대표자 및 단체 기본정보</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">대표자 이름</label>
                      <input type="text" value={localSettings.representativeName} onChange={(e) => setLocalSettings({...localSettings, representativeName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold" />
                    </div>
                  </div>
                </section>
                <button onClick={handleSaveSettings} className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl">설정 저장하기</button>
              </div>
            ) : (
              <div className="space-y-16 max-w-4xl">
                {/* 콘텐츠 발행 폼 */}
                <div className={`glass p-10 rounded-[2.5rem] border-white/10 transition-all ${editingPostId ? 'bg-purple-900/10 border-purple-500/30' : 'bg-white/[0.03]'}`}>
                  <h4 className="text-2xl font-black italic text-white mb-10 flex items-center">
                    {editingPostId ? <Edit3 className="mr-3" /> : <Plus className="mr-3" />}
                    {editingPostId ? '게시물 수정' : '새로운 발행'}
                  </h4>
                  <form onSubmit={handleSubmitPost} className="space-y-10">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">글 제목</label>
                        <input type="text" required value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold text-lg" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">카테고리</label>
                        <select value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value as PostCategory})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold cursor-pointer focus:border-purple-500">
                          <option value="ACTIVITY">활동 갤러리</option>
                          <option value="NOTICE">공지사항</option>
                          <option value="SPONSORSHIP">후원소식</option>
                          <option value="INQUIRY">문의사항 (Inquiry)</option>
                        </select>
                      </div>
                    </div>
                    <textarea required value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none min-h-[200px] focus:border-purple-500 text-white" />
                    <button type="submit" className="bg-purple-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-purple-700 transition-all shadow-xl active:scale-95">
                      {editingPostId ? '수정 사항 저장' : '발행하기'}
                    </button>
                    {editingPostId && <button onClick={handleCancelEdit} type="button" className="ml-4 text-gray-400 font-bold hover:text-white transition-colors">수정 취소</button>}
                  </form>
                </div>

                {/* 전체 발행 목록 */}
                <div className="space-y-8">
                  <h4 className="text-2xl font-black text-white flex items-center">
                    <FileText className="mr-3 text-purple-500" /> 전체 발행 목록 ({posts.length})
                  </h4>
                  <div className="grid gap-4">
                    {posts.map(post => (
                      <div key={post.id} className="flex items-center justify-between p-6 glass rounded-2xl border-white/5 group hover:bg-white/[0.06] transition-all bg-white/[0.02]">
                        <div className="flex items-center space-x-5">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                            post.category === 'NOTICE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            post.category === 'ACTIVITY' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                            post.category === 'INQUIRY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-pink-500/10 text-pink-400 border-pink-500/20'
                          }`}>{post.category}</span>
                          <div>
                            <h5 className="font-bold text-white line-clamp-1">{post.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-1">{post.date} | 작성자: {post.author || '관리자'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={(e) => handleEditClick(e, post)} className="p-3 text-blue-400 hover:text-white hover:bg-blue-600/30 rounded-xl transition-all bg-white/5 active:scale-90"><Edit3 className="w-5 h-5" /></button>
                          <button onClick={(e) => handleDeletePost(e, post.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-600/30 rounded-xl transition-all bg-white/5 active:scale-90"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
