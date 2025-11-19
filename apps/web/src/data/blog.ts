export type LocaleKey = 'en' | 'hi';

export type BlogCategoryKey = 'tips' | 'stories' | 'tech' | 'sustainability';

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  categoryKey: BlogCategoryKey;
  categoryLabel: string;
  readingTime: string;
  date: string;
};

export type BlogCopy = {
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    body: string;
  };
  categories: Array<{ key: BlogCategoryKey | 'all'; label: string }>;
  featured: BlogPost & { highlight: string };
  posts: BlogPost[];
  subscribe: {
    title: string;
    body: string;
    placeholder: string;
    button: string;
    helper: string;
    fallback: string;
    privacy: string;
  };
};

const EN_BASE: BlogCopy = {
  hero: {
    kicker: 'BLOG',
    title: 'Daily Commute Cycling Safety: Turn Every Ride Into Power',
    subtitle: 'Stay confident on city streets with simple safety rituals, smart gear, and bike checks tailored to Finspeed riders.',
    body: ''
  },
  categories: [{ key: 'all', label: 'All' }],
  featured: {
    slug: 'daily-commute-cycling-safety',
    title: 'Daily Commute Cycling Safety: Turn Every Ride Into Power',
    summary: 'Stay confident on city streets with simple safety rituals, smart gear, and bike checks tailored to Finspeed riders.',
    categoryKey: 'tips',
    categoryLabel: 'Tips',
    readingTime: '6 min read',
    date: 'Nov 8, 2025',
    highlight: 'Featured post'
  },
  posts: [],
  subscribe: {
    title: '[TODO: subscribe title from SCN-007]',
    body: '',
    placeholder: '',
    button: '',
    helper: '',
    fallback: '',
    privacy: ''
  }
};

export const BLOG_DATA: Record<LocaleKey, BlogCopy> = {
  en: EN_BASE,
  hi: EN_BASE
};
