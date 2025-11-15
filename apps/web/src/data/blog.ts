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

export const BLOG_DATA: Record<LocaleKey, BlogCopy> = {
  en: {
    hero: {
      kicker: 'FINSPEED JOURNAL',
      title: 'Finspeed Journal',
      subtitle: 'Deep dives covering product, telemetry, and sustainability across the Finspeed ecosystem.',
      body: 'Every post cross-links to catalog, dealer support, and sustainability data so you can move from inspiration to a demo ride quickly.'
    },
    categories: [
      { key: 'all', label: 'All' },
      { key: 'tips', label: 'Tips' },
      { key: 'stories', label: 'Stories' },
      { key: 'tech', label: 'Tech' },
      { key: 'sustainability', label: 'Sustainability' }
    ],
    featured: {
      slug: 'daily-commute-cycling-safety',
      title: 'Daily commute cycling safety checklist',
      summary: 'Helmet fit, reflective layers, and the calmest 6 AM routes through NCR as tested by our rider success team.',
      categoryKey: 'tips',
      categoryLabel: 'Tips',
      readingTime: '6 min read',
      date: 'Nov 8, 2025',
      highlight: 'Featured post'
    },
    posts: [
      {
        slug: 'weekend-trail-escapes',
        title: 'Weekend trail escapes near Pune',
        summary: 'Routes, hydration checkpoints, and the dealer-supported pit stops that keep riders cared for.',
        categoryKey: 'stories',
        categoryLabel: 'Stories',
        readingTime: '5 min read',
        date: 'Oct 28, 2025'
      },
      {
        slug: 'catalyst-aero-lab',
        title: 'Inside the Catalyst aero lab',
        summary: 'How composites engineers shaved watts by reshaping seat-stay layups with telemetry feedback loops.',
        categoryKey: 'tech',
        categoryLabel: 'Tech',
        readingTime: '6 min read',
        date: 'Oct 18, 2025'
      },
      {
        slug: 'battery-circularity-update',
        title: 'Battery circularity update',
        summary: 'What we learned after recycling the first 1,200 commuter packs across Pune and Bengaluru.',
        categoryKey: 'sustainability',
        categoryLabel: 'Sustainability',
        readingTime: '4 min read',
        date: 'Oct 12, 2025'
      }
    ],
    subscribe: {
      title: 'Subscribe to the Journal',
      body: 'Monthly email with engineering notes, sustainability data, and rider journeys. No spam, unsubscribe anytime.',
      placeholder: 'you@example.com',
      button: 'Notify me',
      helper: 'By subscribing you agree to receive product and blog updates. We hash your email before analytics logging.',
      fallback: 'Formspree endpoint missing. Email journal@finspeed.example to opt in.',
      privacy: 'View privacy policy'
    }
  },
  hi: {
    hero: {
      kicker: 'FINSPEED जर्नल',
      title: 'Finspeed जर्नल',
      subtitle: 'इंजीनियरिंग, सस्टेनेबिलिटी और समुदाय की कहानियां जिन्हें तुरंत डेमो राइड से जोड़ा जा सकता है।',
      body: 'हर लेख कैटलॉग, डीलर और सपोर्ट लिंक्स से जुड़ा है ताकि प्रेरणा से लेकर टेस्ट राइड तक की यात्रा सहज हो।'
    },
    categories: [
      { key: 'all', label: 'सभी' },
      { key: 'tips', label: 'टिप्स' },
      { key: 'stories', label: 'कहानियां' },
      { key: 'tech', label: 'टेक' },
      { key: 'sustainability', label: 'सस्टेनेबिलिटी' }
    ],
    featured: {
      slug: 'daily-commute-cycling-safety',
      title: 'डेली कम्यूट सुरक्षा चेकलिस्ट',
      summary: 'हेलमेट फिट, रिफ्लेक्टिव लेयर और NCR की शांत सुबह रूट जो हमारी टीम ने परीक्षण किए।',
      categoryKey: 'tips',
      categoryLabel: 'टिप्स',
      readingTime: '6 मिनट',
      date: '8 नवम्बर 2025',
      highlight: 'फीचर्ड पोस्ट'
    },
    posts: [
      {
        slug: 'weekend-trail-escapes',
        title: 'पुणे के पास वीकेंड ट्रेल',
        summary: 'रूट, हाइड्रेशन पॉइंट और डीलर सपोर्टेड रेस्ट जो सवारों को सुरक्षित रखते हैं।',
        categoryKey: 'stories',
        categoryLabel: 'कहानियां',
        readingTime: '5 मिनट',
        date: '28 अक्टूबर 2025'
      },
      {
        slug: 'catalyst-aero-lab',
        title: 'Catalyst एयरो लैब के अंदर',
        summary: 'कम्पोजिट इंजीनियरों ने सीट-स्टे लेअप और टेलीमेट्री से कैसे ऊर्जा बचाई।',
        categoryKey: 'tech',
        categoryLabel: 'टेक',
        readingTime: '6 मिनट',
        date: '18 अक्टूबर 2025'
      },
      {
        slug: 'battery-circularity-update',
        title: 'बैटरी सर्कुलैरिटी अपडेट',
        summary: 'पुणे और बेंगलुरु में 1,200 ई-असिस्ट पैक रीसाइकिल करने के बाद क्या सीखा।',
        categoryKey: 'sustainability',
        categoryLabel: 'सस्टेनेबिलिटी',
        readingTime: '4 मिनट',
        date: '12 अक्टूबर 2025'
      }
    ],
    subscribe: {
      title: 'जर्नल को सब्सक्राइब करें',
      body: 'मासिक ईमेल जिसमें इंजीनियरिंग नोट्स, सस्टेनेबिलिटी डेटा और राइडर कहानियां मिलेंगी।',
      placeholder: 'आपका ईमेल',
      button: 'ईमेल भेजें',
      helper: 'सब्सक्राइब करके आप उत्पाद और ब्लॉग अपडेट स्वीकार करते हैं। विश्लेषिकी से पहले हम ईमेल हैश करते हैं।',
      fallback: 'Formspree सेट नहीं है। journal@finspeed.example पर मेल करें।',
      privacy: 'गोपनीयता नीति देखें'
    }
  }
};
