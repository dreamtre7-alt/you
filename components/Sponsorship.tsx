
import React, { useState } from 'react';
import { Post, SiteSettings, PostCategory } from '../types';
import { Heart, ArrowUpRight, Calendar, Users, Plus, X, CreditCard, Image as ImageIcon, Trash2, Sparkles, Landmark, CheckCircle2, Gift, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SponsorshipProps {
  posts: Post[];
  settings: SiteSettings;
  onAddPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  currentCategory: PostCategory;
  isAdmin: boolean;
}

const Sponsorship: React.FC<SponsorshipProps> = ({ posts, settings, onAddPost, onDeletePost, currentCategory, isAdmin }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrls: ['']
  });
  const [uploading, setUploading] = useState(false);

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
    
    const isReport = currentCategory === 'SPONSORSHIP_REPORT';
    const isNotice = currentCategory === 'NOTICES';
    const title = (isReport || isNotice) ? (newPost.title || (isReport ? '후원보고' : '공지사항')) : newPost.title;
    const content = newPost.content;
    const finalImageUrls = newPost.imageUrls.map(url => url.trim()).filter(url => url !== '');

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    if (isReport && finalImageUrls.length === 0) {
      alert('최소 한 장의 사진을 추가해주세요.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: title,
      content,
      date: isReport ? '' : new Date().toLocaleDateString('ko-KR'),
      category: currentCategory,
      imageUrls: finalImageUrls
    };

    onAddPost(post);
    setIsAddingPost(false);
    setNewPost({ title: '', content: '', imageUrls: [''] });
  };

  const getCategoryInfo = () => {
    switch (currentCategory) {
      case 'SPONSORSHIP_NEWS':
        return { title: '후원 소식', label: 'Sponsorship News' };
      case 'SPONSORSHIP_REPORT':
        return { title: '후원 보고', label: 'Sponsorship Report' };
      case 'NOTICES':
        return { title: '공지사항', label: 'Notices' };
      default:
        return { title: '소식', label: 'News' };
    }
  };

  const { title: categoryTitle, label: categoryLabel } = getCategoryInfo();

  const sponsorshipTypes = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "정기 후원",
      description: "매월 정기적인 나눔으로 아이들의 꿈을 지속적으로 응원합니다.",
      color: "from-rose-50 to-rose-100/50",
      accent: "text-rose-600"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "일시 후원",
      description: "특별한 날, 소중한 마음을 담아 아이들에게 기쁨을 선물합니다.",
      color: "from-amber-50 to-amber-100/50",
      accent: "text-amber-600"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "물품 후원",
      description: "아이들에게 필요한 도서, 교구, 간식 등 따뜻한 마음을 전달합니다.",
      color: "from-emerald-50 to-emerald-100/50",
      accent: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/30">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-8"
          >
            <Heart className="w-3 h-3" />
            <span>{categoryLabel}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight"
          >
            따뜻한 나눔, <br/>
            <span className="text-blue-700">{categoryTitle}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            여러분의 소중한 나눔은 지역사회 아이들이 <br/>
            더 큰 꿈을 꾸고 건강하게 성장하는 든든한 밑거름이 됩니다.
          </motion.p>
        </div>
      </section>

      {/* Sponsorship Types - Only show on News page for context */}
      {currentCategory === 'SPONSORSHIP_NEWS' && (
        <section className="container mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sponsorshipTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${type.accent} shadow-sm mb-8 group-hover:scale-110 transition-transform`}>
                  {type.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{type.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {type.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-blue-700 group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Account Info */}
      {currentCategory !== 'NOTICES' && (
        <section className="container mx-auto px-6 mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-blue-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <Landmark className="w-8 h-8 text-blue-300" />
                <h2 className="text-3xl md:text-4xl font-bold">후원 계좌 안내</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {settings.sponsorshipAccounts.map((account, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-blue-300 text-xs uppercase tracking-widest font-bold">{account.bankName}</p>
                      <p className="text-2xl md:text-3xl font-bold tracking-tight">{account.accountNumber}</p>
                      <p className="text-sm text-blue-200">예금주: {account.accountHolder}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col justify-center space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mt-1" />
                    <p className="text-sm text-blue-100 leading-relaxed">
                      기부금 영수증 발급이 가능합니다. <br/>
                      (연말정산 세액공제 혜택)
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mt-1" />
                    <p className="text-sm text-blue-100 leading-relaxed">
                      모든 후원금은 아이들의 교육과 <br/>
                      복지를 위해 투명하게 사용됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Posts Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-blue-700 font-bold mb-4">Transparency</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900">{categoryTitle}</h3>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsAddingPost(true)}
                className="flex items-center space-x-2 bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>새 게시물 작성</span>
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => (
                <motion.div
                  layout
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative"
                  onClick={() => setSelectedPost(post)}
                >
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePost(post.id);
                      }}
                      className="absolute top-6 left-6 z-20 p-3 bg-white/90 backdrop-blur-md text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={post.imageUrls[0]} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt={post.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      {post.imageUrls.length > 1 && (
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-blue-900 flex items-center shadow-sm">
                          <ImageIcon className="w-3.5 h-3.5 mr-2" /> +{post.imageUrls.length - 1} Photos
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50">
                        {post.category !== 'SPONSORSHIP_REPORT' ? post.date : 'Report'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h4>
                    {post.category !== 'SPONSORSHIP_REPORT' && (
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                        {post.content}
                      </p>
                    )}
                    <div className="pt-6 border-t border-slate-50 flex items-center text-xs font-bold text-blue-900 group-hover:translate-x-2 transition-transform cursor-pointer">
                      <span>자세히 보기</span>
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.4em]">Sponsorship Outcome</span>
                  <h3 className="text-3xl font-bold mt-2 text-slate-900">{selectedPost.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)} 
                  className="p-3 hover:bg-white rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-8 h-8 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                {selectedPost.category !== 'SPONSORSHIP_REPORT' && (
                  <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                )}
                {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                  <div className="grid grid-cols-1 gap-10">
                    {selectedPost.imageUrls.map((url, i) => (
                      <img key={i} src={url} alt={`Sponsor Image ${i+1}`} className="w-full rounded-3xl border border-slate-100 shadow-xl" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Post Modal */}
      <AnimatePresence>
        {isAddingPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
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
                  {currentCategory === 'SPONSORSHIP_NEWS' ? '새 후원 소식 올리기' : '후원 보고 사진 올리기'}
                </h3>
                <button 
                  onClick={() => setIsAddingPost(false)} 
                  className="p-3 hover:bg-white rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-8 h-8 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddPost} className="p-10 space-y-6">
                {currentCategory !== 'SPONSORSHIP_REPORT' && (
                  <>
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
                  </>
                )}

                {(currentCategory === 'SPONSORSHIP_REPORT' || currentCategory === 'NOTICES') ? (
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
                              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">이미지 URL</label>
                    <div className="space-y-3">
                      {newPost.imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="relative flex-1">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              value={url}
                              onChange={e => handleImageUrlChange(index, e.target.value)}
                              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            className="p-4 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={handleAddImageUrl}
                        className="flex items-center text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" /> 사진 추가하기
                      </button>
                    </div>
                  </div>
                )}
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

export default Sponsorship;
