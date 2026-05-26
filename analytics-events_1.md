# Lista wszystkich eventów analitycznych w kodzie

## 1. Rejestracja użytkownika

```ts
// src/app/analytics/ga4.ts
trackRegistrationStart()     // Rozpoczęcie rejestracji
trackRegistrationComplete()  // Zakończenie rejestracji
trackTrialStart()            // Rozpoczęcie trialu
```

### Miejsca użycia:

- `RejestracjaPage.tsx` — linie: 45, 55, 56, 128, 158
- `LandingPage.tsx` — linie: 92, 232, 334, 422, 494
- `CennikPage.tsx` — linia: 138
- `DemoPage.tsx` — linie: 57, 67, 204
- `PersonaPage.tsx` — linie: 53, 59, 127, 199
- `LogowaniePage.tsx` — linie: 127, 128

---

## 2. Demo

```ts
// src/app/analytics/ga4.ts
trackDemoClick() // Kliknięcie demo
```

### Miejsca użycia:

- `LandingPage.tsx` — linie: 93, 233, 335, 423, 495
- `DemoPage.tsx` — linie: 57, 67, 204
- `CennikPage.tsx` — linia: 138
- `PersonaPage.tsx` — linie: 53, 59, 127, 199

---

## 3. CTA Clicks

```ts
// src/app/analytics/ga4.ts
trackCTAClick() // Kliknięcia CTA
```

### Miejsca użycia:

- `LandingPage.tsx`
  - linie: 92–93
  - linie: 232–233
  - linie: 334–335
  - linie: 422–423
  - linie: 494–495

- `CennikPage.tsx` — linia: 138
- `DemoPage.tsx` — linie: 57, 204
- `LogowaniePage.tsx` — linie: 85, 127
- `RejestracjaPage.tsx` — linia: 158
- `PersonaPage.tsx`
  - linie: 53
  - linie: 59
  - linie: 127
  - linie: 199

---

## 4. Logowanie

```ts
// src/app/analytics/ga4.ts
trackEvent('login_attempt') // Próba logowania
trackEvent('login_success') // Udane logowanie
trackEvent('login_failed')  // Nieudane logowanie
trackEvent('login_error')   // Błąd serwera
trackEvent('demo_login')    // Demo logowanie
```

### Miejsca użycia:

- `LogowaniePage.tsx` — linie: 25, 32, 37, 44, 67, 85, 127

---

## 5. Wybór roli

```ts
// src/app/analytics/ga4.ts
trackEvent('role_selected') // Wybór typu trenera
```

### Miejsca użycia:

- `RejestracjaPage.tsx` — linie: 104–108

---

## 6. Page Views

```ts
// src/app/components/GoogleAnalytics.tsx
gtag('event', 'page_view', { page_path, page_title })
```

### Miejsca użycia:

- `GoogleAnalytics.tsx` — komponent podpięty pod `useLocation()` z react-router-dom
- `LandingLayout.tsx` — śledzi wszystkie strony publiczne (`/`, `/cennik`, `/demo`, itp.)
- `AuthenticatedLayout.tsx` — śledzi wszystkie strony panelu (`/app/*`)
- Wysyła event automatycznie przy każdej zmianie `location.pathname`

---

## 7. E-commerce (jeśli zaimplementowane)

```ts
// src/app/analytics/ga4.ts
trackPurchase() // Zakup subskrypcji
trackUpgrade()  // Upgrade planu
```

### Miejsca użycia:

Niezaimplementowane jeszcze, ale przygotowane do użycia.

---

# 📊 Podsumowanie eventów

| Event | Kategoria | Opis | Ilość wystąpień |
|---------|------------|-------|----------------|
| registration_start | User | Rozpoczęcie rejestracji | 10+ |
| registration_complete | User | Zakończenie rejestracji | 2 |
| trial_start | Conversion | Rozpoczęcie trialu | 3 |
| demo_click | Engagement | Kliknięcie demo | 8+ |
| cta_click | Engagement | Kliknięcia CTA | 20+ |
| login_attempt | Authentication | Próba logowania | 1 |
| login_success | Authentication | Udane logowanie | 1 |
| login_failed | Authentication | Nieudane logowanie | 1 |
| login_error | Authentication | Błąd serwera | 1 |
| demo_login | Authentication | Demo logowanie | 1 |
| role_selected | Registration | Wybór roli | 1 |
| pageview | Navigation | Odwiedziny stron | Automatyczne |

---

# 🎯 Główne konwersje śledzone

## Rejestracja użytkownika

```text
registration_start
        ↓
registration_complete
        ↓
trial_start
```

## Demo

```text
demo_click
```

## Logowanie

```text
login_success
```

## CTA

```text
cta_click
```

---

## Status implementacji

| Komponent | Status |
|-----------|--------|
| `ga4.ts` — eventy biznesowe | ✅ Zaimplementowane |
| `GoogleAnalytics.tsx` — page views | ✅ Zaimplementowane |
| `LandingLayout.tsx` — tracking publiczny | ✅ Podpięty |
| `AuthenticatedLayout.tsx` — tracking panelu | ✅ Podpięty |
| `CookieConsent.tsx` — warunkowe ładowanie GA | ✅ Zaimplementowane |
| `trackPurchase` / `trackUpgrade` | ⏳ Przygotowane, niezaimplementowane |

**Measurement ID:** `G-CJ4Z7ZJHHF`