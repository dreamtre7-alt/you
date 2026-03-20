
import React from 'react';
import { SiteSettings, Post } from '../types';
import { ChevronRight, Heart, Phone, Mail, Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeSectionsProps {
  settings: SiteSettings;
  posts: Post[];
  setView: (view: any) => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ settings, posts, setView }) => {
  // Filter notices from posts
  const notices = posts.filter(p => p.category === 'NOTICES');
  
  // Use real notices if available, otherwise mock for visual
  const displayNotices = notices.length > 0 ? notices.slice(0, 4) : [
    { id: '1', title: '2026년 1차 운영위원회 회의록', date: '2026-03-10' },
    { id: '2', title: '2025년 함께사는마을 후원금.품 수입.사용 내역 보고..', date: '2026-03-09' },
    { id: '3', title: '2025년 함께사는마을 결산공고', date: '2026-03-09' },
    { id: '4', title: '2025년 행복한집 후원금(품) 수입 및 사용내역 공고..', date: '2026-02-11' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Notice Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">공지사항</h3>
              </div>
              <button 
                onClick={() => setView('NOTICES')}
                className="text-gray-400 hover:text-blue-600 transition-colors flex items-center text-sm font-medium"
              >
                더보기 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <ul className="space-y-4">
              {displayNotices.map((notice: any) => (
                <li 
                  key={notice.id} 
                  className="group cursor-pointer"
                  onClick={() => setView('NOTICES')}
                >
                  <div className="flex justify-between items-start space-x-4">
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1 text-sm font-medium">
                      {notice.title}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                      {notice.date}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100 mt-4 group-last:hidden" />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Donation/Volunteer Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex flex-col items-center text-center justify-center group hover:bg-blue-600 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors">후원/자원봉사</h3>
            <p className="text-gray-600 mb-8 group-hover:text-blue-50 transition-colors text-sm leading-relaxed">
              모든 사람은 사랑을 주고 받으며,<br />
              선한 일을 하고 싶어합니다.
            </p>
            <button 
              onClick={() => setView('SPONSORSHIP_NEWS')}
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              More →
            </button>
          </motion.div>

          {/* Customer Center Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-orange-500 rounded-3xl p-8 text-white flex flex-col justify-center relative overflow-hidden"
          >
            {/* Decorative background circle */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            
            <h3 className="text-2xl font-bold mb-8">꿈뜨레지역공동체사무실</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wider mb-1">전화번호</p>
                  <p className="text-xl font-bold">{settings.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wider mb-1">이메일</p>
                  <p className="text-lg font-medium">{settings.contactEmail}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HomeSections;
