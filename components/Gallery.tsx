
import React, { useState, useRef } from 'react';
import { Post } from '../types';
import { Calendar, ArrowUpRight, Plus, X, Image as ImageIcon, Upload, CheckCircle2, Loader2 } from 'lucide-react';

interface GalleryProps {
  posts: Post[];
  isAdmin?: boolean;
  onWrite?: () => void;
  onAddPost?: (post: Post) => void;
}

const Gallery: React.FC<GalleryProps> = ({ posts, isAdmin, onWrite, onAddPost }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Quick Add State
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly cast to File[] to avoid 'unknown' type inference which causes Blob compatibility issues
    const fileArray = Array.from(files) as File[];
    setIsUploading(true);

    const promises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        // Fix: 'file' is now correctly typed as 'File' (which inherits from 'Blob')
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setPreviewImages(prev => [...prev, ...base64Images]);
      setIsUploading(false);
    });
  };

  const handleSubmitQuickAdd = () => {
    if (!newTitle || !newContent || previewImages.length === 0) {
      alert('제목, 내용, 그리고 최소 한 장의 사진이 필요합니다.');
      return;
    }

    if (onAddPost) {
      onAddPost({
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        category: 'ACTIVITY',
        imageUrls: previewImages,
        date: new Date().toISOString().split('T')[0]
      });
      
      // Reset
      setNewTitle('');
      setNewContent('');
      setPreviewImages([]);
      setIsAdding(false);
      alert('활동이 성공적으로 기록되었습니다!');
    }
  };

  return (
    <section className="pt-40 pb-32 bg-white/10 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-purple-600 font-bold mb-4">Activities</h2>
            <h3 className="text-4xl font-black text-purple-900">활동 갤러리</h3>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600 max-w-xs font-light text-sm hidden md:block">
              창원의 곳곳에서 꿈뜨레가 만들어낸 변화와 즐거운 소통의 순간들입니다.
            </p>
            {isAdmin && !isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center space-x-2 bg-purple-900 text-white px-6 py-3 rounded-xl font-black transition-all shadow-xl hover:bg-black active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>새 활동 등록</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quick Add Form Card (Admin Only) */}
          {isAdmin && isAdding && (
            <div className="group relative overflow-hidden rounded-[2rem] glass border-purple-300 shadow-2xl bg-white p-8 flex flex-col animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-widest">New Activity</span>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-4 flex-1">
                <input 
                  type="text" 
                  placeholder="활동 제목 입력"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 font-bold text-sm"
                />
                
                <textarea 
                  placeholder="어떤 활동이었나요? 간단히 적어주세요."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-sm min-h-[100px] resize-none"
                />

                <div className="relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-purple-200 rounded-xl py-6 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-purple-400 group-hover:text-purple-600" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-purple-900">사진 첨부하기</span>
                      </>
                    )}
                  </button>
                </div>

                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {previewImages.map((img, i) => (
                      <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-purple-100">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center ml-auto">
                      <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
                        총 {previewImages.length}장
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleSubmitQuickAdd}
                className="w-full mt-6 bg-purple-900 text-white py-4 rounded-xl font-black flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>활동 발행하기</span>
              </button>
            </div>
          )}

          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="group relative overflow-hidden rounded-[2rem] glass border-purple-100 shadow-sm bg-white/90 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={(post.imageUrls && post.imageUrls.length > 0) ? post.imageUrls[0] : 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800'} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {post.imageUrls && post.imageUrls.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center border border-white/10">
                      <ImageIcon className="w-3 h-3 mr-1.5" /> +{post.imageUrls.length - 1}
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center text-xs text-purple-600 mb-3 space-x-2 font-bold">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-purple-950 mb-4 leading-tight group-hover:text-purple-700 transition-colors line-clamp-1">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 font-medium mb-6 leading-relaxed">
                    {post.content}
                  </p>
                  <button className="flex items-center text-sm font-black text-purple-600 group-hover:translate-x-1 transition-transform">
                    상세보기 <ArrowUpRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            !isAdding && (
              <div className="col-span-full py-24 text-center text-gray-400 glass rounded-[2rem] bg-white/50 border-purple-100 border-dashed">
                등록된 활동 소식이 없습니다.
              </div>
            )
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-white border border-purple-200 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
              <div>
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-[0.3em]">{selectedPost.date}</span>
                <h3 className="text-3xl font-black mt-2 text-[#111111] tracking-tight">{selectedPost.title}</h3>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 hover:bg-purple-100 rounded-full transition-all text-black hover:rotate-90"><X className="w-8 h-8" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
              <p className="text-gray-900 text-xl leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.content}</p>
              
              {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedPost.imageUrls.map((url, i) => (
                    <div key={i} className="group overflow-hidden rounded-[2.5rem] border border-purple-100 shadow-lg">
                      <img 
                        src={url} 
                        alt={`Activity Photo ${i+1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
