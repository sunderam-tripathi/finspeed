export type LocaleKey = 'en' | 'hi';

import testimonialsEn from '../../../../specs/references/handoff/SCN-006-testimonials/data/testimonials-en.json';

type RawTestimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
};

const STORIES = (testimonialsEn.testimonials as RawTestimonial[]).map((t) => ({
  rider: t.name,
  role: t.location,
  quote: t.quote
}));

const BASE = {
  title: 'Testimonials',
  intro: '',
  stories: STORIES,
  cta: {
    heading: '',
    subheading: ''
  }
};

export const TESTIMONIALS = {
  en: BASE,
  hi: BASE
} satisfies Record<LocaleKey, unknown>;
