"use client";

import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Shirt,
  Film,
  FlaskConical,
  ChevronRight,
  Monitor,
  Droplets,
  ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ContactModal from '@/components/modals/ContactModal';
import FloatingContactButton from '@/components/FloatingContactButton';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProcessRoadmap from '@/components/sections/ProcessRoadmap';
import { ProjectsGrid } from '@/components/sections/ProjectCards';
import { PhDResearchBlock } from '@/project-cards/PhDConcept';
import { useI18n } from '@/lib/i18n/context';

const fashionImages = [
  '/gallery/photo_2026-01-30_12-26-56.jpg',
  '/gallery/photo_2026-01-30_12-27-09.jpg',
  '/gallery/photo_2026-01-30_12-27-19.jpg',
  '/gallery/photo_2026-01-30_12-27-28.jpg',
  '/gallery/photo_2026-01-30_12-27-32.jpg',
  '/gallery/photo_2026-01-30_12-27-35.jpg',
  '/gallery/photo_2026-01-30_12-27-39.jpg',
  '/gallery/photo_2026-01-30_12-27-43.jpg',
  '/gallery/photo_2026-01-30_12-27-46.jpg',
  '/gallery/photo_2026-01-30_12-27-50.jpg',
  '/gallery/photo_2026-01-30_12-27-54.jpg',
  '/gallery/photo_2026-01-30_12-27-58.jpg',
  '/gallery/photo_2026-01-30_12-28-02.jpg',
  '/gallery/photo_2026-01-30_12-28-05.jpg',
  '/gallery/photo_2026-01-30_12-28-08.jpg',
];

