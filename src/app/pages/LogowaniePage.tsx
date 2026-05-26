import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { SeoHead } from '../components/SeoHead';
import { 
  trackEvent,
  trackCTAClick,
  trackRegistrationStart
} from '../analytics/ga4';

export function LogowaniePage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Śledź próbę logowania
    trackEvent('login_attempt', {
      category: 'Authentication',
      label: 'Login Form Submit'
    });
    
    setLoading(true);
    try {
      const result = await signIn(form.email, form.password);
      
      if (result.success) {
        trackEvent('login_success', {
          category: 'Authentication',
          label: 'Successful Login'
        });
        toast.success('Zalogowano pomyślnie!');
        navigate('/app/dashboard');
      } else {
        trackEvent('login_failed', {
          category: 'Authentication',
          label: 'Failed Login Attempt'
        });
        toast.error(result.error || 'Błąd logowania');
      }
    } catch (error) {
      trackEvent('login_error', {
        category: 'Authentication',
        label: 'Login Server Error'
      });
      toast.error('Błąd połączenia z serwerem');
      console.error('Signin error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead pageKey="login" />
      
      <div style={{ paddingTop: 80, minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-white" style={{ fontWeight: 700, fontSize: '1.2rem' }}>TrainerPro</span>
            </Link>
            <h1 className="text-white mt-4 mb-2" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Zaloguj się</h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Wróć do swojego panelu TrainerPro</p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="jan@example.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs" style={{ color: '#64748B' }}>Hasło</label>
                  <Link to="/" 
                    onClick={() => {
                      trackCTAClick('Forgot Password CTA');
                    }}
                    className="text-xs" style={{ color: '#60A5FA' }}>Zapomniałeś hasła?</Link>
                </div>
                <div className="relative">
                  <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Twoje hasło" className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 700 }}>
                Zaloguj się →
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs" style={{ color: '#334155' }}>lub</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Quick demo login */}
            <button 
              onClick={() => {
                trackEvent('demo_login', {
                  category: 'Authentication',
                  label: 'Quick Demo Login'
                });
                navigate('/app/dashboard');
              }}
              className="w-full py-3 rounded-xl text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}>
              🎯 Zaloguj jako demo (bez hasła)
            </button>

            <p className="text-center text-xs mt-4" style={{ color: '#334155' }}>
              Nie masz konta? <Link to="/rejestracja" 
                onClick={() => {
                  trackCTAClick('Login Page Register CTA');
                  trackRegistrationStart();
                }}
                style={{ color: '#60A5FA' }}>Zarejestruj się za darmo</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
