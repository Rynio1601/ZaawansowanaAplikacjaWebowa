import { useState } from 'react';
import { Link } from 'react-router';
import { User, CreditCard, Bell, Shield, Link2, Palette, ChevronRight, Check, Zap } from 'lucide-react';

const sections = [
  { id: 'profil', icon: User, label: 'Profil' },
  { id: 'plan', icon: CreditCard, label: 'Plan i fakturowanie' },
  { id: 'powiadomienia', icon: Bell, label: 'Powiadomienia' },
  { id: 'platnosci', icon: CreditCard, label: 'Konfiguracja płatności' },
  { id: 'integracje', icon: Link2, label: 'Integracje' },
  { id: 'bezpieczenstwo', icon: Shield, label: 'Bezpieczeństwo' },
];

export function UstawieniaPage() {
  const [activeSection, setActiveSection] = useState('profil');
  const [profile, setProfile] = useState({
    name: 'Michał Kowalski', email: 'michal@trainerpro.pl', phone: '+48 600 123 456',
    specialty: 'Siłownia, Redukcja, Budowanie masy', bio: 'Certyfikowany trener personalny z 7-letnim doświadczeniem.',
  });
  const [notifications, setNotifications] = useState({
    emailPayments: true, emailReminders: true, smsReminders: false,
    weeklyReport: true, newClient: true, planSent: false,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Ustawienia</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>Zarządzaj swoim kontem i konfiguracją</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sections.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                className="w-full flex items-center justify-between px-4 py-3 transition-all"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: activeSection === id ? 'rgba(37,99,235,0.1)' : 'transparent',
                  color: activeSection === id ? '#60A5FA' : '#64748B',
                }}>
                <div className="flex items-center gap-3">
                  <Icon size={15} />
                  <span className="text-sm">{label}</span>
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profil' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Profil trenera</p>
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: '#0D1525' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700 }}>
                  M
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 600 }}>{profile.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Plan Pro · Trial aktywny</p>
                  <button className="text-xs mt-2 px-3 py-1 rounded-lg" style={{ background: 'rgba(37,99,235,0.1)', color: '#60A5FA' }}>
                    Zmień zdjęcie
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Imię i nazwisko', full: false },
                  { key: 'email', label: 'Email', full: false },
                  { key: 'phone', label: 'Telefon', full: false },
                  { key: 'specialty', label: 'Specjalizacja', full: false },
                  { key: 'bio', label: 'Bio', full: true, textarea: true },
                ].map(({ key, label, full, textarea }) => (
                  <div key={key} className={full ? 'col-span-2' : ''}>
                    <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                    {textarea ? (
                      <textarea value={profile[key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                        rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                        style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                    ) : (
                      <input value={profile[key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={save} className="mt-4 px-6 py-2.5 rounded-xl text-sm text-white flex items-center gap-2"
                style={{ background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                {saved ? <><Check size={14} /> Zapisano</> : 'Zapisz zmiany'}
              </button>
            </div>
          )}

          {activeSection === 'plan' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Twój plan</p>
              <div className="p-5 rounded-xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(37,99,235,0.3)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap size={18} style={{ color: '#60A5FA' }} />
                    <span className="text-white" style={{ fontWeight: 700 }}>Plan Pro</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}>Trial</span>
                  </div>
                  <span className="text-white" style={{ fontWeight: 700 }}>129 zł/mies.</span>
                </div>
                <p className="text-sm" style={{ color: '#60A5FA' }}>Trial kończy się: 19 marca 2026 (11 dni)</p>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: '21%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[['Do 60 klientów', '32/60'], ['Plany treningowe', '28/∞'], ['Automatyczne płatności', 'Aktywne'], ['Priorytetowy support', 'Aktywny']].map(([label, val]) => (
                  <div key={label} className="flex justify-between p-3 rounded-lg" style={{ background: '#0D1525' }}>
                    <span className="text-xs" style={{ color: '#64748B' }}>{label}</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link to="/cennik" className="flex-1 py-2.5 rounded-xl text-center text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                  Kup subskrypcję Pro
                </Link>
                <Link to="/cennik" className="flex-1 py-2.5 rounded-xl text-center text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                  Porównaj plany
                </Link>
              </div>
            </div>
          )}

          {activeSection === 'powiadomienia' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Powiadomienia</p>
              <div className="space-y-3">
                {[
                  { key: 'emailPayments', label: 'Email o płatnościach', desc: 'Powiadomienia o opłaconych i zaległych fakturach' },
                  { key: 'emailReminders', label: 'Email – przypomnienia', desc: 'Automatyczne przypomnienia o nadchodzących treningach' },
                  { key: 'smsReminders', label: 'SMS – przypomnienia', desc: 'Wiadomości SMS do klientów przed treningiem (extra koszt)' },
                  { key: 'weeklyReport', label: 'Tygodniowy raport', desc: 'Podsumowanie tygodnia wysyłane w poniedziałek' },
                  { key: 'newClient', label: 'Nowy klient', desc: 'Powiadomienie gdy nowy klient dołączy do systemu' },
                  { key: 'planSent', label: 'Plan wysłany', desc: 'Potwierdzenie po wysłaniu planu do klienta' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#0D1525' }}>
                    <div>
                      <p className="text-sm text-white">{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{desc}</p>
                    </div>
                    <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                      style={{ background: notifications[key as keyof typeof notifications] ? 'linear-gradient(135deg, #2563EB, #06B6D4)' : 'rgba(255,255,255,0.1)' }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                        style={{ left: notifications[key as keyof typeof notifications] ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'platnosci' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Konfiguracja płatności</p>
              <div className="p-5 rounded-xl mb-4" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,91,255,0.15)' }}>
                    <CreditCard size={18} style={{ color: '#8B5CF6' }} />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontWeight: 600 }}>Stripe</p>
                    <p className="text-xs" style={{ color: '#475569' }}>Bramka płatności · Nie skonfigurowano</p>
                  </div>
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D' }}>Wymagane</span>
                </div>
                <p className="text-sm mb-4" style={{ color: '#64748B', lineHeight: 1.6 }}>
                  Połącz swoje konto Stripe, aby włączyć automatyczne płatności i subskrypcje cykliczne dla klientów.
                </p>
                <button className="px-5 py-2.5 rounded-xl text-sm text-white" style={{ background: '#635BFF', fontWeight: 600 }}>
                  Połącz ze Stripe
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Waluta', value: 'PLN (złoty polski)' },
                  { label: 'Prowizja Stripe', value: '1.4% + 0.25 EUR' },
                  { label: 'Cykl rozliczeniowy', value: 'Miesięcznie' },
                  { label: 'Faktury', value: 'Automatyczne' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: '#0D1525' }}>
                    <p className="text-xs" style={{ color: '#475569' }}>{label}</p>
                    <p className="text-sm mt-1 text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'integracje' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Integracje</p>
              <div className="space-y-3">
                {[
                  { name: 'Google Calendar', desc: 'Synchronizuj grafik z Google Calendar', color: '#4285F4', status: 'available' },
                  { name: 'Stripe', desc: 'Bramka płatności dla subskrypcji', color: '#635BFF', status: 'required' },
                  { name: 'Mailchimp', desc: 'Email marketing do klientów', color: '#FFE01B', status: 'available' },
                  { name: 'WhatsApp Business', desc: 'Komunikacja z klientami', color: '#25D366', status: 'coming' },
                  { name: 'Google Analytics', desc: 'Analityka strony i konwersji', color: '#F4B400', status: 'available' },
                ].map(({ name, desc, color, status }) => (
                  <div key={name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#0D1525' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: `${color}20`, color }}>
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-white">{name}</p>
                        <p className="text-xs" style={{ color: '#475569' }}>{desc}</p>
                      </div>
                    </div>
                    {status === 'coming' ? (
                      <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(100,116,139,0.1)', color: '#64748B' }}>Wkrótce</span>
                    ) : (
                      <button className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ background: `${color}25`, border: `1px solid ${color}40`, color }}>
                        Połącz
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'bezpieczenstwo' && (
            <div className="p-6 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white mb-5" style={{ fontWeight: 600, fontSize: '1rem' }}>Bezpieczeństwo</p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: '#0D1525' }}>
                  <p className="text-white mb-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Zmień hasło</p>
                  {['Obecne hasło', 'Nowe hasło', 'Potwierdź nowe hasło'].map(label => (
                    <div key={label} className="mb-3">
                      <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: '#080D18', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                    </div>
                  ))}
                  <button onClick={save} className="px-5 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                    {saved ? '✓ Zmieniono' : 'Zmień hasło'}
                  </button>
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#0D1525' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weryfikacja dwuetapowa (2FA)</p>
                      <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Zwiększ bezpieczeństwo swojego konta</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA' }}>
                      Włącz
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-white mb-1" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F87171' }}>Strefa niebezpieczna</p>
                  <p className="text-xs mb-3" style={{ color: '#475569' }}>Trwale usuń swoje konto i wszystkie dane.</p>
                  <button className="text-xs px-4 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                    Usuń konto
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
