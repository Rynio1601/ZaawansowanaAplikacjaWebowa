# TrainerPro - System zarządzania dla trenerów personalnych

> Kompletna aplikacja SaaS do zarządzania klientami, planami treningowymi, grafikiem sesji, płatnościami i analityką biznesową.

## 🚀 Quick Start

```bash
# Instalacja zależności
pnpm install

# Start aplikacji (dev server już działa)
# Aplikacja dostępna w przeglądarce
```

## 📋 Główne funkcjonalności

### 🎯 Zarządzanie klientami
- Lista klientów z avatarami i statusami
- Zaawansowane filtry (status, płatności)
- Wyszukiwanie wielokryteriowe (imię, email, telefon)
- Sortowanie (nazwa, postęp, sesje)
- Eksport do PDF/Excel

### 📅 Grafik sesji
- Widok tygodniowy (grid)
- Widok kalendarzowy (react-calendar)
- Filtry typu treningu
- Wyszukiwanie po kliencie
- Eksport grafiku

### 💳 Płatności
- Karty KPI (przychody, oczekujące, zaległości)
- Historia transakcji
- Filtry statusów
- Przypomnienia o płatnościach
- Eksport płatności

### 📊 Raporty i analityka
- MRR (Monthly Recurring Revenue)
- Retencja klientów
- Rozkład celów treningowych
- Sesje treningowe (zrealizowane/anulowane)
- Satysfakcja klientów (trend)
- Lejek konwersji
- Filtry czasowe
- Eksport raportów

### 📧 System powiadomień
- Przypomnienia o sesjach
- Przypomnienia o płatnościach
- Wiadomości powitalne dla nowych klientów
- Historia powiadomień

## 🛠️ Technologie

- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Router**: React Router
- **Backend**: Supabase + Deno Edge Functions (Hono)
- **Database**: Supabase (PostgreSQL + KV Store)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Export**: jsPDF + xlsx
- **Calendar**: react-calendar

## 📁 Struktura projektu

```
/src
  /app
    /components       # Reużywalne komponenty
      ExportButton.tsx
      CalendarView.tsx
      ...
    /pages            # Strony aplikacji
      /app            # Chronione strony (po logowaniu)
        DashboardPage.tsx
        KlienciPage.tsx
        GrafikPage.tsx
        PlanyPage.tsx
        PlatnosciPage.tsx
        RaportyPage.tsx
        ...
      LandingPage.tsx
      LogowaniePage.tsx
      RejestracjaPage.tsx
    /contexts         # React Context (Auth, etc.)
    /utils            # Utility functions
      api.ts          # API calls
      exportUtils.ts  # Export PDF/Excel
  /styles             # Global styles
/supabase
  /functions
    /server
      index.tsx       # Backend API (Hono)
      kv_store.tsx    # KV Store utilities
```

## 🔐 Autoryzacja

### Rejestracja
```
POST /make-server-e73d1e02/auth/signup
Body: { email, password, name, role }
```

### Logowanie
```
POST /make-server-e73d1e02/auth/signin
Body: { email, password }
```

### Protected Routes
Wszystkie endpointy `/make-server-e73d1e02/*` (poza auth) wymagają headera:
```
Authorization: Bearer <access_token>
```

## 📧 API Powiadomień

### Przypomnienie o sesji
```bash
POST /make-server-e73d1e02/notifications/session-reminder
Body: {
  clientEmail: "jan@example.com",
  clientName: "Jan Kowalski",
  sessionDate: "2026-04-30",
  sessionTime: "10:00",
  sessionType: "Trening siłowy"
}
```

### Przypomnienie o płatności
```bash
POST /make-server-e73d1e02/notifications/payment-reminder
Body: {
  clientEmail: "jan@example.com",
  clientName: "Jan Kowalski",
  amount: 500,
  dueDate: "2026-05-01"
}
```

### Wiadomość powitalna
```bash
POST /make-server-e73d1e02/notifications/welcome
Body: {
  clientEmail: "jan@example.com",
  clientName: "Jan Kowalski",
  trainerName: "Trener XYZ"
}
```

## 📊 Eksport danych

Każda główna strona ma przycisk "Eksportuj" z opcjami:
- **PDF**: Sformatowany dokument z tabelami
- **Excel**: Arkusz kalkulacyjny (.xlsx)

Funkcje eksportu znajdują się w `/src/utils/exportUtils.ts`:
- `exportToPDF(options)`
- `exportToExcel(options)`
- `exportClientsToFile(clients, format)`
- `exportScheduleToFile(sessions, format)`
- `exportPaymentsToFile(payments, format)`
- `exportPlansToFile(plans, format)`

## 🧪 Testowanie

### Scenariusze testowe
Zobacz pełną listę w `SPRINT_4_DOCUMENTATION.md` sekcja "Testy i weryfikacja".

### Quick test checklist
- [ ] Rejestracja i logowanie
- [ ] CRUD operations (klienci, plany, sesje)
- [ ] Filtry i wyszukiwanie
- [ ] Sortowanie
- [ ] Eksport PDF/Excel
- [ ] Widok kalendarza
- [ ] Responsywność (mobile)

## 📖 Dokumentacja

Pełna dokumentacja projektu znajduje się w:
- `SPRINT_4_DOCUMENTATION.md` - Kompletna dokumentacja Sprint 4

Zawiera:
- ✅ Przegląd wszystkich funkcjonalności
- ✅ System autoryzacji
- ✅ Walidacja i obsługa błędów
- ✅ Test matrix
- ✅ Lista ulepszeń
- ✅ Instrukcja demo (10 min)

## 🎨 Design

- **Motyw**: Dark mode
- **Kolory**: 
  - Primary: Blue (#2563EB) + Cyan (#06B6D4) gradient
  - Success: Green (#10B981)
  - Warning: Yellow (#F59E0B)
  - Error: Red (#EF4444)
- **Fonty**: System fonts (Arial, sans-serif)
- **Responsive**: Mobile-first approach

## 🚧 Roadmap

### Potencjalne rozszerzenia
- [ ] Integracja z Resend/SendGrid (faktyczne wysyłanie emaili)
- [ ] Kalendarz Google/Outlook sync
- [ ] Aplikacja mobilna (React Native)
- [ ] Płatności online (Stripe)
- [ ] Chat/Messaging z klientami
- [ ] Video calls (Zoom/Meet integration)
- [ ] Progres tracking (waga, wymiary, zdjęcia)
- [ ] Biblioteka ćwiczeń z video
- [ ] Multi-language support

## 📝 Licencja

Projekt edukacyjny - Sprint 4.

---

**Ostatnia aktualizacja**: 28 kwietnia 2026
**Wersja**: 1.1.0
**Status**: ✅ Production ready (backend email mock)
