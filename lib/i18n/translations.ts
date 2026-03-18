export type Language = 'en' | 'ru';

export interface Translations {
  header: {
    search: string;
    searchPlaceholder: string;
  };
  gallery: {
    tagline: string;
    title: string;
    apps: {
      accent: string;
      title: string;
      description: string;
    };
    fashion: {
      accent: string;
      title: string;
      description: string;
    };
    video: {
      title: string;
    };
    research: {
      accent: string;
      title: string;
      description: string;
    };
  };
  cases: {
    web3Bank: {
      title: string;
      category: string;
      description: string;
      solution: string;
      visuals: string;
    };
    mailServices: {
      title: string;
      category: string;
      description: string;
      solution: string;
      visuals: string;
    };
    rd: {
      iot: {
        title: string;
        category: string;
        description: string;
      };
      quantum: {
        title: string;
        category: string;
        description: string;
      };
    };
  };
  contact: {
    consultation: {
      confirm: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      search: 'Search',
      searchPlaceholder: 'search...',
    },
    gallery: {
      tagline: 'PORTFOLIO',
      title: 'GALLERY',
      apps: {
        accent: 'Digital Products',
        title: 'Apps & Platforms',
        description: 'Development of web and mobile applications, blockchain solutions and complex IT ecosystems for business',
      },
      fashion: {
        accent: 'Design',
        title: 'Fashion',
        description: 'Designer clothing collection combining Central Asian culture with the freedom of modern urban style',
      },
      video: {
        title: 'Video & CGI',
      },
      research: {
        accent: 'Innovation Lab',
        title: 'R&D Projects',
        description: 'Research initiatives in frontier technologies: IoT, quantum computing, and sustainable development',
      },
    },
    cases: {
      web3Bank: {
        title: 'Web3 Banking Platform',
        category: 'Blockchain / FinTech',
        description: 'Development of a decentralized banking platform with cryptocurrency integration, smart contracts for automated lending, and a multi-signature security system. The platform includes a mobile application and web interface with real-time transaction processing.',
        solution: 'We created a comprehensive ecosystem consisting of smart contracts on Ethereum, a Layer 2 solution for fast and cheap transactions, and an intuitive interface for managing digital assets. Integration with traditional banking APIs ensures seamless fiat-crypto exchange.',
        visuals: 'Visual concept reflects the aesthetics of digital minimalism: clean geometric shapes, liquid animations, and a dark interface with neon accents. The design emphasizes transparency and security of blockchain operations.',
      },
      mailServices: {
        title: 'Smart Mail Logistics',
        category: 'Logistics / Automation',
        description: 'Automation system for mail processing and logistics optimization using computer vision and machine learning. The system includes automatic sorting, route optimization, and real-time delivery tracking.',
        solution: 'Implemented a neural network for recognizing handwritten and printed addresses with 99.2% accuracy. Developed an algorithm for optimal route planning that reduced delivery time by 35%. Created a mobile application for couriers with AR navigation.',
        visuals: 'Interface design based on the metaphor of digital streams: smooth data flows, dynamic maps with animated routes, minimalist cards for tracking packages. The color palette combines corporate blue with energetic orange accents.',
      },
      rd: {
        iot: {
          title: 'IoT Ecosystem',
          category: 'Internet of Things',
          description: 'Development of a unified platform for connecting and managing IoT devices in smart city infrastructure',
        },
        quantum: {
          title: 'Quantum Research',
          category: 'Quantum Computing',
          description: 'Research in quantum algorithms for optimization problems and cryptographic protocols',
        },
      },
    },
    contact: {
      consultation: {
        confirm: 'Send Request',
      },
    },
  },
  ru: {
    header: {
      search: 'Поиск',
      searchPlaceholder: 'поиск...',
    },
    gallery: {
      tagline: 'ПОРТФОЛИО',
      title: 'ГАЛЕРЕЯ',
      apps: {
        accent: 'Цифровые продукты',
        title: 'Приложения и платформы',
        description: 'Разработка веб и мобильных приложений, блокчейн-решений и сложных IT-экосистем для бизнеса',
      },
      fashion: {
        accent: 'Дизайн',
        title: 'Мода',
        description: 'Коллекция дизайнерской одежды сочетания культуры Средней Азии и свободы современного урбана',
      },
      video: {
        title: 'Видео и CGI',
      },
      research: {
        accent: 'Лаборатория инноваций',
        title: 'R&D проекты',
        description: 'Исследовательские инициативы в передовых технологиях: IoT, квантовые вычисления и устойчивое развитие',
      },
    },
    cases: {
      web3Bank: {
        title: 'DEB3',
        category: 'Блокчейн / Репутация',
        description: 'Автоматизированная кроссчейн-система для оценки ончейн-репутации пользователей. Протокол анализирует историю транзакций в блокчейне и формирует индекс доверия на основе вычислительных метрик. Архитектурное решение реализовано через Soulbound Tokens (SBT) в сетях Everscale и Ethereum.',
        solution: 'В связи с отсутствием нативной поддержки передачи NFT через Octus Bridge, разработан гибридный механизм: взаимозаменяемый токен выпускается в сети Everscale и через кроссчейн-мост конвертируется в невзаимозаменяемый формат в Ethereum, обеспечивая корректный выпуск SBT.',
        visuals: '',
      },
      mailServices: {
        title: 'Умная почтовая логистика',
        category: 'Логистика / Автоматизация',
        description: 'Система автоматизации обработки почты и оптимизации логистики с использованием компьютерного зрения и машинного обучения. Система включает автоматическую сортировку, оптимизацию маршрутов и отслеживание доставки в реальном времени.',
        solution: 'Внедрили нейросеть для распознавания рукописных и печатных адресов с точностью 99.2%. Разработали алгоритм оптимального планирования маршрутов, сокративший время доставки на 35%. Создали мобильное приложение для курьеров с AR-навигацией.',
        visuals: 'Дизайн интерфейса построен на метафоре цифровых потоков: плавные потоки данных, динамические карты с анимированными маршрутами, минималистичные карточки для отслеживания посылок. Цветовая палитра сочетает корпоративный синий с энергичными оранжевыми акцентами.',
      },
      rd: {
        iot: {
          title: 'IoT Экосистема',
          category: 'Интернет вещей',
          description: 'Разработка единой платформы для подключения и управления IoT-устройствами в инфраструктуре умного города',
        },
        quantum: {
          title: 'Квантовые исследования',
          category: 'Квантовые вычисления',
          description: 'Исследования в области квантовых алгоритмов для задач оптимизации и криптографических протоколов',
        },
      },
    },
    contact: {
      consultation: {
        confirm: 'Отправить заявку',
      },
    },
  },
};
