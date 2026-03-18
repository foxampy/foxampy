"use client";

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';

interface Company {
  id: string;
  logoName: string;
  url: string;
  role: string;
  roleEn: string;
  achievements: string[];
  achievementsEn: string[];
}

export default function ExperienceSection() {
  const { language } = useI18n();
  const isRussian = language !== 'en';

  const companies: Company[] = [
    {
      id: 'done',
      logoName: 'Done.png',
      url: 'https://done.co.il',
      role: 'Brand & Creative Lead',
      roleEn: 'Brand & Creative Lead',
      achievements: [
        'Брендинг и айдентика',
        'Разработка приложения',
        'Маркетинговые кампании',
        'Режиссирование и продюсирование видеосъёмок'
      ],
      achievementsEn: [
        'Branding and identity',
        'App development',
        'Marketing campaigns',
        'Directing and producing video shoots'
      ]
    }
  ];

  return (
    <section id="experience" className="px-4 py-12 md:py-16 lg:py-20 min-h-screen flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-mono text-white mb-3">
            {isRussian ? 'Опыт работы' : 'Work Experience'}
          </h2>
          <p className="text-xs text-white/30 font-mono tracking-[0.2em] uppercase">
            {isRussian ? 'компании и проекты' : 'companies & projects'}
          </p>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Glass Card */}
              <div className="h-full p-5 md:p-6
                              bg-white/[0.02] backdrop-blur-xl
                              border border-white/[0.08]
                              rounded-lg
                              transition-all duration-500 ease-out
                              hover:bg-white/[0.04] hover:border-white/[0.15]
                              hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                                bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01]" />

                <div className="relative z-10 space-y-4">
                  {/* Company Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Company Logo */}
                      <div className="h-8 md:h-10 relative w-auto flex items-center">
                        <Image
                          src={`/companys/${company.logoName}`}
                          alt={company.id}
                          width={140}
                          height={36}
                          className="object-contain object-left brightness-100 group-hover:brightness-110 transition-all duration-300 max-h-8 md:max-h-10 w-auto"
                          style={{ filter: 'grayscale(100%) brightness(200%)' }}
                        />
                      </div>
                    </div>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                      aria-label={`Visit ${company.id}`}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Achievements List */}
                  <ul className="space-y-1.5">
                    {(isRussian ? company.achievements : company.achievementsEn).map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                        className="flex items-start gap-2 font-mono text-xs text-white/40 leading-relaxed"
                      >
                        <span className="w-1 h-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-white/20
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