function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  // Touch swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  return (
    <motion.div 
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[50vh] overflow-hidden border border-white/10 bg-black/30 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={images[index]}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            alt={`Gallery image ${index + 1}`}
            loading="eager"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls - always visible on mobile, hover on desktop */}
      <div className={`absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none transition-opacity duration-300 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <motion.button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all active:scale-95"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all active:scale-95"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
            animate={{ width: i === index ? 24 : 8 }}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Image counter for mobile */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full md:hidden">
        <span className="text-white/80 text-xs font-mono">
          {index + 1} / {images.length}
        </span>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const { t, language } = useI18n();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const videoShowcase = [
    {
      src: "/media/need-for-speed-underground-2-remaster-2022.mp4",
      title: language === 'ru' ? "CGI 3D кино" : "CGI 3D Cinema",
      meta: "CGI / 01",
      tags: ["DYNAMICS", "VELOCITY", "CORE"]
    },
    {
      src: "/media/ryabov.mp4",
      title: language === 'ru' ? "Рекламный шоурилс" : "Advertising Showreel",
      meta: "R&D / 02",
      tags: ["BIOMORPHIC", "SYNTHESIS", "FLOW"]
    }
  ];

  const gallerySections = [
    {
      id: 'fashion',
      title: t('gallery.fashion.title'),
      accent: t('gallery.fashion.accent'),
      icon: <Shirt size={18} />,
      description: t('gallery.fashion.description'),
      isCarousel: true,
      images: fashionImages,
      projects: []
    },
    {
      id: 'research',
      title: t('gallery.research.title'),
      accent: t('gallery.research.accent'),
      icon: <FlaskConical size={18} />,
      description: t('gallery.research.description'),
      projects: [
        {
          id: 'rd-iot',
          title: language === 'ru' ? 'SensorDAO Protocol' : 'SensorDAO Protocol',
          category: language === 'ru' ? 'Прозрачный мониторинг через автономную эмиссию данных' : 'Transparent monitoring through autonomous data emission',
          description: language === 'ru' 
            ? `SensorDAO Protocol — это архитектура децентрализованной физической сети, где IoT-сенсоры выступают как полноценные экономические агенты, способные самостоятельно эмитировать токены в обмен на криптографически верифицированные пакеты измерений.

АРХИТЕКТУРА СИСТЕМЫ:

1. Уровень сбора (Edge Layer)
Автономные сенсорные кластеры оснащены защищенными элементами (Secure Enclaves). Каждое измерение подписывается приватным ключом устройства, снабжается временной меткой и геолокацией, упаковывается в DataHash (SHA-3).

2. Уровень валидации (Node Layer)
Данные попадают в ближайшую ноду сети. Нода выполняет проверку цифровой подписи сенсора, сверку с аномалиями (cross-reference с соседними датчиками), формирование Merkle Tree из пакетов данных.

3. Уровень консенсуса (DAO Layer)
• Proof-of-Sensor (PoSe): Механизм подтверждения физического существования датчика через случайные криптографические вызовы
• Data-Finality: Голосование за включение блока данных в основную цепь
• Репутационный слой: Датчики накапливают reputation-score; низкая репутация = снижение эмиссии

МЕХАНИКА ЭМИССИИ: Sensor-to-Token (S2T)

В отличие от классических DeFi-моделей, эмитентом выступает само устройство:

Trigger: Датчик фиксирует событие
Packet: Формируется структура {DataHash, Timestamp, Geo, Signature}
Oracle-Bridge: Нода упаковывает хеш в транзакцию, но не передает сами данные
Emission: При достижении кворума валидаторов смарт-контракт минтит токены $SENSE
Data-Availability: Сырые данные хранятся в IPFS/Filecoin с доступом по хешу

Формула эмиссии:
Emission = Base_Reward × Quality_Coefficient × Time_Decay
где Quality_Coefficient зависит от частоты измерений, стабильности соединения и соответствия ожидаемым паттернам.

ПРОЗРАЧНОСТЬ КАК ТЕХНИЧЕСКИЙ СТАНДАРТ:

• Verifiable Telemetry: Любой участник может проверить, что данные не подделаны, сравнив хеш в блокчейне с публично доступным исходным файлом
• Anti-Tampering: Попытка физического взлома датчика фиксируется акселерометром и маркирует данные как "подозрительные"
• Open Telemetry API: Публичный доступ к потоку хешей без раскрытия точных координат приватных объектов (geofencing на уровне смарт-контракта)`
            : `SensorDAO Protocol is an architecture of a decentralized physical network where IoT sensors act as full economic agents capable of autonomously emitting tokens in exchange for cryptographically verified measurement packages.

SYSTEM ARCHITECTURE:

1. Edge Layer
Autonomous sensor clusters equipped with Secure Enclaves. Each measurement is signed with the device's private key, timestamped, geolocated, and packaged into DataHash (SHA-3).

2. Node Layer
Data reaches the nearest network node. The node performs digital signature verification, cross-reference anomaly detection, and Merkle Tree formation.

3. DAO Layer
• Proof-of-Sensor (PoSe): Mechanism for verifying sensor physical existence through random cryptographic challenges
• Data-Finality: Voting for block inclusion
• Reputation layer: Sensors accumulate reputation-score; low reputation = reduced emission

SENSOR-TO-TOKEN (S2T) MECHANICS:

Unlike classical DeFi models, the device itself is the emitter:

Trigger: Sensor captures event
Packet: Structure formed {DataHash, Timestamp, Geo, Signature}
Oracle-Bridge: Node packs hash without exposing raw data
Emission: Smart contract mints $SENSE tokens upon validator quorum
Data-Availability: Raw data stored in IPFS/Filecoin

Emission formula:
Emission = Base_Reward × Quality_Coefficient × Time_Decay

TRANSPARENCY STANDARDS:

• Verifiable Telemetry: Anyone can verify data authenticity
• Anti-Tampering: Physical tampering detected by accelerometer
• Open Telemetry API: Public hash stream access without revealing private coordinates`,
          solution: '',
          visuals: '',
          icon: <Monitor size={20} />
        },
        {
          id: 'rd-eco-expeditor',
          title: language === 'ru' ? 'Эко Экспедитор' : 'Eco Expeditor',
          category: language === 'ru' ? 'Карманный анализатор' : 'Pocket Analyzer',
          description: language === 'ru'
            ? 'Разработка портативного мультисенсорного устройства для анализа качества водных источников широкого спектра. Прибор размером с карманное зарядное устройство оснащён цифровыми электродами для измерения pH, растворённого кислорода, электропроводности, турбидности, ОВП, общего содержания растворённых твёрдых веществ и температуры. Система автоматизированного сбора проб с микроконтроллером ESP32 обеспечивает криптографическое хеширование данных SHA-256 и запечатывание в блокчейн-ноды для гарантии неизменности и происхождения данных. Интеграция с DeFi-протоколами позволяет передавать верифицированные экологические данные в Big Data-маркетплейсы с вознаграждением поставщиков данных в нативных токенах экосистемы.'
            : 'Development of a portable multi-sensor device for analyzing the quality of wide-spectrum water sources. The pocket-sized device features digital electrodes for measuring pH, dissolved oxygen, conductivity, turbidity, ORP, total dissolved solids, and temperature. The automated sampling system with ESP32 microcontroller provides SHA-256 cryptographic data hashing and sealing into blockchain nodes to guarantee data immutability and provenance. Integration with DeFi protocols enables transfer of verified environmental data to Big Data marketplaces with rewards for data providers in ecosystem native tokens.',
          solution: '',
          visuals: '',
          icon: <Droplets size={20} />
        }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Subtle gradient overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <main className="relative z-10 pt-24 pb-24">
        {/* About section - Main entry */}
        <AboutSection />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Process Roadmap */}
        <ProcessRoadmap />

        {/* Gallery Header */}
        <section className="px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-mono text-white mb-3">
                {language === 'ru' ? 'ГАЛЕРЕЯ' : 'GALLERY'}
              </h2>
              <p className="text-xs text-white/30 font-mono tracking-[0.2em] uppercase">
                {language === 'ru' ? 'визуальные работы' : 'visual works'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Video showcase */}
        <section id="video" className="px-4 mb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-white/70"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Film size={18} />
              </motion.div>
              <div className="font-mono text-xs text-white/50 tracking-[0.25em] uppercase">
                {t('gallery.video.title')}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoShowcase.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative aspect-video bg-[#050505]">
                    <video
                      src={item.src}
                      controls
                      muted
                      playsInline
                      preload="none"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <h3 className="font-mono text-sm text-white group-hover:text-white/90 transition-colors">{item.title}</h3>
                    <div className="flex gap-2">
                      {item.tags.map((tag, tagIdx) => (
                        <motion.span 
                          key={tag} 
                          className="font-mono text-[8px] px-1.5 py-0.5 border border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white/60 transition-all"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + tagIdx * 0.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {gallerySections.map((block) => (
              <div key={block.id} id={block.id} className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="text-white/50">
                    {block.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-1">
                      {block.accent}
                    </div>
                    <h2 className="font-mono text-xl md:text-2xl text-white/80 uppercase tracking-widest">
                      {block.title}
                    </h2>
                  </div>
                </div>

                {block.description && (
                  <motion.p 
                    className="font-mono text-sm text-white/50 max-w-2xl leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {block.description}
                  </motion.p>
                )}

                {block.isCarousel ? (
                  <ImageCarousel images={block.images || []} />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {block.projects.map((project, idx) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`group border backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden ${activeProject === project.id
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                          }`}
                        onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                      >
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                            <div className="space-y-2">
                              <motion.div 
                                className="font-mono text-[10px] text-white/40 uppercase tracking-widest"
                                whileHover={{ x: 4 }}
                              >
                                {project.category}
                              </motion.div>
                              <h3 className="font-mono text-xl text-white/90 group-hover:text-white transition-colors">
                                {project.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4">
                              <motion.div
                                animate={{ rotate: activeProject === project.id ? 90 : 0 }}
                                className="text-white/40 group-hover:text-white/60 transition-colors"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ChevronRight size={20} />
                              </motion.div>
                            </div>
                          </div>

                          {activeProject === project.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="mt-8 pt-8 border-t border-white/10 overflow-hidden"
                            >
                              <div className="max-w-3xl">
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                                      {language === 'ru' ? 'Описание' : 'Description'}
                                    </h4>
                                    <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                      <p className="font-mono text-sm text-white/70 leading-relaxed whitespace-pre-line">
                                        {project.description}
                                      </p>
                                    </div>
                                  </div>
                                  {project.solution && (
                                    <div className="space-y-3">
                                      <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                                        {language === 'ru' ? 'Решение' : 'Solution'}
                                      </h4>
                                      <p className="font-mono text-sm text-white/70 leading-relaxed italic">
                                        {project.solution}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer - minimal */}
        <div className="h-16" />

        {/* Projects */}
        <section id="projects" className="px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-mono text-white mb-3">
                {language === 'ru' ? 'Проекты' : 'Projects'}
              </h2>
              <p className="text-xs text-white/30 font-mono tracking-[0.2em] uppercase">
                {language === 'ru' ? 'личные разработки' : 'personal projects'}
              </p>
            </motion.div>
            <ProjectsGrid />
            
            {/* PhD Research */}
            <PhDResearchBlock />
          </div>
        </section>
      </main>
      
      {/* Floating Contact Button */}
      <FloatingContactButton onClick={() => setIsContactOpen(true)} />
    </div>
  );
}
