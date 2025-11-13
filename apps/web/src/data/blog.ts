export type LocaleKey = 'en' | 'hi';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
};

export const BLOG_DATA: Record<LocaleKey, { hero: { title: string; subtitle: string }; featured: BlogPost; recent: BlogPost[] }> = {
  en: {
    hero: {
      title: 'Finspeed Journal',
      subtitle: 'Deep dives on engineering, rider journeys, and sustainability across the Finspeed ecosystem.'
    },
    featured: {
      slug: 'catalyst-aero-lab',
      title: 'Inside the Catalyst aero lab',
      excerpt: 'How the composites team shaved 12 watts by rethinking seat-stay layups and telemetry feedback loops.',
      category: 'Engineering',
      readingTime: '6 min read',
      date: 'Nov 8, 2025'
    },
    recent: [
      {
        slug: 'himalayan-basecamp-program',
        title: 'Himalayan basecamp program diary',
        excerpt: 'Sahana Bhandari shares lessons from guiding riders across 4,000m passes with Finspeed support crews.',
        category: 'Adventure',
        readingTime: '5 min read',
        date: 'Oct 28, 2025'
      },
      {
        slug: 'battery-circularity-update',
        title: 'Battery circularity update',
        excerpt: 'What we learned after recycling the first 1,200 commuter packs in Pune and Bengaluru.',
        category: 'Sustainability',
        readingTime: '4 min read',
        date: 'Oct 12, 2025'
      }
    ]
  },
  hi: {
    hero: {
      title: 'Finspeed जर्नल',
      subtitle: 'इंजीनियरिंग, सवार कहानियों और स्थिरता पर गहन लेख।'
    },
    featured: {
      slug: 'catalyst-aero-lab',
      title: 'Catalyst एयरो लैब के अंदर',
      excerpt: 'कम्पोजिट टीम ने सीट-स्टे लेअप और टेलीमेट्री से 12 वाट कैसे बचाए।',
      category: 'इंजीनियरिंग',
      readingTime: '6 मिनट',
      date: '8 नवम्बर 2025'
    },
    recent: [
      {
        slug: 'himalayan-basecamp-program',
        title: 'हिमालयन बेसकैंप प्रोग्राम डायरी',
        excerpt: 'सहाना भंडारी 4,000 मीटर पास पर राइडर गाइड करने के अनुभव साझा करती हैं।',
        category: 'एडवेंचर',
        readingTime: '5 मिनट',
        date: '28 अक्टूबर 2025'
      },
      {
        slug: 'battery-circularity-update',
        title: 'बैटरी सर्कुलैरिटी अपडेट',
        excerpt: 'पुणे और बेंगलुरु में पहले 1,200 कम्यूटर पैक रीसाइक्लिंग से मिली सीखें।',
        category: 'सस्टेनेबिलिटी',
        readingTime: '4 मिनट',
        date: '12 अक्टूबर 2025'
      }
    ]
  }
};
