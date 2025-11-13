export type LocaleKey = 'en' | 'hi';

export const BRAND_STORY = {
  en: {
    hero: {
      title: 'Turning Pedals into Power',
      subtitle: 'From garage prototypes to global podiums, we engineer bicycles that turn effort into acceleration.'
    },
    mission: [
      {
        title: 'Engineering without compromise',
        description: 'Every Finspeed frame passes 300+ wind-tunnel iterations and 1,000 km stress rides before production approval.'
      },
      {
        title: 'Access for every rider',
        description: 'Partnerships with 120+ community studios keep fittings, test rides, and scholarships close to home.'
      },
      {
        title: 'Circular manufacturing',
        description: '95% of our suppliers are within 500 km of assembly sites, cutting freight emissions by 48% since 2023.'
      }
    ],
    timeline: [
      { year: '2015', detail: 'Founders build the first carbon prototype inside a borrowed Pune warehouse.' },
      { year: '2018', detail: 'Launch Turning Pedals initiative + first bilingual marketing shell.' },
      { year: '2022', detail: 'Opens Bengaluru composites lab; introduces regenerative braking research.' },
      { year: '2025', detail: 'Ships Finspeed Catalyst series with AI-assisted telemetry + accessibility pack.' }
    ],
    quote: {
      text: '“Finspeed keeps me grounded—the bikes climb like nothing else, but the mission climbs higher.”',
      author: 'Aditi Kaul — Ultra endurance rider'
    },
    cta: {
      title: 'Ready to ride the story forward?',
      links: [
        { label: 'Explore catalog', href: '/catalog' },
        { label: 'Find a dealer', href: '/dealers' }
      ]
    }
  },
  hi: {
    hero: {
      title: 'पैडल को शक्ति में बदलें',
      subtitle: 'गैराज के प्रोटोटाइप से वैश्विक मंच तक, हम आपकी मेहनत को तेज़ी में बदलने वाली साइकिल बनाते हैं।'
    },
    mission: [
      {
        title: 'समझौता-रहित इंजीनियरिंग',
        description: 'हर Finspeed फ्रेम 300+ विंड-टनल परीक्षण और 1,000 किमी तनाव सवारी पास करता है।'
      },
      {
        title: 'हर सवार के लिए पहुंच',
        description: '120+ कम्युनिटी स्टूडियो साझेदार फिटिंग, टेस्ट राइड और छात्रवृत्ति को आपके शहर में लाते हैं।'
      },
      {
        title: 'परिपत्र विनिर्माण',
        description: 'हमारे 95% सप्लायर असेंबली साइट से 500 किमी के भीतर हैं, 2023 से फ्रेट उत्सर्जन 48% कम।'
      }
    ],
    timeline: [
      { year: '2015', detail: 'संस्थापकों ने पुणे की एक उधार गोदाम में पहला कार्बन प्रोटोटाइप बनाया।' },
      { year: '2018', detail: 'Turning Pedals पहल + पहला द्विभाषी मार्केटिंग शेल लॉन्च।' },
      { year: '2022', detail: 'बेंगलुरु कंपोजिट लैब शुरू; पुनर्योजी ब्रेकिंग शोध।' },
      { year: '2025', detail: 'AI-सहायता टेलीमेट्री + एक्सेसिबिलिटी पैक के साथ Finspeed Catalyst श्रृंखला शिप।' }
    ],
    quote: {
      text: '“Finspeed मुझे ज़मीन से जोड़ता है—बाइक पहाड़ चढ़ाती हैं, मिशन उससे भी ऊपर जाता है।”',
      author: 'अदिति कौल — अल्ट्रा एंड्यूरेंस राइडर'
    },
    cta: {
      title: 'कहानी को आगे बढ़ाने के लिए तैयार हैं?',
      links: [
        { label: 'कैटलॉग देखें', href: '/catalog' },
        { label: 'डीलर खोजें', href: '/dealers' }
      ]
    }
  }
} satisfies Record<LocaleKey, unknown>;
