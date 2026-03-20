
import React from 'react';
import { SiteSettings } from '../types';
import { Target, Heart, History, Quote, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutProps {
  settings: SiteSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  const historyLines = settings.history.split('\n').filter(line => line.trim() !== '');

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">단체 소개</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-8" />
          <p className="text-xl text-gray-600 leading-relaxed">
            {settings.siteName}은 주민이 주도하여 행복한 지역공동체를 만들어가는 비영리 민간단체입니다.
          </p>
        </motion.div>

        {/* Representative Greeting */}
        <div id="greeting" className="grid lg:grid-cols-2 gap-16 items-center mb-32 scroll-mt-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={settings.representativePhoto} 
                alt="Representative" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-2xl font-bold">{settings.representativeName}</p>
              <p className="text-sm opacity-80">{settings.siteName} 대표</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900">대표 인사말</h3>
            <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {settings.representativeGreeting}
            </div>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-blue-50 rounded-2xl border border-blue-100"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">우리의 비전</h4>
            <p className="text-gray-600 leading-relaxed">{settings.vision}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-10 bg-orange-50 rounded-2xl border border-orange-100"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">우리의 미션</h4>
            <p className="text-gray-600 leading-relaxed">{settings.mission}</p>
          </motion.div>
        </div>

        {/* History */}
        <div id="history" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">단체 연혁</h3>
            <p className="text-gray-500">꿈뜨레가 걸어온 소중한 발자취입니다.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-blue-100 ml-4 md:ml-0">
              {historyLines.map((line, index) => {
                const firstSpaceIndex = line.indexOf(' ');
                const datePart = firstSpaceIndex !== -1 ? line.substring(0, firstSpaceIndex) : line;
                const contentPart = firstSpaceIndex !== -1 ? line.substring(firstSpaceIndex + 1) : '';

                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-10 ml-8 relative"
                  >
                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm" />
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                      <span className="text-blue-600 font-bold text-lg mb-1 md:mb-0 min-w-[100px]">{datePart}</span>
                      <p className="text-gray-700 font-medium">{contentPart}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
