
import React, { useState } from 'react';
import { Post, SiteSettings } from '../types';
import { Heart, ArrowUpRight, Calendar, Users, Plus, X, CreditCard } from 'lucide-react';

interface SponsorshipProps {
  posts: Post[];
  settings: SiteSettings;
  isAdmin: boolean;
  onWrite: () => void;
}

const Sponsorship: React.FC<SponsorshipProps> = ({ posts, settings, isAdmin, onWrite }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <section className="pt-40 pb-32 bg-white/20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-purple-900 font-black mb-5">Sponsorship Results</h2>
            <h3 className="text-5xl md:text-6xl font-black mb-10 text-[#111111]">따뜻한 마음, <br/> 후원 소식</h3>
            <p className="text-gray-800 text-xl font-medium leading-relaxed">
              여러분의 정성 어린 후원은 창원의 이웃들에게 <span className="text-purple-900 font-black underline decoration-purple-300">실질적인 희망</span>이 됩니다. 
              {isAdmin && (
                <button 
                  onClick={onWrite}
                  className="mt-8 flex items-center space-x-2 bg-purple-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-2xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>소식 발행하기</span>
                </button>
              )}
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

            <button className="w-full bg-[#111111] text-white py-5 rounded-2xl font-black text-base hover:bg-purple-900 transition-all shadow-2xl">
              정기 후원 신청하기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className="group glass rounded-[3rem] border-purple-100 overflow-hidden flex flex-col cursor-pointer transition-all hover:bg-white hover:shadow-[0_32px_80px_-16px_rgba(91,33,182,0.15)] bg-white/90">
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
                <div className="flex items-center text-[10px] text-purple-900 font-black uppercase tracking-[0.2em] mb-5">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> {post.date}
                </div>
                <h4 className="text-2xl font-black text-[#111111] mb-5 group-hover:text-purple-900 transition-colors tracking-tight">{post.title}</h4>
                <p className="text-base text-gray-700 line-clamp-2 font-medium mb-8 leading-relaxed">
                  {post.content}
                </p>
                <div className="text-sm font-black flex items-center text-purple-900 group-hover:translate-x-2 transition-transform">
                  자세히 보기 <ArrowUpRight className="ml-2 w-5 h-5" />
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
              <div>
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-[0.4em]">Sponsorship Outcome</span>
                <h3 className="text-3xl font-black mt-2 text-[#111111] tracking-tight">{selectedPost.title}</h3>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 hover:bg-purple-100 rounded-full text-black transition-all hover:rotate-90"><X className="w-8 h-8" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
              <p className="text-gray-900 text-xl leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.content}</p>
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
    </section>
  );
};

export default Sponsorship;
