import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';

export function LandingLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen" style={{ background: '#06080F', color: '#F1F5F9' }}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}
        style={{ background: scrolled ? 'rgba(6,8,15,0.95)' : 'transparent', backdropFilter: 'blur(12px)', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>TrainerPro</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                >
                  Funkcje <ChevronDown size={14} />
                </button>
                {featuresOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl p-2 z-50"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseLeave={() => setFeaturesOpen(false)}>
                    {[['CRM Klientów', '/app/klienci'], ['Kreator Planów', '/app/plany'], ['Monitoring Progresu', '/app/progres'], ['Płatności Online', '/app/platnosci'], ['Raporty Biznesowe', '/app/raporty']].map(([label, path]) => (
                      <Link key={label} to={path} className="block px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{ color: '#94A3B8' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {[['Dla kogo', '/dla-trenera-personalnego'], ['Cennik', '/cennik'], ['Demo', '/demo']].map(([label, path]) => (
                <Link key={label} to={path} className="px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/logowanie" className="px-4 py-2 text-sm rounded-lg transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                Zaloguj się
              </Link>
              <Link to="/rejestracja" className="px-5 py-2.5 text-sm rounded-lg text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Rozpocznij za darmo
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: '#94A3B8' }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 mx-4 rounded-2xl p-4" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.08)' }}>
            <nav className="flex flex-col gap-1">
              {[['Strona główna', '/'], ['Funkcje', '/app/dashboard'], ['Dla trenera personalnego', '/dla-trenera-personalnego'], ['Dla trenera online', '/dla-trenera-online'], ['Dla studia', '/dla-studia-treningowego'], ['Cennik', '/cennik'], ['Demo', '/demo']].map(([label, path]) => (
                <Link key={label} to={path} className="px-4 py-2.5 rounded-lg text-sm" style={{ color: '#94A3B8' }}>
                  {label}
                </Link>
              ))}
              <div className="border-t mt-2 pt-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <Link to="/rejestracja" className="block w-full text-center py-2.5 rounded-lg text-white text-sm mt-1"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                  Rozpocznij za darmo
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#060810', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-white" style={{ fontWeight: 700 }}>TrainerPro</span>
              </Link>
              <p className="text-sm mb-4" style={{ color: '#475569', lineHeight: 1.7 }}>
                Platforma SaaS dla trenerów personalnych. Zarządzaj klientami, planami, płatnościami i komunikacją w jednym systemie.
              </p>
              <p className="text-xs" style={{ color: '#334155' }}>© 2026 TrainerPro. Wszelkie prawa zastrzeżone.</p>
            </div>
            <div>
              <p className="text-sm mb-4" style={{ color: '#F1F5F9', fontWeight: 600 }}>Produkt</p>
              <div className="flex flex-col gap-2">
                {[['Funkcje', '/app/dashboard'], ['Cennik', '/cennik'], ['Demo', '/demo'], ['Integracje', '/']].map(([l, p]) => (
                  <Link key={l} to={p} className="text-sm transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-4" style={{ color: '#F1F5F9', fontWeight: 600 }}>Dla kogo</p>
              <div className="flex flex-col gap-2">
                {[['Trener stacjonarny', '/dla-trenera-personalnego'], ['Trener online', '/dla-trenera-online'], ['Studio treningowe', '/dla-studia-treningowego']].map(([l, p]) => (
                  <Link key={l} to={p} className="text-sm transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-4" style={{ color: '#F1F5F9', fontWeight: 600 }}>Firma</p>
              <div className="flex flex-col gap-2">
                {[['O nas', '/'], ['Blog', '/'], ['Kontakt', '/'], ['Polityka prywatności', '/'], ['Regulamin', '/']].map(([l, p]) => (
                  <Link key={l} to={p} className="text-sm transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
