import { Link } from 'react-router-dom';
import {
  Users, Dumbbell, TrendingUp, CreditCard, BarChart3,
  ArrowRight, Check, Star, ChevronDown, MessageSquare,
  Calendar, Zap, Shield, RefreshCw, X, Play
} from 'lucide-react';
import { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { 
  trackDemoClick, 
  trackCTAClick, 
  trackRegistrationStart 
} from '../analytics/ga4';

const HERO_IMG = 'https://images.unsplash.com/photo-1750698545009-679820502908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBjbGllbnQlMjBmaXRuZXNzJTIwY29hY2hpbmd8ZW58MXx8fHwxNzcyNjk4ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080';
const TRAINER_IMG = 'https://images.unsplash.com/photo-1758875568932-0eefd3e60090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMG1hbiUyMHBlcnNvbmFsJTIwdHJhaW5lciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2OTg4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080';
const ONLINE_IMG = 'https://images.unsplash.com/photo-1713865469900-d12502a39875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWluZXIlMjBvbmxpbmUlMjBjb2FjaGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzI2OTg4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080';
const STUDIO_IMG = 'https://images.unsplash.com/photo-1750698544794-bf1cd7038f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3R1ZGlvJTIwZ3ltJTIwb3duZXIlMjBidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzcyNjk4ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080';

const problems = [
  { icon: MessageSquare, title: 'Rozproszona komunikacja', desc: 'Wiadomości od klientów rozrzucone po Messengerze, WhatsApp i SMS – tracisz ważne informacje.' },
  { icon: Dumbbell, title: 'Plany w Excel i PDF', desc: 'Ręczne tworzenie planów treningowych zajmuje godziny. Każda zmiana to kolejny plik.' },
  { icon: X, title: 'Brak automatyzacji', desc: 'Przypomnienia o treningach, follow-upy i onboarding robisz ręcznie, tracąc cenny czas.' },
  { icon: CreditCard, title: 'Chaos w płatnościach', desc: 'Śledzenie kto zapłacił, kiedy i ile to koszmar bez odpowiedniego systemu.' },
];

const features = [
  { icon: Users, color: '#2563EB', title: 'CRM Klientów', desc: 'Kompletna baza danych klientów z historią treningów, notatkami i dokumentami w jednym miejscu.' },
  { icon: Dumbbell, color: '#06B6D4', title: 'Kreator Planów', desc: 'Twórz spersonalizowane plany treningowe w kilka minut. Biblioteka 500+ ćwiczeń z instrukcjami.' },
  { icon: TrendingUp, color: '#10B981', title: 'Monitoring Progresu', desc: 'Śledź wagę, obwody, wyniki siłowe i inne metryki. Automatyczne wykresy postępów.' },
  { icon: CreditCard, color: '#F59E0B', title: 'Płatności Online', desc: 'Automatyczne subskrypcje i faktury. Integracja ze Stripe. Koniec z przypominaniem o płatnościach.' },
  { icon: BarChart3, color: '#8B5CF6', title: 'Raporty Biznesowe', desc: 'MRR, liczba klientów, churn – wszystkie KPI w jednym dashboardzie. Eksport do CSV.' },
  { icon: Calendar, color: '#EF4444', title: 'Grafik i Rezerwacje', desc: 'Zarządzaj terminami, unikaj podwójnych rezerwacji. Automatyczne przypomnienia SMS/email.' },
];

const personas = [
  {
    img: TRAINER_IMG,
    name: 'Trener stacjonarny',
    desc: 'Masz 10–25 klientów i chcesz działać profesjonalnie bez tonięcia w papierach?',
    accent: '#2563EB',
    benefits: ['Szybkie tworzenie planów', 'Automatyczne przypomnienia', 'Profesjonalny wizerunek', 'Monitoring postępów'],
    path: '/dla-trenera-personalnego',
    cta: 'Wypróbuj za darmo',
  },
  {
    img: ONLINE_IMG,
    name: 'Trener online',
    desc: 'Prowadzisz 40–100 klientów i potrzebujesz systemu, który skaluje Twój biznes bez asystenta?',
    accent: '#06B6D4',
    benefits: ['Automatyczny onboarding', 'Płatności cykliczne', 'Analiza wyników', 'CRM i zarządzanie'],
    path: '/dla-trenera-online',
    cta: 'Zobacz jak to działa',
  },
  {
    img: STUDIO_IMG,
    name: 'Studio treningowe',
    desc: 'Zarządzasz zespołem 3–6 trenerów i potrzebujesz pełnej kontroli nad biznesem?',
    accent: '#8B5CF6',
    benefits: ['Zarządzanie zespołem', 'Monitoring przychodów', 'Role i uprawnienia', 'Raporty biznesowe'],
    path: '/dla-studia-treningowego',
    cta: 'Umów demo',
  },
];

const testimonials = [
  { name: 'Agata Wiśniewska', role: 'Trener personalny, Warszawa', rating: 5, text: 'TrainerPro oszczędza mi 3 godziny dziennie. Klienci są zachwyceni profesjonalnymi planami, a ja w końcu mam czas na życie poza siłownią.' },
  { name: 'Piotr Nowak', role: 'Trener online, 78 klientów', rating: 5, text: 'Mój przychód wzrósł o 40% w ciągu 6 miesięcy. Automatyzacja płatności i onboardingu to game-changer dla trenera online.' },
  { name: 'Tomasz Kędzierski', role: 'Właściciel FitStudio', rating: 5, text: 'Zarządzam 5 trenerami i 200+ klientami bez stresu. Raporty w czasie rzeczywistym dają mi pełną kontrolę nad biznesem.' },
];

const faqs = [
  { q: 'Czy mogę przetestować aplikację za darmo?', a: 'Tak! Oferujemy 14-dniowy trial bez karty kredytowej. Masz pełny dostęp do wszystkich funkcji planu Pro.' },
  { q: 'Ile czasu zajmuje wdrożenie?', a: 'Większość trenerów jest aktywna w ciągu 30 minut. Nasz onboarding prowadzi Cię krok po kroku przez pierwsze działania.' },
  { q: 'Czy mogę importować istniejących klientów?', a: 'Tak, obsługujemy import z plików CSV i Excel. Możesz też skorzystać z naszego zespołu migracji.' },
  { q: 'Jakie metody płatności obsługujecie?', a: 'Karty kredytowe/debetowe, BLIK, przelewy bankowe. Integracja ze Stripe zapewnia bezpieczne płatności.' },
  { q: 'Czy aplikacja działa na telefonie?', a: 'Tak, TrainerPro jest w pełni responsywne i działa na każdym urządzeniu – komputerze, tablecie i smartfonie.' },
  { q: 'Co się stanie po zakończeniu trialu?', a: 'Możesz wybrać plan lub przejść na wersję freemium z ograniczoną liczbą klientów. Twoje dane są zawsze bezpieczne.' },
];

const stats = [
  { value: '2,400+', label: 'Aktywnych trenerów' },
  { value: '98,000+', label: 'Klientów w systemie' },
  { value: '4.9/5', label: 'Średnia ocena' },
  { value: '3h', label: 'Zaoszczędzone dziennie' },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(37,99,235,0.15) 0%, transparent 60%)' }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(6,182,212,0.06)' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA' }}>
              <Zap size={14} />
              <span>Nowe: Automatyczny onboarding klientów</span>
            </div>
            <h1 className="mb-6 text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Wszystko, czego potrzebuje<br />
              <span style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                trener personalny
              </span>
              {' '}– w jednym systemie
            </h1>
            <p className="mb-10 max-w-2xl mx-auto" style={{ color: '#64748B', fontSize: '1.15rem', lineHeight: 1.7 }}>
              Zarządzaj klientami, planami, płatnościami i komunikacją bez chaosu. Zaoszczędź 3 godziny dziennie i skup się na tym, co kochasz – treningu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/rejestracja"
                onClick={() => {
                  trackCTAClick('Hero Register CTA');
                  trackRegistrationStart();
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
                Rozpocznij darmowy okres próbny
                <ArrowRight size={18} />
              </Link>
              <Link to="/demo"
                onClick={() => {
                  trackCTAClick('Hero Demo CTA');
                  trackDemoClick();
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9', fontWeight: 600, fontSize: '1rem' }}>
                <Play size={16} />
                Zobacz demo
              </Link>
            </div>
            <p className="text-sm" style={{ color: '#334155' }}>✓ Bez karty kredytowej &nbsp;·&nbsp; ✓ 14 dni za darmo &nbsp;·&nbsp; ✓ Anuluj kiedy chcesz</p>
          </div>

          {/* Hero image */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
              <img src={HERO_IMG} alt="TrainerPro dashboard" className="w-full object-cover" style={{ height: 420, objectPosition: 'center' }} />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to top, rgba(6,8,15,0.4) 0%, transparent 60%)' }} />
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 hidden lg:block px-4 py-3 rounded-xl" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <p className="text-xs mb-1" style={{ color: '#475569' }}>Aktywni klienci</p>
              <p className="text-2xl text-white" style={{ fontWeight: 800 }}>32</p>
              <p className="text-xs" style={{ color: '#10B981' }}>▲ +4 ten miesiąc</p>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden lg:block px-4 py-3 rounded-xl" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <p className="text-xs mb-1" style={{ color: '#475569' }}>Przychód (MRR)</p>
              <p className="text-2xl text-white" style={{ fontWeight: 800 }}>12 840 zł</p>
              <p className="text-xs" style={{ color: '#10B981' }}>▲ +18% vs ub. miesiąc</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="mb-1 text-white" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</p>
                <p className="text-sm" style={{ color: '#475569' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm px-4 py-2 rounded-full inline-block mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>Problem</span>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Czy to brzmi znajomo?</h2>
            <p style={{ color: '#64748B', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Większość trenerów traci 2–4 godziny dziennie na rzeczy, które można zautomatyzować.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <Icon size={18} style={{ color: '#F87171' }} />
                </div>
                <div>
                  <p className="mb-1 text-white" style={{ fontWeight: 600 }}>{title}</p>
                  <p className="text-sm" style={{ color: '#475569', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Solution */}
      <section className="py-24" style={{ background: '#070B14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm px-4 py-2 rounded-full inline-block mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399' }}>Rozwiązanie</span>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Jeden system zamiast chaosu</h2>
            <p style={{ color: '#64748B', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>TrainerPro łączy wszystkie narzędzia, których potrzebujesz, w jednej intuicyjnej platformie.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl transition-all group" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <p className="mb-2 text-white" style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</p>
                <p className="text-sm" style={{ color: '#475569', lineHeight: 1.6 }}>{desc}</p>
                <Link to="/app/dashboard" className="inline-flex items-center gap-1 mt-4 text-sm transition-colors" style={{ color }}>
                  Dowiedz się więcej <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Dla kogo jest TrainerPro?</h2>
            <p style={{ color: '#64748B', maxWidth: 500, margin: '0 auto' }}>Dopasowany do każdego etapu Twojego biznesu trenerskiego.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personas.map(({ img, name, desc, accent, benefits, path, cta }) => (
              <div key={name} className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative h-56 overflow-hidden">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0A0F1A 0%, transparent 50%)' }} />
                </div>
                <div className="p-6">
                  <p className="text-white mb-2" style={{ fontWeight: 700, fontSize: '1.15rem' }}>{name}</p>
                  <p className="text-sm mb-5" style={{ color: '#64748B', lineHeight: 1.6 }}>{desc}</p>
                  <ul className="space-y-2 mb-6">
                    {benefits.map(b => (
                      <li key={b} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                        <Check size={14} style={{ color: accent, flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link to={path}
                    onClick={() => {
                      trackCTAClick(`Persona ${name} CTA`);
                      if (path === '/rejestracja') {
                        trackRegistrationStart();
                      } else if (path === '/demo') {
                        trackDemoClick();
                      }
                    }}
                    className="block text-center py-3 rounded-xl text-sm text-white transition-all"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}40`, color: accent, fontWeight: 600 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accent}25`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${accent}15`; }}>
                    {cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" style={{ background: '#070B14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Co mówią trenerzy?</h2>
            <p style={{ color: '#64748B' }}>Dołącz do ponad 2400 trenerów, którzy już zmienili sposób pracy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  ))}
                </div>
                <p className="text-sm mb-5" style={{ color: '#94A3B8', lineHeight: 1.7, fontStyle: 'italic' }}>"{text}"</p>
                <div>
                  <p className="text-sm text-white" style={{ fontWeight: 600 }}>{name}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24" id="cennik">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Przejrzyste ceny</h2>
            <p style={{ color: '#64748B' }}>Zacznij za darmo, skaluj w miarę wzrostu biznesu. Anuluj kiedy chcesz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Basic', price: '79', period: '/mies.', color: '#2563EB', recommended: false,
                features: ['Do 15 klientów', 'Kreator planów', 'Monitoring progresu', 'Podstawowe raporty', 'Email support'],
              },
              {
                name: 'Pro', price: '129', period: '/mies.', color: '#06B6D4', recommended: true,
                features: ['Do 60 klientów', 'Wszystko z Basic', 'Automatyczne płatności', 'Zaawansowane raporty', 'Automatyczne przypomnienia', 'Priorytetowy support', 'Eksport CSV'],
              },
              {
                name: 'Studio', price: '249', period: '/mies.', color: '#8B5CF6', recommended: false,
                features: ['Nielimitowani klienci', 'Wszystko z Pro', 'Do 10 trenerów', 'Panel zarządzania zespołem', 'Raporty przychodów', 'API dostęp', 'Dedykowany opiekun'],
              },
            ].map(({ name, price, period, color, recommended, features }) => (
              <div key={name} className={`relative p-6 rounded-2xl ${recommended ? 'scale-105' : ''}`}
                style={{ background: '#0A0F1A', border: recommended ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.06)', boxShadow: recommended ? `0 0 40px ${color}20` : 'none' }}>
                {recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs text-white" style={{ background: `linear-gradient(135deg, ${color}, #2563EB)`, fontWeight: 700 }}>
                    Najpopularniejszy
                  </div>
                )}
                <p className="text-white mb-1" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{name}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-white" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{price} zł</span>
                  <span className="mb-2 text-sm" style={{ color: '#475569' }}>{period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                      <Check size={14} style={{ color, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/rejestracja"
                  onClick={() => {
                    trackCTAClick(`Pricing ${name} CTA`);
                    trackRegistrationStart();
                  }}
                  className="block text-center py-3 rounded-xl text-sm text-white transition-all"
                  style={{ background: recommended ? `linear-gradient(135deg, ${color}, #2563EB)` : 'rgba(255,255,255,0.05)', border: recommended ? 'none' : `1px solid rgba(255,255,255,0.1)`, fontWeight: 600 }}>
                  Rozpocznij 14-dniowy trial
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm" style={{ color: '#334155' }}>Wszystkie plany zawierają 14-dniowy bezpłatny trial · Bez karty kredytowej</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24" style={{ background: '#070B14' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Często zadawane pytania</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={q} className="rounded-xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-white" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q}</span>
                  <ChevronDown size={18} style={{ color: '#475569', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm" style={{ color: '#64748B', lineHeight: 1.7 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(37,99,235,0.2)' }}>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Gotowy na zmianę?
            </h2>
            <p className="mb-8" style={{ color: '#64748B', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Dołącz do 2400+ trenerów, którzy odzyskali czas, zwiększyli przychody i działają jak prawdziwi profesjonaliści.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rejestracja"
                onClick={() => {
                  trackCTAClick('Final Register CTA');
                  trackRegistrationStart();
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700, fontSize: '1rem' }}>
                Rozpocznij 14-dniowy trial <ArrowRight size={18} />
              </Link>
              <Link to="/demo"
                onClick={() => {
                  trackCTAClick('Final Demo CTA');
                  trackDemoClick();
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9', fontWeight: 600 }}>
                Zarezerwuj demo
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              {[Shield, RefreshCw, Zap].map((Icon, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm" style={{ color: '#334155' }}>
                  <Icon size={14} />
                  <span>{['RODO compliant', 'Anuluj kiedy chcesz', '14 dni za darmo'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
