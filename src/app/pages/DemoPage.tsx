import { Link } from 'react-router-dom';
import { Calendar, Clock, Check, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { SeoHead } from '../components/SeoHead'; 
import { 
  trackDemoClick,
  trackRegistrationStart,
  trackCTAClick
} from '../analytics/ga4';

const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const days = [
  { day: 'Pon', date: '9 mar', slots: 3 },
  { day: 'Wt', date: '10 mar', slots: 2 },
  { day: 'Śr', date: '11 mar', slots: 4 },
  { day: 'Czw', date: '12 mar', slots: 1 },
  { day: 'Pt', date: '13 mar', slots: 3 },
];

export function DemoPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', clients: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackDemoClick();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <SeoHead 
          title="Demo zarezerwowane | TrainerPro"
          description="Twoje demo TrainerPro zostało zarezerwowane. Potwierdzenie wysłaliśmy na Twój email."
          pathname="/demo"
        />
        
        <div style={{ paddingTop: 100 }}>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <Check size={32} style={{ color: '#34D399' }} />
              </div>
              <h2 className="text-white mb-3" style={{ fontSize: '1.8rem', fontWeight: 800 }}>Demo zarezerwowane!</h2>
              <p className="mb-6" style={{ color: '#64748B', lineHeight: 1.7 }}>
                Potwierdzenie wysłaliśmy na <strong style={{ color: '#94A3B8' }}>{form.email}</strong>. Nasz specjalista skontaktuje się z Tobą przed demo.
              </p>
              <div className="p-4 rounded-xl mb-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  {selectedDay && selectedTime ? `${selectedDay}, godz. ${selectedTime}` : 'Termin do ustalenia'}
                </p>
              </div>
              <Link to="/rejestracja" 
                onClick={() => {
                  trackCTAClick('Demo Success Register CTA');
                  trackRegistrationStart();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                Lub zacznij trial już teraz <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoHead pageKey="demo" />
      
      <div style={{ paddingTop: 100 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              <h1 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Zarezerwuj bezpłatne demo
              </h1>
              <p className="mb-8" style={{ color: '#64748B', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Porozmawiaj z naszym specjalistą i przekonaj się, jak TrainerPro zmieni Twój sposób pracy. Demo trwa 30 minut.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Clock, text: '30-minutowa sesja online' },
                  { icon: Users, text: 'Dopasowana do Twojego profilu trenera' },
                  { icon: Check, text: 'Bez presji sprzedażowej' },
                  { icon: Calendar, text: 'Wybierz termin w kalendarzu' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
                      <Icon size={16} style={{ color: '#60A5FA' }} />
                    </div>
                    <span className="text-sm" style={{ color: '#94A3B8' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* What you'll see */}
              <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-white mb-3" style={{ fontWeight: 600 }}>Co zobaczysz na demo:</p>
                <ul className="space-y-2">
                  {['Panel klienta i dodawanie planu treningowego', 'Automatyczne powiadomienia i przypomnienia', 'Dashboard z raportami i KPI', 'System płatności i fakturowania', 'Onboarding nowego klienta krok po kroku'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                      <Check size={13} style={{ color: '#06B6D4', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <form onSubmit={handleSubmit}>
                {/* Calendar */}
                <div className="mb-6">
                  <p className="text-white mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Wybierz dzień</p>
                  <div className="grid grid-cols-5 gap-2">
                    {days.map(({ day, date, slots }) => (
                      <button type="button" key={date}
                        onClick={() => setSelectedDay(date)}
                        className="p-2 rounded-xl text-center transition-all"
                        style={{
                          background: selectedDay === date ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.03)',
                          border: selectedDay === date ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.06)',
                          color: selectedDay === date ? '#60A5FA' : '#64748B',
                        }}>
                        <p className="text-xs" style={{ fontWeight: 600 }}>{day}</p>
                        <p className="text-xs mt-0.5">{date}</p>
                        <p className="text-xs mt-1" style={{ color: '#34D399' }}>{slots} wolnych</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDay && (
                  <div className="mb-6">
                    <p className="text-white mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Wybierz godzinę</p>
                    <div className="grid grid-cols-4 gap-2">
                      {times.map(t => (
                        <button type="button" key={t}
                          onClick={() => setSelectedTime(t)}
                          className="py-2 rounded-lg text-sm transition-all"
                          style={{
                            background: selectedTime === t ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.03)',
                            border: selectedTime === t ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.06)',
                            color: selectedTime === t ? '#60A5FA' : '#64748B',
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { key: 'name', label: 'Imię i nazwisko', placeholder: 'Jan Kowalski', full: true },
                    { key: 'email', label: 'Email służbowy', placeholder: 'jan@trener.pl', full: false },
                    { key: 'phone', label: 'Telefon', placeholder: '+48 123 456 789', full: false },
                  ].map(({ key, label, placeholder, full }) => (
                    <div key={key} className={full ? 'col-span-2' : ''}>
                      <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Ile masz klientów?</label>
                  <select
                    value={form.clients}
                    onChange={e => setForm({ ...form, clients: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>
                    <option value="">Wybierz...</option>
                    <option>Dopiero zaczynam</option>
                    <option>1–10 klientów</option>
                    <option>10–30 klientów</option>
                    <option>30–60 klientów</option>
                    <option>60+ klientów</option>
                    <option>Studio / Zespół trenerów</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700, fontSize: '0.95rem' }}>
                  Zarezerwuj demo →
                </button>
                <p className="text-center text-xs mt-3" style={{ color: '#334155' }}>Możesz też zacząć od razu: <Link to="/rejestracja" 
                  onClick={() => {
                    trackCTAClick('Demo Form Register CTA');
                    trackRegistrationStart();
                  }}
                  style={{ color: '#60A5FA' }}>14-dniowy trial za darmo</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
