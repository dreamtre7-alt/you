
import React, { useState } from 'react';
import { Post, SiteSettings, PostCategory } from '../types';
import { Heart, ArrowUpRight, Calendar, Users, Plus, X, CreditCard, Image as ImageIcon, Trash2 } from 'lucide-react';

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
    const title = isReport ? '후원보고' : (newPost.title || '후원보고');
    const content = isReport ? '후원보고 사진첩입니다.' : newPost.content;
    const finalImageUrls = newPost.imageUrls.map(url => url.trim()).filter(url => url !== '');

    if (!isReport && (!title || !content)) return;
    if (finalImageUrls.length === 0) {
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

  const categoryTitle = currentCategory === 'SPONSORSHIP_NEWS' ? '후원 소식' : '후원 보고';
  const categoryLabel = currentCategory === 'SPONSORSHIP_NEWS' ? 'Sponsorship News' : 'Sponsorship Report';

  return (
    <section className="pt-40 pb-32 bg-white/20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-purple-900 font-black mb-5">{categoryLabel}</h2>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-5xl md:text-6xl font-black text-[#111111]">따뜻한 마음, <br/> {categoryTitle}</h3>
              {isAdmin && (
                <button 
                  onClick={() => setIsAddingPost(true)}
                  className="p-4 bg-purple-900 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="게시물 올리기"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
            <p className="text-gray-800 text-xl font-medium leading-relaxed">
              여러분의 정성 어린 후원은 창원의 이웃들에게 <span className="text-purple-900 font-black underline decoration-purple-300">실질적인 희망</span>이 됩니다. 
            </p>
          </div>
          
          <div className="glass p-10 rounded-[3rem] border-purple-200 bg-white shadow-[0_32px_64px_-12px_rgba(91,33,182,0.1)] max-w-sm w-full">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Heart className="text-purple-900 w-7 h-7 animate-pulse" />
              </div>
              <span className="font-black text-xl text-[#111111]">후원 계좌 안내</span>
            </div>
            
            <div className="space-y-6 mb-8">
              {settings.sponsorshipAccounts.map((account, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 group hover:bg-purple-100 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-[10px] font-black text-purple-900 uppercase tracking-widest">{account.bankName}</span>
                  </div>
                  <p className="text-sm font-black text-gray-900 leading-tight mb-1">{account.accountNumber}</p>
                  <p className="text-[10px] font-bold text-gray-500">예금주: {account.accountHolder}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div key={post.id} className="group glass rounded-[3rem] border-purple-100 overflow-hidden flex flex-col cursor-pointer transition-all hover:bg-white hover:shadow-[0_32px_80px_-16px_rgba(91,33,182,0.15)] bg-white/90 relative">
              {isAdmin && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePost(post.id);
                  }}
                  className="absolute top-5 left-5 z-20 p-3 bg-red-500/80 backdrop-blur-xl text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                  title="게시물 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div onClick={() => setSelectedPost(post)} className="flex flex-col h-full">
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={post.imageUrls[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    {post.imageUrls.length > 1 && (
                      <div className="absolute top-5 right-5 bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-white flex items-center border border-white/10">
                        <Users className="w-3.5 h-3.5 mr-2" /> +{post.imageUrls.length - 1} Photos
                      </div>
                    )}
                  </div>
                )}
                <div className="p-10">
                  {post.category !== 'SPONSORSHIP_REPORT' && (
                    <div className="flex items-center text-[10px] text-purple-900 font-black uppercase tracking-[0.2em] mb-5">
                      <Calendar className="w-3.5 h-3.5 mr-2" /> {post.date}
                    </div>
                  )}
                  <h4 className="text-2xl font-black text-[#111111] mb-5 group-hover:text-purple-900 transition-colors tracking-tight">{post.title}</h4>
                  {post.category !== 'SPONSORSHIP_REPORT' && (
                    <p className="text-base text-gray-700 line-clamp-2 font-medium mb-8 leading-relaxed">
                      {post.content}
                    </p>
                  )}
                  <div className="text-sm font-black flex items-center text-purple-900 group-hover:translate-x-2 transition-transform">
                    자세히 보기 <ArrowUpRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-white border border-purple-100 w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-black text-purple-900 uppercase tracking-[0.4em]">Sponsorship Outcome</span>
                  <h3 className="text-3xl font-black mt-2 text-[#111111] tracking-tight">{selectedPost.title}</h3>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => {
                      onDeletePost(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 font-black text-sm"
                    title="게시물 삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                    삭제하기
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 hover:bg-purple-100 rounded-full text-black transition-all hover:rotate-90"><X className="w-8 h-8" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
              {selectedPost.category !== 'SPONSORSHIP_REPORT' && (
                <p className="text-gray-900 text-xl leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.content}</p>
              )}
              {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                <div className="grid grid-cols-1 gap-10">
                  {selectedPost.imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Sponsor Image ${i+1}`} className="w-full rounded-[3rem] border border-purple-100 shadow-2xl" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Add Post Modal */}
      {isAddingPost && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setIsAddingPost(false)}>
          <div className="bg-white border border-purple-100 w-full max-w-2xl rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
              <h3 className="text-3xl font-black text-[#111111] tracking-tight">
                {currentCategory === 'SPONSORSHIP_NEWS' ? '새 후원 소식 올리기' : '후원 보고 사진 올리기'}
              </h3>
              <button onClick={() => setIsAddingPost(false)} className="p-3 hover:bg-purple-100 rounded-full text-black transition-all hover:rotate-90"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleAddPost} className="p-10 space-y-6">
              {currentCategory === 'SPONSORSHIP_NEWS' && (
                <>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">제목</label>
                    <input 
                      type="text" 
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-purple-100 focus:ring-2 focus:ring-purple-900 outline-none font-medium"
                      placeholder="제목을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">내용</label>
                    <textarea 
                      value={newPost.content}
                      onChange={e => setNewPost({...newPost, content: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-purple-100 focus:ring-2 focus:ring-purple-900 outline-none font-medium h-40 resize-none"
                      placeholder="내용을 입력하세요"
                      required
                    />
                  </div>
                </>
              )}

              {currentCategory === 'SPONSORSHIP_REPORT' ? (
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">사진 첨부</label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {newPost.imageUrls.filter(url => url !== '').map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-purple-100 group">
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
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors">
                        <Plus className="w-8 h-8 text-purple-300 mb-2" />
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Upload</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                    {uploading && <p className="text-xs text-purple-600 font-bold animate-pulse">사진을 읽어오는 중입니다...</p>}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">이미지 URL</label>
                  <div className="space-y-3">
                    {newPost.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            value={url}
                            onChange={e => handleImageUrlChange(index, e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-purple-100 focus:ring-2 focus:ring-purple-900 outline-none font-medium"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={handleAddImageUrl}
                      className="flex items-center text-sm font-black text-purple-900 hover:text-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" /> 사진 추가하기
                    </button>
                  </div>
                </div>
              )}
              <button type="submit" className="w-full bg-purple-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-[#111111] transition-all shadow-xl">
                게시하기
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sponsorship;
