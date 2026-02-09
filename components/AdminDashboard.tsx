
import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings, Post, PostCategory } from '../types.ts';
import { X, Plus, Trash2, Layout, FileText, Settings, User, Image as ImageIcon, CheckCircle2, Link as LinkIcon, Upload, Loader2, Edit3, RotateCcw, BookOpen, Camera, Send, Mail, MapPin, Phone } from 'lucide-react';

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
  const formRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // 센터 블로그 이미지 업로드 레퍼런스
  const fileInputBlog7Ref = useRef<HTMLInputElement>(null);
  const fileInputBlog3Ref = useRef<HTMLInputElement>(null);
  const [isBlog7Uploading, setIsBlog7Uploading] = useState(false);
  const [isBlog3Uploading, setIsBlog3Uploading] = useState(false);

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
    alert('사이트 설정이 성공적으로 저장되었습니다.');
  };

  const handlePostImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Fix: Explicitly cast to File[] to avoid 'unknown' type inference which causes Blob compatibility issues with FileReader.readAsDataURL
    const fileArray = Array.from(files) as File[];
    setIsUploading(true);
    const promises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64Images => {
      setUploadedPostImages(prev => [...prev, ...base64Images]);
      setIsUploading(false);
    });
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'blogImage7' | 'blogImage3') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'blogImage7') setIsBlog7Uploading(true);
    else setIsBlog3Uploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalSettings(prev => ({ ...prev, [target]: reader.result as string }));
      if (target === 'blogImage7') setIsBlog7Uploading(false);
      else setIsBlog3Uploading(false);
    };
    reader.readAsDataURL(file);
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
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => titleInputRef.current?.focus(), 500);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setNewPost({ title: '', content: '', category: initialCategory, imageUrls: '', author: '관리자' });
    setUploadedPostImages([]);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const urlFromInput = newPost.imageUrls.split(/[\n,]/).map(url => url.trim()).filter(url => url !== '');
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
        alert('게시물이 성공적으로 수정되었습니다.');
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

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-black/40">
            {activeTab === 'settings' ? (
              <div className="space-y-16 max-w-4xl pb-20">
                {/* 단체 기본 정보 및 연락처 관리 */}
                <section className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">대표자 및 단체 기본정보 (연락처)</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-3 tracking-widest uppercase">대표자 성함</label>
                      <input type="text" value={localSettings.representativeName} onChange={(e) => setLocalSettings({...localSettings, representativeName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-3 tracking-widest uppercase">대표 연락처 (전화)</label>
                      <input type="text" value={localSettings.contactPhone} onChange={(e) => setLocalSettings({...localSettings, contactPhone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-3 tracking-widest uppercase">공식 이메일 주소</label>
                      <input type="email" value={localSettings.contactEmail} onChange={(e) => setLocalSettings({...localSettings, contactEmail: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold" placeholder="example@email.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-3 tracking-widest uppercase">사이트 노출 주소</label>
                      <input type="text" value={localSettings.contactAddress} onChange={(e) => setLocalSettings({...localSettings, contactAddress: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold" placeholder="경상남도 창원시..." />
                    </div>
                  </div>
                </section>

                {/* 블로그 및 센터 미디어 연동 */}
                <section className="space-y-8 border-t border-white/5 pt-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-white">블로그 및 센터 미디어 연동</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    {/* 7호점 설정 */}
                    <div className="space-y-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                      <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest flex items-center">
                         <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> 7호점 설정
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-tighter">센터 표지 사진 (JPG/PNG)</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-4 group">
                          {localSettings.blogImage7 ? (
                            <img src={localSettings.blogImage7} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px] font-black italic uppercase">No Cover Image</div>
                          )}
                          <button 
                            onClick={() => fileInputBlog7Ref.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                          >
                            {isBlog7Uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
                          </button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputBlog7Ref} onChange={(e) => handleBlogImageUpload(e, 'blogImage7')} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2">네이버 블로그 주소 (URL)</label>
                        <input type="text" value={localSettings.blogUrl7} onChange={(e) => setLocalSettings({...localSettings, blogUrl7: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 text-white text-xs" />
                      </div>
                    </div>

                    {/* 3호점 설정 */}
                    <div className="space-y-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                      <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span> 3호점 설정
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-tighter">센터 표지 사진 (JPG/PNG)</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-4 group">
                          {localSettings.blogImage3 ? (
                            <img src={localSettings.blogImage3} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px] font-black italic uppercase">No Cover Image</div>
                          )}
                          <button 
                            onClick={() => fileInputBlog3Ref.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                          >
                            {isBlog3Uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
                          </button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputBlog3Ref} onChange={(e) => handleBlogImageUpload(e, 'blogImage3')} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2">네이버 블로그 주소 (URL)</label>
                        <input type="text" value={localSettings.blogUrl3} onChange={(e) => setLocalSettings({...localSettings, blogUrl3: e.target.value})} placeholder="새 블로그 주소를 입력하세요" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 text-white text-xs" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="pt-10 border-t border-white/5">
                  <button onClick={handleSaveSettings} className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl flex items-center justify-center space-x-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>전체 설정 저장하기</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-16 max-w-4xl">
                {/* 콘텐츠 발행/수정 폼 */}
                <div 
                  ref={formRef}
                  className={`glass p-10 rounded-[2.5rem] border-white/10 transition-all duration-500 ${editingPostId ? 'bg-blue-900/10 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-white/[0.03]'}`}
                >
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="text-2xl font-black italic text-white flex items-center">
                      {editingPostId ? <Edit3 className="mr-3 text-blue-400" /> : <Plus className="mr-3 text-purple-400" />}
                      {editingPostId ? '게시물 수정 중' : '새로운 소식 발행'}
                    </h4>
                    {editingPostId && (
                      <span className="bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        EDITING MODE
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSubmitPost} className="space-y-10">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">글 제목</label>
                        <input 
                          ref={titleInputRef}
                          type="text" 
                          required 
                          value={newPost.title} 
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
                          placeholder="제목을 입력해 주세요"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white font-bold text-lg transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">카테고리</label>
                        <select 
                          value={newPost.category} 
                          onChange={(e) => setNewPost({...newPost, category: e.target.value as PostCategory})} 
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold cursor-pointer focus:border-purple-500"
                        >
                          <option value="ACTIVITY">활동 갤러리</option>
                          <option value="NOTICE">공지사항</option>
                          <option value="SPONSORSHIP">후원소식</option>
                          <option value="INQUIRY">문의사항 (Inquiry)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">상세 내용</label>
                      <textarea 
                        required 
                        value={newPost.content} 
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})} 
                        placeholder="전달하고자 하는 소식을 상세히 적어주세요."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none min-h-[250px] focus:border-purple-500 text-white leading-relaxed" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                       <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest flex items-center">
                          <ImageIcon className="w-3 h-3 mr-2" /> 이미지 업로드 (파일)
                        </label>
                        <div 
                          onClick={() => fileInputPostRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all group"
                        >
                          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputPostRef} onChange={handlePostImagesUpload} />
                          {isUploading ? <Loader2 className="w-6 h-6 text-purple-500 animate-spin" /> : <Upload className="w-6 h-6 text-gray-600 group-hover:text-purple-400 mb-2" />}
                          <span className="text-[10px] font-bold text-gray-500">이미지 파일 선택</span>
                        </div>
                        {uploadedPostImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {uploadedPostImages.map((img, i) => (
                              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10">
                                <img src={img} className="w-full h-full object-cover" alt="Uploaded Preview" />
                                <button onClick={() => removeUploadedImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest flex items-center">
                          <LinkIcon className="w-3 h-3 mr-2" /> 이미지 URL (직접 입력)
                        </label>
                        <textarea 
                          value={newPost.imageUrls} 
                          onChange={(e) => setNewPost({...newPost, imageUrls: e.target.value})} 
                          placeholder="이미지 주소를 입력하세요 (엔터로 구분)"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white text-xs min-h-[128px]" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-4">
                      <button 
                        type="submit" 
                        className={`flex-1 py-5 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2 ${editingPostId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        {editingPostId ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                        <span>{editingPostId ? '수정 사항 저장 및 완료' : '지금 바로 발행하기'}</span>
                      </button>
                      {editingPostId && (
                        <button 
                          onClick={handleCancelEdit} 
                          type="button" 
                          className="px-8 py-5 rounded-2xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center space-x-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>수정 취소</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-8">
                  <h4 className="text-2xl font-black text-white flex items-center">
                    <FileText className="mr-3 text-purple-500" /> 발행된 소식 목록 ({posts.length})
                  </h4>
                  <div className="grid gap-4">
                    {posts.length > 0 ? (
                      posts.map(post => (
                        <div 
                          key={post.id} 
                          className={`flex items-center justify-between p-6 glass rounded-2xl border-white/5 group hover:bg-white/[0.06] transition-all bg-white/[0.02] ${editingPostId === post.id ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
                        >
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                              {post.imageUrls && post.imageUrls.length > 0 ? (
                                <img src={post.imageUrls[0]} className="w-full h-full object-cover" alt={post.title} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700 uppercase font-black text-[10px]">No Img</div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                  post.category === 'NOTICE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                  post.category === 'ACTIVITY' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                  post.category === 'INQUIRY' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  'bg-pink-500/10 text-pink-400 border-pink-500/20'
                                }`}>{post.category}</span>
                                <span className="text-[10px] text-gray-500 font-bold">{post.date}</span>
                              </div>
                              <h5 className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{post.title}</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={(e) => handleEditClick(e, post)} 
                              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${editingPostId === post.id ? 'bg-blue-600 text-white' : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'}`}
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>수정</span>
                            </button>
                            <button 
                              onClick={(e) => handleDeletePost(e, post.id)} 
                              className="flex items-center space-x-2 px-5 py-3 bg-red-600/10 text-red-400 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>삭제</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center text-gray-600 border border-dashed border-white/10 rounded-[2.5rem]">
                        현재 발행된 소식이 없습니다.
                      </div>
                    )}
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
