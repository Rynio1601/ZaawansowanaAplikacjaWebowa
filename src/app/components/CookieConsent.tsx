import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GA_ID = 'G-CJ4Z7ZJHHF'; 

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    } else {
      const parsed = JSON.parse(consent);
      setPreferences(parsed);
      if (parsed.analytics) {
        loadAnalytics();
      }
    }
  }, []);

  const loadAnalytics = () => {
    // Zabezpieczenie przed podwójnym ładowaniem
    if (document.querySelector(`script[src*="${GA_ID}"]`)) return;

    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowConsent(false);
    loadAnalytics();
  };

  const acceptSelection = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowConsent(false);
    if (preferences.analytics) {
      loadAnalytics();
    }
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: '#0A0F1A',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '450px',
      zIndex: 9999,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 600 }}>
          Używamy plików cookie
        </h3>
        <button
          onClick={() => setShowConsent(false)}
          style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>
      </div>

      <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Używamy plików cookie i podobnych technologii, aby zapewnić najlepsze doświadczenia,
        analizować ruch na stronie i personalizować treści.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: 500 }}>
            Niezbędne (zawsze aktywne)
          </label>
          <span style={{ color: '#34D399', fontSize: '12px' }}>Zawsze włączone</span>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 16px 0' }}>
          Niezbędne do prawidłowego działania strony.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ color: '#F1F5F9', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            Analityczne
          </label>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 16px 0' }}>
          Pomagają nam zrozumieć, jak korzystasz z naszej strony.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ color: '#F1F5F9', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            Marketingowe
          </label>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 16px 0' }}>
          Wykorzystywane do personalizacji reklam i treści marketingowych.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: '#F1F5F9', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            Funkcjonalne
          </label>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 16px 0' }}>
          Umożliwiają dodatkowe funkcje i personalizację.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={acceptAll} style={{
          background: 'linear-gradient(135deg, #2563EB, #06B6D4)', color: 'white', border: 'none',
          padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
          fontSize: '14px', flex: 1, minWidth: '120px'
        }}>
          Akceptuj wszystkie
        </button>
        <button onClick={acceptSelection} style={{
          background: 'rgba(255,255,255,0.08)', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
          fontSize: '14px', flex: 1, minWidth: '120px'
        }}>
          Zapisz wybór
        </button>
        <button onClick={rejectAll} style={{
          background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
          flex: 1, minWidth: '100px'
        }}>
          Odrzuć
        </button>
      </div>

      <p style={{ color: '#475569', fontSize: '11px', margin: '16px 0 0 0', textAlign: 'center' }}>
        Dowiedz się więcej w naszej <a href="/polityka-prywatnosci" style={{ color: '#60A5FA' }}>Polityce Prywatności</a>
      </p>
    </div>
  );
}
