// Funkcje do śledzenia eventów - będą używane ręcznie w komponentach

export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // @ts-ignore
    window.gtag('event', action, params);
  }
};

// Eventy biznesowe
export const trackRegistrationStart = () => {
  trackEvent('registration_start', {
    category: 'User',
    label: 'Registration Flow Started'
  });
};

export const trackRegistrationComplete = () => {
  trackEvent('registration_complete', {
    category: 'User',
    label: 'Registration Completed'
  });
};

export const trackTrialStart = () => {
  trackEvent('trial_start', {
    category: 'Conversion',
    label: '14-day Trial Started'
  });
};

export const trackDemoClick = () => {
  trackEvent('demo_click', {
    category: 'Engagement',
    label: 'Demo Request Clicked'
  });
};

export const trackPurchase = (plan: string, value: number) => {
  trackEvent('purchase', {
    category: 'Ecommerce',
    label: `Purchased ${plan}`,
    value: value,
    currency: 'PLN'
  });
};

export const trackUpgrade = (fromPlan: string, toPlan: string) => {
  trackEvent('upgrade', {
    category: 'Ecommerce',
    label: `Upgraded from ${fromPlan} to ${toPlan}`
  });
};

export const trackCTAClick = (ctaName: string) => {
  trackEvent('cta_click', {
    category: 'Engagement',
    label: ctaName
  });
};
