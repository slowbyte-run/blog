import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      heroTitle: 'Snow Blog Template',
      heroSubtitle:
        'Astro shell, React 19 islands, StyleX atoms, zero-backend search.',
      actionPrimary: 'Start writing',
      actionSecondary: 'View components',
      searchTitle: 'Search posts',
      searchPlaceholder: 'Search posts...',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      results: 'Results',
    },
  },
  zh: {
    translation: {
      heroTitle: 'Snow 博客模板',
      heroSubtitle: 'Astro 外壳 + React 19 岛屿 + StyleX 原子样式 + 零后端搜索',
      actionPrimary: '开始写作',
      actionSecondary: '组件示例',
      searchTitle: '搜索文章',
      searchPlaceholder: '搜索文章...',
      language: '语言',
      theme: '主题',
      light: '浅色',
      dark: '深色',
      results: '结果',
    },
  },
};

export function ensureI18n(lang = 'en') {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else if (lang && i18n.language !== lang) {
    void i18n.changeLanguage(lang);
  }

  return i18n;
}
