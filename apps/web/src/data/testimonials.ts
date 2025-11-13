export type LocaleKey = 'en' | 'hi';

export const TESTIMONIALS = {
  en: {
    title: 'Stories from the saddle',
    intro:
      'Riders across India trust Finspeed frames to carry them through Himalayan ascents, crit podiums, and sunrise commutes.',
    stories: [
      {
        rider: 'Ravi Srinivasan',
        role: 'Crit racer — Chennai',
        quote:
          'Switching to the Catalyst cut 18 seconds from my 10km lap. The stiffness is real, but the comfort surprised me more.'
      },
      {
        rider: 'Sahana Bhandari',
        role: 'Adventure guide — Manali',
        quote:
          'Clients notice how little fatigue they feel on long climbs. The geo and suspension tuning feel purpose-built for the Himalayas.'
      },
      {
        rider: 'Arjun Mukherjee',
        role: 'Daily commuter — Kolkata',
        quote:
          'Even in monsoons, the regenerative braking and sealed drivetrain keep my ride predictable. Maintenance dropped in half.'
      }
    ],
    cta: {
      heading: 'Share your ride with #FinspeedStories',
      subheading: 'Tag us on Instagram or write to the community team to get featured in the next story drop.'
    }
  },
  hi: {
    title: 'सवारों की कहानियां',
    intro: 'भारत भर के राइडर Finspeed फ्रेम पर भरोसा करते हैं—हिमालयी चढ़ाइयों, क्रिट पोडियम और सुबह की यात्राओं में।',
    stories: [
      {
        rider: 'रवि श्रीनिवासन',
        role: 'क्रिट रेसर — चेन्नई',
        quote: 'Catalyst पर शिफ्ट करने से 10 किमी लैप में 18 सेकंड कम हुए। कठोरता से ज्यादा कंफर्ट ने चौंकाया।'
      },
      {
        rider: 'सहाना भंडारी',
        role: 'एडवेंचर गाइड — मनाली',
        quote: 'ग्राहकों को लंबे चढ़ाई पर भी थकान कम लगती है। ज्यामिति और सस्पेंशन ऐसा लगता है जैसे हिमालय के लिए ही बना हो।'
      },
      {
        rider: 'अर्जुन मुखर्जी',
        role: 'दैनिक कम्यूटर — कोलकाता',
        quote: 'मानसून में भी रीजेन ब्रेकिंग और सील्ड ड्राइवट्रेन मेरी राइड को भरोसेमंद रखते हैं। मेंटेनेंस आधा हो गया है।'
      }
    ],
    cta: {
      heading: '#FinspeedStories के साथ अपनी राइड साझा करें',
      subheading: 'इंस्टाग्राम पर टैग करें या कम्युनिटी टीम को लिखें। अगली कहानी ड्रॉप में जगह पाएं।'
    }
  }
} satisfies Record<LocaleKey, unknown>;
