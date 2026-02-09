
import React, { useState } from 'react';
import { Post } from '../types';
import { Megaphone, ChevronRight, X, Image as ImageIcon, Plus } from 'lucide-react';

interface NoticeBoardProps {
  posts: Post[];
  isAdmin: boolean;
  onWrite: () => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ posts, isAdmin, onWrite }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <section className="pt-40 pb-32 bg-white/50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-purple-900 rounded-[1.5rem] shadow-xl">
                <Megaphone className="text-white w-9 h-9" />
              </div>
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-purple-900 font-black mb-1">Notice Center</h2>
                <h3 className="text-4xl font-black text-[#111111]">공지사항</h3>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={onWrite}
                className="flex items-center space-x-2 bg-[#111111] hover:bg-purple-900 text-white px-7 py-4 rounded-2xl font-black transition-all shadow-2xl"
              >
                <Plus className="w-5 h-5" />
                <span>글쓰기</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => setSelectedPost(post)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-10 glass rounded-[2.5rem] border-purple-100 hover:bg-white hover:shadow-2xl transition-all cursor-pointer bg-white/80"
                >
                  <div className="mb-6 md:mb-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-xs font-black text-purple-900">{post.date}</span>
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <span className="flex items-center text-[9px] text-white font-black uppercase tracking-widest bg-purple-900 px-3 py-1 rounded-full">
                          <ImageIcon className="w-3 h-3 mr-1.5" /> {post.imageUrls.length} Photos
                        </span>
                      )}
                    </div>
                    <h4 className="text-2xl font-black text-[#111111] group-hover:text-purple-900 transition-colors tracking-tight">{post.title}</h4>
                  </div>
                  <div className="flex items-center text-purple-900 text-sm font-black group-hover:translate-x-2 transition-transform">
                    상세보기 <ChevronRight className="ml-2 w-6 h-6" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 text-gray-400 glass rounded-[2.5rem] bg-white border-purple-50 shadow-inner">
                등록된 공지사항이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-white border border-purple-200 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
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
                    <img key={i} src={url} alt={`Post Image ${i+1}`} className="w-full rounded-[2.5rem] border border-purple-100 shadow-2xl" />
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

export default NoticeBoard;
