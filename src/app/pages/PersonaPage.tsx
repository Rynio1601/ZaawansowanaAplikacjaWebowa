import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';

const TRAINER_IMG = 'https://images.unsplash.com/photo-1758875568932-0eefd3e60090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMG1hbiUyMHBlcnNvbmFsJTIwdHJhaW5lciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2OTg4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080';
const ONLINE_IMG = 'https://images.unsplash.com/photo-1713865469900-d12502a39875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWluZXIlMjBvbmxpbmUlMjBjb2FjaGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzI2OTg4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080';
const STUDIO_IMG = 'https://images.unsplash.com/photo-1750698544794-bf1cd7038f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3R1ZGlvJTIwZ3ltJTIwb3duZXIlMjBidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzcyNjk4ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080';

const personaData = {
  stationary: {
    img: TRAINER_IMG,
    badge: 'Trener stacjonarny',
    badgeColor: '#2563EB',
    headline: 'Zautomatyzuj swoją pracę i skup się na treningu',
    sub: 'Masz 10–25 klientów i spędzasz za dużo czasu na administracji? TrainerPro automatyzuje rutynowe zadania, żebyś mógł robić to, co kochasz.',
    cta: 'Wypróbuj za darmo',
    painPoints: ['Rozproszony komunikacja przez Messenger/WhatsApp', 'Plany treningowe tworzone ręcznie w PDF/Excel', 'Brak systemu przypomnień o treningach', 'Trudność w śledzeniu postępów klientów'],
    benefits: ['Twórz plany treningowe w 5 minut', 'Automatyczne przypomnienia SMS i email', 'Monitoring progresu z wykresami', 'Wszystkie rozmowy z klientami w jednym miejscu', 'Profesjonalny wygląd przed klientami'],
    stats: [{ val: '3h', desc: 'zaoszczędzone dziennie' }, { val: '98%', desc: 'retencja klientów' }, { val: '5min', desc: 'tworzenie planu' }],
    quote: '"Odkąd korzystam z TrainerPro, moi klienci są bardziej zaangażowani. Plany treningowe tworzę 10x szybciej, a przypomnienia o treningach wysyłają się automatycznie."',
    quotePerson: 'Michał T., trener od 5 lat',
  },
  online: {
    img: ONLINE_IMG,
    badge: 'Trener online',
    badgeColor: '#06B6D4',
    headline: 'Skaluj biznes online bez zatrudniania asystenta',
    sub: 'Prowadzisz 40–100 klientów i ręczna praca zaczyna Cię przytłaczać? Zautomatyzuj onboarding, płatności i komunikację z klientami.',
    cta: 'Zobacz jak to działa',
    painPoints: ['Ręczny onboarding każdego nowego klienta', 'Problemy z ściąganiem należności', 'Brak systemu CRM do zarządzania klientami', 'Trudność w monitorowaniu progresu wielu klientów'],
    benefits: ['Automatyczny onboarding nowych klientów', 'Cykliczne płatności Stripe bez ręcznej obsługi', 'CRM z pełną historią każdego klienta', 'Raporty progresu wysyłane automatycznie', 'Skaluj do 100+ klientów bez chaosu'],
    stats: [{ val: '40%', desc: 'wzrost przychodów' }, { val: '100+', desc: 'klientów bez stresu' }, { val: '0h', desc: 'na ściąganie należności' }],
    quote: '"Mój biznes online urósł z 30 do 85 klientów w 8 miesięcy. Automatyzacja onboardingu i płatności pozwoliła mi skupić się na jakości, nie papierologii."',
    quotePerson: 'Karolina W., trener online',
  },
  studio: {
    img: STUDIO_IMG,
    badge: 'Studio treningowe',
    badgeColor: '#8B5CF6',
    headline: 'Zarządzaj zespołem trenerów w jednym systemie',
    sub: 'Masz studio z kilkoma trenerami i potrzebujesz pełnej kontroli nad biznesem, grafikiem i przychodami? TrainerPro Studio to rozwiązanie dla Ciebie.',
    cta: 'Umów demo',
    painPoints: ['Brak centralnego systemu dla zespołu trenerów', 'Trudność w monitorowaniu przychodów i KPI', 'Nieskoordynowany grafik i rezerwacje', 'Brak raportów biznesowych i analityki'],
    benefits: ['Panel zarządzania dla właściciela i trenerów', 'Wspólna baza klientów i plany', 'Raporty przychodów i KPI w czasie rzeczywistym', 'Grafik i rezerwacje bez konfliktów', 'Role i uprawnienia dla każdego trenera'],
    stats: [{ val: '10', desc: 'trenerów w jednym systemie' }, { val: '200%', desc: 'lepsza przejrzystość biznesu' }, { val: '∞', desc: 'klientów bez limitu' }],
    quote: '"Zamiast używać 5 różnych narzędzi, mam teraz wszystko w jednym miejscu. Widzę przychody każdego trenera, grafik i postępy klientów na jednym ekranie."',
    quotePerson: 'Tomasz K., właściciel FitStudio',
  },
};

interface PersonaPageProps {
  persona: 'stationary' | 'online' | 'studio';
}

export function PersonaPage({ persona }: PersonaPageProps) {
  const data = personaData[persona];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% -10%, ${data.badgeColor}15 0%, transparent 60%)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                style={{ background: `${data.badgeColor}15`, border: `1px solid ${data.badgeColor}40`, color: data.badgeColor }}>
                {data.badge}
              </span>
              <h1 className="text-white mb-5" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {data.headline}
              </h1>
              <p className="mb-8" style={{ color: '#64748B', lineHeight: 1.8, fontSize: '1.05rem' }}>{data.sub}</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/rejestracja" className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${data.badgeColor}, #2563EB)`, fontWeight: 700 }}>
                  {data.cta} <ArrowRight size={16} />
                </Link>
                <Link to="/demo" className="flex items-center gap-2 px-7 py-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9', fontWeight: 600 }}>
                  Zarezerwuj demo
                </Link>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {data.stats.map(({ val, desc }) => (
                  <div key={desc} className="p-3 rounded-xl text-center" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-white" style={{ fontWeight: 800, fontSize: '1.4rem', background: `linear-gradient(135deg, ${data.badgeColor}, #2563EB)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={data.img} alt={data.badge} className="w-full h-80 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Benefits */}
      <section className="py-16" style={{ background: '#070B14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-white mb-6" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Twoje aktualne problemy</h2>
              <div className="space-y-3">
                {data.painPoints.map(p => (
                  <div key={p} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                    <span className="text-sm mt-0.5" style={{ color: '#F87171', flexShrink: 0 }}>✗</span>
                    <span className="text-sm" style={{ color: '#64748B' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-white mb-6" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Z TrainerPro zamiast tego</h2>
              <div className="space-y-3">
                {data.benefits.map(b => (
                  <div key={b} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <Check size={14} style={{ color: '#34D399', flexShrink: 0, marginTop: 2 }} />
                    <span className="text-sm" style={{ color: '#94A3B8' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white mb-4" style={{ fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic' }}>{data.quote}</p>
            <p className="text-sm" style={{ color: '#475569' }}>{data.quotePerson}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-white mb-4" style={{ fontSize: '2rem', fontWeight: 800 }}>Gotowy/a na zmianę?</h2>
          <p className="mb-8" style={{ color: '#64748B' }}>14-dniowy trial. Bez karty kredytowej. Anuluj kiedy chcesz.</p>
          <Link to="/rejestracja" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${data.badgeColor}, #2563EB)`, fontWeight: 700, fontSize: '1rem' }}>
            {data.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
