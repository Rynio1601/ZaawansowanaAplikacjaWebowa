import { Link } from 'react-router-dom';
import { Check, X, Zap, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { 
  trackCTAClick, 
  trackRegistrationStart, 
  trackDemoClick 
} from '../analytics/ga4';

const plans = [
  {
    name: 'Freemium',
    price: { monthly: '0', yearly: '0' },
    period: '/zawsze',
    color: '#475569',
    desc: 'Dla trenerów, którzy zaczynają',
    features: [
      { text: 'Do 5 klientów', ok: true },
      { text: 'Kreator planów (3/mies.)', ok: true },
      { text: 'Monitoring progresu', ok: true },
      { text: 'Podstawowe raporty', ok: false },
      { text: 'Automatyczne płatności', ok: false },
      { text: 'Automatyczne przypomnienia', ok: false },
      { text: 'Support', ok: true },
    ],
    cta: 'Zacznij za darmo',
    recommended: false,
  },
  {
    name: 'Basic',
    price: { monthly: '79', yearly: '63' },
    period: '/mies.',
    color: '#2563EB',
    desc: 'Dla trenerów stacjonarnych',
    features: [
      { text: 'Do 15 klientów', ok: true },
      { text: 'Kreator planów (nielimitowany)', ok: true },
      { text: 'Monitoring progresu', ok: true },
      { text: 'Podstawowe raporty', ok: true },
      { text: 'Automatyczne płatności', ok: false },
      { text: 'Automatyczne przypomnienia', ok: true },
      { text: 'Email support', ok: true },
    ],
    cta: 'Rozpocznij trial',
    recommended: false,
  },
  {
    name: 'Pro',
    price: { monthly: '129', yearly: '103' },
    period: '/mies.',
    color: '#06B6D4',
    desc: 'Dla trenerów online i rozwijających się',
    features: [
      { text: 'Do 60 klientów', ok: true },
      { text: 'Kreator planów (nielimitowany)', ok: true },
      { text: 'Monitoring progresu', ok: true },
      { text: 'Zaawansowane raporty + eksport', ok: true },
      { text: 'Automatyczne płatności (Stripe)', ok: true },
      { text: 'Automatyczne przypomnienia SMS/email', ok: true },
      { text: 'Priorytetowy support', ok: true },
    ],
    cta: 'Rozpocznij trial',
    recommended: true,
  },
  {
    name: 'Studio',
    price: { monthly: '249', yearly: '199' },
    period: '/mies.',
    color: '#8B5CF6',
    desc: 'Dla studiów treningowych i zespołów',
    features: [
      { text: 'Nielimitowani klienci', ok: true },
      { text: 'Kreator planów (nielimitowany)', ok: true },
      { text: 'Monitoring progresu', ok: true },
      { text: 'Pełne raporty biznesowe', ok: true },
      { text: 'Automatyczne płatności (Stripe)', ok: true },
      { text: 'Automatyczne przypomnienia SMS/email', ok: true },
      { text: 'Zarządzanie zespołem (do 10 trenerów)', ok: true },
    ],
    cta: 'Umów demo',
    recommended: false,
  },
];

export function CennikPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <SeoHead pageKey="pricing" />
      
      <div style={{ paddingTop: 100 }}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Przejrzyste ceny.<br />Bez niespodzianek.
            </h1>
            <p className="mb-8" style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Zacznij za darmo, skaluj w miarę wzrostu. Anuluj kiedy chcesz – bez żadnych zobowiązań.
            </p>
            {/* Toggle */}
            <div className="inline-flex items-center gap-4 p-1 rounded-xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setYearly(false)} className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ background: !yearly ? '#1E3A5F' : 'transparent', color: !yearly ? '#60A5FA' : '#475569', fontWeight: !yearly ? 600 : 400 }}>
                Miesięczny
              </button>
              <button onClick={() => setYearly(true)} className="px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                style={{ background: yearly ? '#1E3A5F' : 'transparent', color: yearly ? '#60A5FA' : '#475569', fontWeight: yearly ? 600 : 400 }}>
                Roczny
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', fontWeight: 700 }}>-20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plans grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {plans.map(({ name, price, period, color, desc, features, cta, recommended }) => (
                <div key={name} className={`relative p-6 rounded-2xl flex flex-col ${recommended ? 'ring-2' : ''}`}
                  style={{ 
                    background: '#0A0F1A', 
                    border: `1px solid ${recommended ? color : 'rgba(255,255,255,0.06)'}`, 
                    boxShadow: recommended ? `0 0 40px ${color}20` : 'none'
                  }}>
                  {recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs text-white" style={{ background: `linear-gradient(135deg, ${color}, #2563EB)`, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      Najpopularniejszy
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-sm" style={{ color, fontWeight: 700 }}>{name}</span>
                    </div>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-white" style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{yearly ? price.yearly : price.monthly} zł</span>
                      <span className="mb-1.5 text-sm" style={{ color: '#475569' }}>{period}</span>
                    </div>
                    {yearly && name !== 'Freemium' && (
                      <p className="text-xs" style={{ color: '#34D399' }}>Oszczędzasz {(parseInt(price.monthly) - parseInt(price.yearly)) * 12} zł/rok</p>
                    )}
                    <p className="text-sm mt-2" style={{ color: '#475569' }}>{desc}</p>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {features.map(({ text, ok }) => (
                      <li key={text} className="flex items-start gap-2 text-sm" style={{ color: ok ? '#94A3B8' : '#2D3748' }}>
                        {ok ? <Check size={14} style={{ color, flexShrink: 0, marginTop: 2 }} /> : <X size={14} style={{ color: '#334155', flexShrink: 0, marginTop: 2 }} />}
                        {text}
                      </li>
                    ))}
                  </ul>
                  <Link to={name === 'Freemium' ? '/rejestracja' : name === 'Studio' ? '/demo' : '/rejestracja'}
                    onClick={() => {
                      trackCTAClick(`Pricing ${name} CTA`);
                      if (name === 'Freemium' || name !== 'Studio') {
                        trackRegistrationStart();
                      } else if (name === 'Studio') {
                        trackDemoClick();
                      }
                    }}
                    className="block text-center py-3 rounded-xl text-sm transition-all"
                    style={{
                      background: recommended ? `linear-gradient(135deg, ${color}, #2563EB)` : 'rgba(255,255,255,0.05)',
                      border: recommended ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      color: recommended ? '#fff' : '#94A3B8',
                      fontWeight: 600,
                    }}>
                    {cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Features comparison */}
            <div className="mt-20">
              <h2 className="text-white text-center mb-10" style={{ fontSize: '1.6rem', fontWeight: 700 }}>Wszystkie funkcje w jednym miejscu</h2>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="grid grid-cols-5 gap-0 text-sm" style={{ background: '#0D1525' }}>
                  <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#475569' }}>Funkcja</span>
                  </div>
                  {['Freemium', 'Basic', 'Pro', 'Studio'].map((p, i) => (
                    <div key={p} className="p-4 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: [plans[0].color, plans[1].color, plans[2].color, plans[3].color][i], fontWeight: 700 }}>
                      {p}
                    </div>
                  ))}
                </div>
                {[
                  ['Liczba klientów', '5', '15', '60', '∞'],
                  ['Plany treningowe', '3/mies.', '∞', '∞', '∞'],
                  ['Monitoring progresu', '✓', '✓', '✓', '✓'],
                  ['Raporty', '—', 'Podstawowe', 'Zaawansowane', 'Pełne'],
                  ['Automatyczne płatności', '—', '—', '✓', '✓'],
                  ['Przypomnienia', '—', 'Email', 'SMS+Email', 'SMS+Email'],
                  ['Eksport CSV', '—', '—', '✓', '✓'],
                  ['Zarządzanie zespołem', '—', '—', '—', 'do 10 trenerów'],
                  ['API dostęp', '—', '—', '—', '✓'],
                ].map(([feature, ...vals], idx) => (
                  <div key={feature} className="grid grid-cols-5 text-sm" style={{ background: idx % 2 === 0 ? '#0A0F1A' : '#080D18' }}>
                    <div className="p-4" style={{ color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{feature}</div>
                    {vals.map((v, i) => (
                      <div key={i} className="p-4 text-center" style={{ color: v === '—' ? '#2D3748' : '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div className="mt-16 text-center p-8 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <Shield size={26} style={{ color: '#34D399' }} />
              </div>
              <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: '1.2rem' }}>Gwarancja 30 dni zwrotu pieniędzy</h3>
              <p style={{ color: '#64748B', maxWidth: 450, margin: '0 auto', lineHeight: 1.7 }}>
                Jeśli w ciągu 30 dni uznasz, że TrainerPro nie spełnia Twoich oczekiwań, zwrócimy Ci całą kwotę. Bez pytań.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ mini */}
        <section className="py-16 text-center">
          <p style={{ color: '#475569' }}>Masz pytania? <Link to="/demo" 
            onClick={() => {
              trackCTAClick('Pricing FAQ Demo CTA');
              trackDemoClick();
            }}
            style={{ color: '#60A5FA' }}>Porozmawiaj z nami</Link> lub <Link to="/demo" 
            onClick={() => {
              trackCTAClick('Pricing FAQ Demo CTA 2');
              trackDemoClick();
            }}
            style={{ color: '#60A5FA' }}>zarezerwuj demo</Link>.</p>
        </section>
      </div>
    </>
  );
}
