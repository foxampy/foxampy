"use client";

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

export default function AboutSection() {
  const { language } = useI18n();

  return (
    <section id="about" className="relative min-h-screen lg:flex lg:items-center overflow-hidden">
      {/* Mobile: Photo bottom-left, text top-right */}
      <div className="lg:hidden relative min-h-screen pt-16">
        {/* Photo - Smaller at bottom-left */}
        <motion.div 
          className="absolute left-0 bottom-0 h-[40vh] w-[45vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-left-bottom grayscale"
            style={{
              backgroundImage: `url('/photo/слева.png')`,
              backgroundPosition: 'left bottom',
            }}
          />
          {/* Gradient from photo to background */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#030303]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#030303] to-transparent" />
        </motion.div>

        {/* Text Content - Top-right, higher position */}
        <motion.div 
          className="absolute top-20 right-6 left-6 flex flex-col items-end z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 mb-3
                       border border-white/20 bg-white/[0.03] backdrop-blur-sm
                       rounded-full"
          >
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
              {language === 'ru' ? 'Креативный инноватор' : 'Creative Innovator'}
            </span>
          </motion.div>
          
          {/* Name */}
          <h1 className="text-4xl font-mono text-white leading-none mb-2 tracking-tight text-right">
            Foxampy
          </h1>

          {/* Real name */}
          <p className="text-xs font-mono text-white/40 tracking-[0.2em] uppercase mb-4 text-right">
            Timur Cadik
          </p>

          {/* Full Description */}
          <p className="text-sm text-white/50 leading-relaxed max-w-[280px] font-light text-right">
            {language === 'ru' 
              ? 'Создаю устойчивые системы на пересечении бизнеса, дизайна и технологий. Работаю с комплексными проектами требующими системного подхода и междисциплинарного мышления'
              : 'Creating sustainable systems at the intersection of business, design and technology. Working with complex projects requiring a systematic approach and interdisciplinary thinking'
            }
          </p>
        </motion.div>
      </div>

      {/* Desktop: Grid layout with right-aligned text */}
      <div className="hidden lg:grid w-full grid-cols-12 min-h-screen">
        {/* Left Photo Container */}
        <motion.div 
          className="col-span-2 relative h-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[80vh] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
            style={{
              backgroundImage: `url('/photo/слева.png')`,
              backgroundPosition: 'center 20%',
            }}
          />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#030303]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030303] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030303] to-transparent" />
        </motion.div>

        {/* Center Content - Right-aligned */}
        <motion.div 
          className="col-span-10 flex flex-col items-end justify-center px-12 py-12 relative z-20 pr-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 
                       border border-white/20 bg-white/[0.03] backdrop-blur-sm
                       rounded-full transition-all duration-300
                       hover:border-white/40"
          >
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
              {language === 'ru' ? 'Креативный инноватор' : 'Creative Innovator'}
            </span>
          </motion.div>
          
          <h1 className="text-7xl lg:text-8xl font-mono text-white leading-none mb-4 tracking-tight text-right">
            Foxampy
          </h1>

          <p className="text-base font-mono text-white/40 tracking-[0.2em] uppercase mb-8 text-right">
            Timur Cadik
          </p>

          <p className="text-lg text-white/50 leading-relaxed max-w-lg font-light text-right mb-8">
            {language === 'ru'
              ? 'Создаю устойчивые системы на пересечении бизнеса, дизайна и технологий. Работаю с комплексными проектами требующими системного подхода и междисциплинарного мышления'
              : 'Creating sustainable systems at the intersection of business, design and technology. Working with complex projects requiring a systematic approach and interdisciplinary thinking'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
}
