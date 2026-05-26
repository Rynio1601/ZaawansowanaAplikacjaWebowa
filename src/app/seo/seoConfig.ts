// src/app/seo/seoConfig.ts
export const seoConfig = {
  siteTitle: 'TrainerPro',
  siteDescription: 'Wszystko, czego potrzebuje trener personalny – w jednym systemie',
  siteUrl: 'https://trainerpro.pl', // zostanie zaktualizowane po ustaleniu domeny
  siteLogo: '/favicon-512.png',
  siteName: 'TrainerPro - System dla trenerów personalnych',
  
  pages: {
    home: {
      title: 'TrainerPro – Wszystko dla trenera w jednym systemie',
      description: 'Zarządzaj klientami, planami treningowymi, płatnościami i komunikacją bez chaosu. Zaoszczędź 3 godziny dziennie i skup się na treningu.',
      ogImage: '/og-home.png',
      pathname: '/'
    },
    pricing: {
      title: 'Cennik TrainerPro | Proste plany cenowe',
      description: 'Wybierz plan Basic, Pro lub Studio. 14-dniowy darmowy trial bez karty kredytowej.',
      ogImage: '/og-pricing.png',
      pathname: '/cennik'
    },
    demo: {
      title: 'Demo TrainerPro | Zobacz jak działa system',
      description: 'Zarezerwuj indywidualne demo systemu dla trenerów personalnych. Zobacz wszystkie funkcje w działaniu.',
      ogImage: '/og-demo.png',
      pathname: '/demo'
    },
    register: {
      title: 'Rejestracja TrainerPro | Rozpocznij darmowy okres',
      description: 'Dołącz do 2400+ trenerów. 14-dniowy trial bez karty kredytowej. Zacznij zarządzać biznesem profesjonalnie.',
      ogImage: '/og-register.png',
      pathname: '/rejestracja'
    },
    login: {
      title: 'Logowanie do TrainerPro',
      description: 'Zaloguj się do swojego konta TrainerPro. Zarządzaj klientami, planami i płatnościami w jednym miejscu.',
      ogImage: '/og-login.png',
      pathname: '/logowanie'
    },
    personaStationary: {
      title: 'Trener Personalny Stacjonarny | TrainerPro',
      description: 'Szybkie tworzenie planów, automatyczne przypomnienia i monitoring klientów. Profesjonalne narzędzia dla trenera stacjonarnego.',
      ogImage: '/og-persona-stationary.png',
      pathname: '/dla-trenera-personalnego'
    },
    personaOnline: {
      title: 'Trener Online | Skaluj biznes bez asystenta',
      description: 'Automatyczny onboarding, płatności cykliczne i zaawansowane raporty. System dla trenerów online z dużą liczbą klientów.',
      ogImage: '/og-persona-online.png',
      pathname: '/dla-trenera-online'
    },
    personaStudio: {
      title: 'Studio Treningowe | Zarządzaj zespołem trenerów',
      description: 'Kontrola grafiku, przychodów i ról użytkowników. Kompleksowe narzędzia dla właścicieli studiów fitness.',
      ogImage: '/og-persona-studio.png',
      pathname: '/dla-studia-treningowego'
    },
    crm: {
      title: 'CRM dla Trenerów Personalnych | Baza Klientów',
      description: 'Zarządzaj klientami i śledź progres w jednym miejscu. Profesjonalny CRM dla trenerów personalnych.',
      ogImage: '/og-crm.png',
      pathname: '/crm'
    },
    workoutPlanner: {
      title: 'Kreator Planów Treningowych | Biblioteka Ćwiczeń',
      description: 'Twórz i personalizuj plany szybciej dzięki bibliotece 500+ ćwiczeń. Program do układania planów treningowych.',
      ogImage: '/og-planner.png',
      pathname: '/kreator-planow'
    },
    blog: {
      title: 'Blog TrainerPro | Poradniki dla trenerów',
      description: 'Poradniki, SEO i rozwój biznesu trenera. Dowiedz się jak skalować działalność i zarabiać więcej.',
      ogImage: '/og-blog.png',
      pathname: '/blog'
    },
    faq: {
      title: 'FAQ TrainerPro | Najczęściej zadawane pytania',
      description: 'Odpowiedzi dotyczące działania systemu. Jak zacząć, płatności, integracje i wsparcie techniczne.',
      ogImage: '/og-faq.png',
      pathname: '/faq'
    },
    contact: {
      title: 'Kontakt z TrainerPro | Skontaktuj się z nami',
      description: 'Skontaktuj się lub umów prezentację systemu. Wsparcie dla trenerów personalnych i studiów fitness.',
      ogImage: '/og-contact.png',
      pathname: '/kontakt'
    }
  }
};

export type SeoPageKey = keyof typeof seoConfig.pages;
