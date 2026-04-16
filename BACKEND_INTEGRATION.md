# 🚀 TrainerPro - Dokumentacja Integracji Backend

## ✅ Zrealizowane Elementy

### 1. Backend (Supabase Edge Functions)

**Lokalizacja**: `/supabase/functions/server/index.tsx`

#### Endpoints Autentykacji:
- `POST /auth/signup` - Rejestracja nowego użytkownika (trenera)
- `POST /auth/signin` - Logowanie użytkownika

#### Endpoints Klientów:
- `GET /clients` - Pobierz wszystkich klientów trenera
- `POST /clients` - Dodaj nowego klienta
- `PUT /clients/:id` - Zaktualizuj klienta
- `DELETE /clients/:id` - Usuń klienta

#### Endpoints Planów Treningowych:
- `GET /plans` - Pobierz wszystkie plany trenera
- `POST /plans` - Utwórz nowy plan
- `PUT /plans/:id` - Zaktualizuj plan
- `DELETE /plans/:id` - Usuń plan

#### Endpoints Postępu:
- `GET /progress/:clientId` - Pobierz postęp klienta
- `POST /progress/:clientId` - Dodaj wpis postępu

#### Endpoints Płatności:
- `GET /payments` - Pobierz wszystkie płatności
- `POST /payments` - Dodaj płatność

#### Endpoints Sesji/Grafiku:
- `GET /sessions` - Pobierz wszystkie sesje
- `POST /sessions` - Dodaj sesję
- `PUT /sessions/:id` - Zaktualizuj sesję
- `DELETE /sessions/:id` - Usuń sesję

#### Endpoint Dashboard:
- `GET /dashboard/stats` - Pobierz statystyki dashboardu

### 2. Frontend - Infrastruktura

**AuthContext** (`/src/app/contexts/AuthContext.tsx`):
- Context React do zarządzania sesją użytkownika
- Funkcje: `signUp`, `signIn`, `signOut`, `getAuthHeader`
- Automatyczne sprawdzanie sesji przy starcie aplikacji
- Przechowywanie danych użytkownika (name, email, role, plan)

**API Utils** (`/src/app/utils/api.ts`):
- Pomocnicze funkcje do wszystkich API calls
- Centralne zarządzanie adresem API
- Obsługa błędów i autoryzacji

**App.tsx**:
- Integracja AuthProvider
- Toaster dla powiadomień toast

### 3. Zaktualizowane Strony

#### ✅ Strona Rejestracji (`/src/app/pages/RejestracjaPage.tsx`)
- Połączenie z API `/auth/signup`
- Walidacja formularza
- Toast notifications
- Przekierowanie do logowania po sukcesie

#### ✅ Strona Logowania (`/src/app/pages/LogowaniePage.tsx`)
- Połączenie z API `/auth/signin`
- Zapisywanie sesji
- Toast notifications
- Przekierowanie do dashboardu

#### ✅ AppLayout (`/src/app/components/AppLayout.tsx`)
- Wyświetlanie danych użytkownika (nazwa, plan)
- Funkcja wylogowania
- Protected routes

#### ✅ Dashboard (`/src/app/pages/app/DashboardPage.tsx`)
- Pobieranie statystyk z API
- Wyświetlanie prawdziwych danych:
  - Liczba aktywnych klientów
  - Przychody (MRR)
  - Liczba planów treningowych
  - Retencja klientów
- Lista ostatnich klientów z API
- Loading state

#### ✅ Klienci (`/src/app/pages/app/KlienciPage.tsx`)
- Pełny CRUD dla klientów
- Pobieranie listy klientów z API
- Dodawanie nowych klientów
- Edycja i usuwanie klientów
- Filtrowanie i wyszukiwanie
- Loading state
- Toast notifications

#### ✅ Plany Treningowe (`/src/app/pages/app/PlanyPage.tsx`)
- Pełny CRUD dla planów
- Pobieranie planów z API
- Tworzenie nowych planów
- Usuwanie planów
- Wyświetlanie szczegółów planu
- Loading state
- Toast notifications

#### ✅ Grafik (`/src/app/pages/app/GrafikPage.tsx`)
- Pobieranie sesji z API
- Dodawanie nowych sesji
- Edycja i usuwanie sesji
- Kalendarz tygodniowy
- Statystyki sesji
- Loading state
- Toast notifications

#### ✅ Płatności (`/src/app/pages/app/PlatnosciPage.tsx`)
- Pobieranie płatności z API
- Wyświetlanie transakcji
- Filtrowanie po statusie (paid, pending, overdue)
- Statystyki przychodów
- Alert o zaległych płatnościach
- Loading state
- Toast notifications

### 4. Przechowywanie Danych (KV Store)

Dane są przechowywane w następującej strukturze:

```
user:{userId} -> Dane użytkownika (trenera)
├── id, email, name, role, plan, trialEndsAt

client:{userId}:{clientId} -> Dane klienta
├── id, name, email, phone, goal, plan, status, paid, progress, sessions, weight, targetWeight

plan:{userId}:{planId} -> Plan treningowy
├── id, name, level, duration, sessionsPerWeek, category, clients, days[]

progress:{userId}:{clientId}:{progressId} -> Wpis postępu
├── id, clientId, data postępu...

payment:{userId}:{paymentId} -> Płatność
├── id, client, amount, date, status, type

session:{userId}:{sessionId} -> Sesja treningowa
├── id, day, hour, client, duration, color, type
```

## 🔐 Autentykacja

Aplikacja używa **Supabase Auth** do zarządzania użytkownikami:

1. **Rejestracja**: 
   - Email + hasło + metadane (name, role)
   - Automatyczne potwierdzenie email
   - Utworzenie profilu trenera w KV store
   - Plan: trial (14 dni)

2. **Logowanie**:
   - Supabase Auth session
   - JWT token w localStorage
   - Dane użytkownika z KV store

3. **Autoryzacja**:
   - Każdy request wymaga header: `Authorization: Bearer {token}`
   - Weryfikacja tokenu po stronie serwera
   - Dostęp tylko do własnych danych (userId)

## 📡 Jak Działa Flow

### Przykład: Dodawanie Klienta

1. **Frontend** (`KlienciPage.tsx`):
```typescript
const response = await createClient({
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  phone: '+48 500 000 000',
  goal: 'Redukcja',
  plan: 'FBW 3x',
}, getAuthHeader());
```

2. **API Utils** (`api.ts`):
```typescript
return apiRequest('/clients', {
  method: 'POST',
  body: JSON.stringify(clientData),
}, authToken);
```

3. **Backend** (`/supabase/functions/server/index.tsx`):
```typescript
// Weryfikacja tokenu
const { userId } = await verifyUser(authHeader);

// Utworzenie klienta
const client = { id: ..., ...clientData, userId };
await kv.set(`client:${userId}:${clientId}`, client);

return { success: true, client };
```

4. **Frontend** - aktualizacja UI:
```typescript
if (response.success) {
  toast.success('Klient dodany!');
  setClients([response.client, ...clients]);
}
```

## 🎯 Następne Kroki (Opcjonalne)

### Pozostałe strony do zaktualizowania:
- [ ] Progres (`/src/app/pages/app/ProgresPage.tsx`)
- [ ] Raporty (`/src/app/pages/app/RaportyPage.tsx`)
- [ ] Ustawienia (`/src/app/pages/app/UstawieniaPage.tsx`)

### Rozszerzenia funkcjonalności:
- [ ] Protected routes (redirect do /logowanie jeśli nie zalogowany)
- [ ] Email notifications
- [ ] Stripe integration dla płatności
- [ ] Aplikacja mobilna dla klientów
- [ ] Upload zdjęć (przed/po)
- [ ] Chat z klientami
- [ ] Kalendarz Google integration

## 🧪 Testowanie

### Jak przetestować:

1. **Rejestracja**:
   - Przejdź do `/rejestracja`
   - Wypełnij formularz
   - Sprawdź toast notification
   - Przekierowanie do `/logowanie`

2. **Logowanie**:
   - Email i hasło z rejestracji
   - Sprawdź sesję w LocalStorage
   - Przekierowanie do `/app/dashboard`

3. **Dashboard**:
   - Sprawdź czy statystyki się ładują
   - Powinna być lista klientów (jeśli dodałeś)

4. **Klienci**:
   - Dodaj klienta
   - Sprawdź czy pojawia się w tabeli
   - Usuń klienta
   - Sprawdź filtry i wyszukiwanie

5. **Plany**:
   - Utwórz plan treningowy
   - Sprawdź szczegóły
   - Usuń plan

## 🔧 Konfiguracja Supabase

Upewnij się, że w Supabase:

1. **Auth**:
   - Email provider włączony
   - Auto-confirm email włączone (dla developmentu)

2. **Environment Variables**:
   - `SUPABASE_URL` - URL projektu
   - `SUPABASE_ANON_KEY` - Public anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (backend only)

3. **Edge Functions**:
   - Funkcja `make-server-e73d1e02` wdrożona
   - CORS prawidłowo skonfigurowany

## 📝 Notatki

- Wszystkie dane są powiązane z userId (izolacja multi-tenant)
- KV Store używa prefiksów dla łatwego query (`client:`, `plan:`, etc.)
- Toast notifications dla lepszego UX
- Loading states dla wszystkich async operacji
- Error handling z fallback do console.error i toast
- TypeScript types dla bezpieczeństwa (any używane tymczasowo)

---

**Status**: ✅ Backend w pełni zintegrowany z frontendem dla kluczowych funkcjonalności!
**Data**: 15 kwietnia 2026
