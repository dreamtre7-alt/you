
import React from 'react';
import { SiteSettings } from '../types';
import { motion } from 'motion/react';
import { Camera, Calendar, MapPin } from 'lucide-react';

interface ActivitiesProps {
  settings: SiteSettings;
}

const Activities: React.FC<ActivitiesProps> = ({ settings }) => {
  const activities = settings.activityPhotos || [];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Camera className="w-4 h-4" />
            <span>단체 활동 갤러리</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            꿈뜨레의 <span className="text-blue-600">다양한 활동</span>을 소개합니다
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            지역사회와 함께 성장하며 나눔을 실천하는 꿈뜨레 지역공동체의 발자취입니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={activity.imageUrl} 
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="flex items-center space-x-4 text-white/90 text-xs font-medium">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {activity.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {activity.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {activity.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
