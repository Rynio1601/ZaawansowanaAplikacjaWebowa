import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Eye, EyeOff, Zap, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function RejestracjaPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { 
      setStep(2); 
      return; 
    }
    
    // Rejestracja z prawdziwym backendem
    setLoading(true);
    try {
      const result = await signUp(form.email, form.password, form.name, form.role);
      
      if (result.success) {
        toast.success('Konto zostało utworzone! Możesz się teraz zalogować.');
        navigate('/logowanie');
      } else {
        toast.error(result.error || 'Błąd rejestracji');
      }
    } catch (error) {
      toast.error('Błąd połączenia z serwerem');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }} className="flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white" style={{ fontWeight: 700, fontSize: '1.2rem' }}>TrainerPro</span>
          </Link>
          <h1 className="text-white mt-4 mb-2" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {step === 1 ? 'Zacznij 14-dniowy trial' : 'Wybierz swój profil'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            {step === 1 ? 'Bez karty kredytowej · Pełny dostęp przez 14 dni' : 'Pomożemy dopasować funkcje do Twojego biznesu'}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: s <= step ? 'linear-gradient(135deg, #2563EB, #06B6D4)' : 'rgba(255,255,255,0.05)', color: s <= step ? '#fff' : '#475569', fontWeight: 600 }}>
                  {s < step ? <Check size={12} /> : s}
                </div>
                <span className="text-xs" style={{ color: s <= step ? '#94A3B8' : '#334155' }}>{s === 1 ? 'Konto' : 'Profil'}</span>
                {s < 2 && <div className="flex-1 h-px" style={{ background: step > s ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Imię i nazwisko</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Jan Kowalski" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="jan@example.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Hasło</label>
                  <div className="relative">
                    <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimum 8 znaków" className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                      style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl text-white mt-2"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700 }}>
                  Dalej →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {[
                  { val: 'stationary', label: 'Trener stacjonarny', desc: '10–25 klientów, siłownia / park' },
                  { val: 'online', label: 'Trener online', desc: '40–100 klientów, praca zdalna' },
                  { val: 'studio', label: 'Właściciel studia', desc: 'Zespół trenerów, wiele klientów' },
                ].map(({ val, label, desc }) => (
                  <button type="button" key={val}
                    onClick={() => setForm({ ...form, role: val })}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      background: form.role === val ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                      border: form.role === val ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <p className="text-sm" style={{ color: '#F1F5F9', fontWeight: 600 }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{desc}</p>
                  </button>
                ))}
                <button type="submit" disabled={!form.role} className="w-full py-3.5 rounded-xl text-white mt-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700 }}>
                  {loading ? 'Trwa rejestracja...' : 'Przejdź do panelu →'}
                </button>
              </div>
            )}
          </form>

          <p className="text-center text-xs mt-4" style={{ color: '#334155' }}>
            Masz już konto? <Link to="/logowanie" style={{ color: '#60A5FA' }}>Zaloguj się</Link>
          </p>
          <p className="text-center text-xs mt-2" style={{ color: '#1E293B' }}>
            Rejestrując się, akceptujesz <Link to="/" style={{ color: '#334155' }}>Regulamin</Link> i <Link to="/" style={{ color: '#334155' }}>Politykę prywatności</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}