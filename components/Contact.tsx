
import React, { useState } from 'react';
import { SiteSettings, Post } from '../types';
import { Send, MapPin, Phone, Mail, MessageSquare, ChevronRight, X, Calendar, User } from 'lucide-react';

interface ContactProps {
  settings: SiteSettings;
  posts: Post[];
  onAddPost: (post: Post) => void;
}

const Contact: React.FC<ContactProps> = ({ settings, posts, onAddPost }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, subject, message } = formData;
    
    if (!name || !phone || !subject || !message) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    const newInquiry: Post = {
      id: Date.now().toString(),
      title: subject,
      content: message,
      author: name,
      date: new Date().toISOString().split('T')[0],
      category: 'INQUIRY'
    };

    onAddPost(newInquiry);
    alert('문의사항이 성공적으로 등록되었습니다.');
    setFormData({ name: '', phone: '', subject: '', message: '' });
  };

  return (
    <section className="pt-40 pb-32 bg-white/10 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-purple-600 font-black mb-4">Contact Board</h2>
              <h3 className="text-4xl md:text-5xl font-black mb-10 text-purple-900">문의하기 게시판</h3>
              
              <p className="text-gray-600 text-lg mb-12 font-medium leading-relaxed">
                꿈뜨레는 여러분의 목소리에 귀를 기울입니다. <br/>
                문의하신 내용은 모든 분들이 함께 보실 수 있는 공개 게시판에 등록됩니다.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center flex-shrink-0 border-purple-100 bg-white shadow-sm">
                    <MapPin className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black mb-1 text-purple-900">찾아오시는 길</h4>
                    <p className="text-sm text-gray-500 font-medium">{settings.contactAddress}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center flex-shrink-0 border-purple-100 bg-white shadow-sm">
                    <Phone className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black mb-1 text-purple-900">전화 번호</h4>
                    <p className="text-sm text-gray-500 font-medium">{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center flex-shrink-0 border-purple-100 bg-white shadow-sm">
                    <Mail className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black mb-1 text-purple-900">공식 이메일</h4>
                    <p className="text-sm text-gray-500 font-medium">{settings.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-10 md:p-14 rounded-[3rem] border-purple-100 bg-white shadow-2xl relative">
              <h4 className="text-xl font-black mb-8 text-purple-900 flex items-center">
                <MessageSquare className="mr-3 w-6 h-6" /> 새 문의 작성하기
              </h4>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">성함</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 font-bold" placeholder="홍길동" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">연락처</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 font-bold" placeholder="010-0000-0000" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">문의 제목</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 font-bold" placeholder="문의 제목을 입력하세요." required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">내용</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 min-h-[150px] font-medium" placeholder="상세한 문의 내용을 입력해 주세요." required></textarea>
                </div>
                <button type="submit" className="w-full bg-purple-900 text-white py-5 rounded-2xl font-black flex items-center justify-center hover:bg-black transition-all shadow-xl active:scale-95">
                  게시판에 등록하기 <Send className="ml-2 w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-black text-purple-950">최근 문의 내역 ({posts.length})</h4>
              <p className="text-xs text-gray-400 font-medium">* 모든 문의 내용은 공개되어 있습니다.</p>
            </div>

            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} onClick={() => setSelectedPost(post)} className="glass p-8 rounded-[2.5rem] border-purple-50 bg-white/80 hover:bg-white hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-black text-xs">
                      {post.author?.[0] || '익'}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{post.title}</h5>
                      <div className="flex items-center space-x-4 mt-1 text-[10px] text-gray-400">
                        <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-900 text-xs font-black mt-4 md:mt-0 group-hover:translate-x-2 transition-transform uppercase tracking-widest">
                    내용 보기 <ChevronRight className="ml-1 w-5 h-5" />
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="py-20 text-center text-gray-400 border border-dashed border-purple-200 rounded-[3rem]">
                  등록된 문의사항이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-white border border-purple-200 w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-purple-900 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                  {selectedPost.author?.[0]}
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-900 uppercase tracking-widest">{selectedPost.date} | 작성자: {selectedPost.author}</span>
                  <h3 className="text-2xl font-black mt-1 text-[#111111]">{selectedPost.title}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 hover:bg-purple-100 rounded-full text-black hover:rotate-90 transition-all"><X className="w-8 h-8" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <p className="text-gray-900 text-xl leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.content}</p>
            </div>
            <div className="p-8 border-t border-purple-50 bg-purple-50/20 text-center">
              <p className="text-xs text-gray-400 font-medium">관리자의 답변은 추후 댓글 기능으로 업데이트될 예정입니다.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
