import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

// TrainerPro Backend API - v1.1.0 (fixed kv.getByPrefix usage)

const app = new Hono();

// Supabase client dla autentykacji
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Supabase client dla frontendowych operacji
const getSupabaseAnonClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e73d1e02/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTENTYKACJA ============

// Rejestracja
app.post("/make-server-e73d1e02/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    const supabase = getSupabaseClient();
    
    // Tworzenie użytkownika z automatycznym potwierdzeniem email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true, // Automatycznie potwierdź email, bo serwer email nie jest skonfigurowany
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: `Błąd rejestracji: ${error.message}` }, 400);
    }
    
    // Zapisz dane trenera w KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      plan: 'trial', // Rozpoczynamy z planem trial
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dni
    });
    
    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Konto zostało utworzone. Możesz się teraz zalogować.' 
    });
  } catch (err) {
    console.error('Signup exception:', err);
    return c.json({ error: `Błąd serwera podczas rejestracji: ${err}` }, 500);
  }
});

// Logowanie
app.post("/make-server-e73d1e02/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const supabase = getSupabaseAnonClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Signin error:', error);
      return c.json({ error: `Błąd logowania: ${error.message}` }, 400);
    }
    
    // Pobierz dane użytkownika z KV store
    const userData = await kv.get(`user:${data.user.id}`);
    
    return c.json({ 
      success: true, 
      session: data.session,
      user: userData || data.user,
    });
  } catch (err) {
    console.error('Signin exception:', err);
    return c.json({ error: `Błąd serwera podczas logowania: ${err}` }, 500);
  }
});

// Weryfikacja użytkownika
const verifyUser = async (authHeader: string | null) => {
  if (!authHeader) {
    return { error: 'Brak tokenu autoryzacji', userId: null };
  }
  
  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return { error: 'Nieautoryzowany dostęp', userId: null };
  }
  
  return { error: null, userId: data.user.id };
};

// ============ KLIENCI ============

// Pobierz wszystkich klientów trenera
app.get("/make-server-e73d1e02/clients", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clients = await kv.getByPrefix(`client:${userId}:`);
    return c.json({ clients });
  } catch (err) {
    console.error('Get clients error:', err);
    return c.json({ error: `Błąd pobierania klientów: ${err}` }, 500);
  }
});

// Dodaj nowego klienta
app.post("/make-server-e73d1e02/clients", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clientData = await c.req.json();
    const clientId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const client = {
      id: clientId,
      ...clientData,
      userId,
      status: clientData.status || 'active',
      paid: clientData.paid || false,
      progress: clientData.progress || 0,
      sessions: clientData.sessions || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`client:${userId}:${clientId}`, client);
    return c.json({ success: true, client });
  } catch (err) {
    console.error('Create client error:', err);
    return c.json({ error: `Błąd tworzenia klienta: ${err}` }, 500);
  }
});

// Zaktualizuj klienta
app.put("/make-server-e73d1e02/clients/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clientId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`client:${userId}:${clientId}`);
    if (!existing) {
      return c.json({ error: 'Klient nie znaleziony' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`client:${userId}:${clientId}`, updated);
    return c.json({ success: true, client: updated });
  } catch (err) {
    console.error('Update client error:', err);
    return c.json({ error: `Błąd aktualizacji klienta: ${err}` }, 500);
  }
});

// Usuń klienta
app.delete("/make-server-e73d1e02/clients/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clientId = c.req.param('id');
    await kv.del(`client:${userId}:${clientId}`);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete client error:', err);
    return c.json({ error: `Błąd usuwania klienta: ${err}` }, 500);
  }
});

// ============ PLANY TRENINGOWE ============

// Pobierz wszystkie plany
app.get("/make-server-e73d1e02/plans", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const plans = await kv.getByPrefix(`plan:${userId}:`);
    return c.json({ plans });
  } catch (err) {
    console.error('Get plans error:', err);
    return c.json({ error: `Błąd pobierania planów: ${err}` }, 500);
  }
});

// Dodaj nowy plan
app.post("/make-server-e73d1e02/plans", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const planData = await c.req.json();
    const planId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const plan = {
      id: planId,
      ...planData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`plan:${userId}:${planId}`, plan);
    return c.json({ success: true, plan });
  } catch (err) {
    console.error('Create plan error:', err);
    return c.json({ error: `Błąd tworzenia planu: ${err}` }, 500);
  }
});

// Zaktualizuj plan
app.put("/make-server-e73d1e02/plans/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const planId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`plan:${userId}:${planId}`);
    if (!existing) {
      return c.json({ error: 'Plan nie znaleziony' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`plan:${userId}:${planId}`, updated);
    return c.json({ success: true, plan: updated });
  } catch (err) {
    console.error('Update plan error:', err);
    return c.json({ error: `Błąd aktualizacji planu: ${err}` }, 500);
  }
});

// Usuń plan
app.delete("/make-server-e73d1e02/plans/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const planId = c.req.param('id');
    await kv.del(`plan:${userId}:${planId}`);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete plan error:', err);
    return c.json({ error: `Błąd usuwania planu: ${err}` }, 500);
  }
});

// ============ POSTĘP ============

// Pobierz postęp dla klienta
app.get("/make-server-e73d1e02/progress/:clientId", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clientId = c.req.param('clientId');
    const progressData = await kv.getByPrefix(`progress:${userId}:${clientId}:`);
    
    return c.json({ progress: progressData });
  } catch (err) {
    console.error('Get progress error:', err);
    return c.json({ error: `Błąd pobierania postępu: ${err}` }, 500);
  }
});

// Dodaj wpis postępu
app.post("/make-server-e73d1e02/progress/:clientId", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const clientId = c.req.param('clientId');
    const progressData = await c.req.json();
    const progressId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const progress = {
      id: progressId,
      clientId,
      ...progressData,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`progress:${userId}:${clientId}:${progressId}`, progress);
    return c.json({ success: true, progress });
  } catch (err) {
    console.error('Create progress error:', err);
    return c.json({ error: `Błąd dodawania postępu: ${err}` }, 500);
  }
});

// ============ PŁATNOŚCI ============

// Pobierz płatności
app.get("/make-server-e73d1e02/payments", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const payments = await kv.getByPrefix(`payment:${userId}:`);
    return c.json({ payments });
  } catch (err) {
    console.error('Get payments error:', err);
    return c.json({ error: `Błąd pobierania płatności: ${err}` }, 500);
  }
});

// Dodaj płatność
app.post("/make-server-e73d1e02/payments", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const paymentData = await c.req.json();
    const paymentId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = {
      id: paymentId,
      ...paymentData,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment:${userId}:${paymentId}`, payment);
    return c.json({ success: true, payment });
  } catch (err) {
    console.error('Create payment error:', err);
    return c.json({ error: `Błąd dodawania płatności: ${err}` }, 500);
  }
});

// ============ SESJE/GRAFIK ============

// Pobierz sesje
app.get("/make-server-e73d1e02/sessions", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const sessions = await kv.getByPrefix(`session:${userId}:`);
    return c.json({ sessions });
  } catch (err) {
    console.error('Get sessions error:', err);
    return c.json({ error: `Błąd pobierania sesji: ${err}` }, 500);
  }
});

// Dodaj sesję
app.post("/make-server-e73d1e02/sessions", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const sessionData = await c.req.json();
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      ...sessionData,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`session:${userId}:${sessionId}`, session);
    return c.json({ success: true, session });
  } catch (err) {
    console.error('Create session error:', err);
    return c.json({ error: `Błąd dodawania sesji: ${err}` }, 500);
  }
});

// Zaktualizuj sesję
app.put("/make-server-e73d1e02/sessions/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const sessionId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`session:${userId}:${sessionId}`);
    if (!existing) {
      return c.json({ error: 'Sesja nie znaleziona' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`session:${userId}:${sessionId}`, updated);
    return c.json({ success: true, session: updated });
  } catch (err) {
    console.error('Update session error:', err);
    return c.json({ error: `Błąd aktualizacji sesji: ${err}` }, 500);
  }
});

// Usuń sesję
app.delete("/make-server-e73d1e02/sessions/:id", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    const sessionId = c.req.param('id');
    await kv.del(`session:${userId}:${sessionId}`);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete session error:', err);
    return c.json({ error: `Błąd usuwania sesji: ${err}` }, 500);
  }
});

// ============ DASHBOARD / STATYSTYKI ============

// Pobierz statystyki dashboardu
app.get("/make-server-e73d1e02/dashboard/stats", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    
    // Pobierz wszystkie dane - getByPrefix już zwraca same wartości
    const clientsData = await kv.getByPrefix(`client:${userId}:`);
    const plansData = await kv.getByPrefix(`plan:${userId}:`);
    const paymentsData = await kv.getByPrefix(`payment:${userId}:`);
    
    // Oblicz statystyki
    const activeClients = clientsData.filter(c => c.status === 'active').length;
    const totalRevenue = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPlans = plansData.length;
    
    // Oblicz retencję (przykładowa logika)
    const retention = clientsData.length > 0 
      ? Math.round((activeClients / clientsData.length) * 100) 
      : 100;
    
    return c.json({
      stats: {
        activeClients,
        totalRevenue,
        totalPlans,
        retention,
        totalClients: clientsData.length,
      },
      recentClients: clientsData.slice(0, 5),
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    return c.json({ error: `Błąd pobierania statystyk: ${err}` }, 500);
  }
});

// ============ POWIADOMIENIA EMAIL ============

// Funkcja pomocnicza do wysyłania emaili
// W środowisku produkcyjnym można zintegrować z Resend, SendGrid lub innym serwisem email
async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[EMAIL] Wysyłanie do: ${to}`);
  console.log(`[EMAIL] Temat: ${subject}`);
  console.log(`[EMAIL] Treść: ${html.substring(0, 100)}...`);

  // W środowisku produkcyjnym tutaj byłoby wywołanie API serwisu email
  // Przykład z Resend:
  // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  // await resend.emails.send({ from: 'TrainerPro <noreply@trainerpro.pl>', to, subject, html });

  // Na razie tylko logujemy
  return { success: true, message: 'Email zalogowany (produkcyjnie: wysłany)' };
}

// Wyślij przypomnienie o sesji
app.post("/make-server-e73d1e02/notifications/session-reminder", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);

    const { sessionId, clientEmail, clientName, sessionDate, sessionTime, sessionType } = await c.req.json();

    if (!clientEmail || !clientName || !sessionDate || !sessionTime) {
      return c.json({ error: 'Brak wymaganych danych' }, 400);
    }

    const subject = 'Przypomnienie o nadchodzącej sesji treningowej';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Przypomnienie o sesji treningowej</h2>
        <p>Cześć ${clientName}!</p>
        <p>Przypominamy o Twojej nadchodzącej sesji treningowej:</p>
        <div style="background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Data:</strong> ${sessionDate}</p>
          <p style="margin: 5px 0;"><strong>Godzina:</strong> ${sessionTime}</p>
          <p style="margin: 5px 0;"><strong>Typ:</strong> ${sessionType || 'Trening personalny'}</p>
        </div>
        <p>Do zobaczenia na treningu!</p>
        <p style="color: #64748B; font-size: 12px; margin-top: 30px;">
          TrainerPro - System zarządzania dla trenerów personalnych
        </p>
      </div>
    `;

    const result = await sendEmail(clientEmail, subject, html);

    // Zapisz historię powiadomienia
    const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`notification:${userId}:${notificationId}`, {
      id: notificationId,
      type: 'session-reminder',
      sessionId,
      clientEmail,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    return c.json({ success: true, message: 'Przypomnienie wysłane', result });
  } catch (err) {
    console.error('Send session reminder error:', err);
    return c.json({ error: `Błąd wysyłania przypomnienia: ${err}` }, 500);
  }
});

// Wyślij przypomnienie o płatności
app.post("/make-server-e73d1e02/notifications/payment-reminder", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);

    const { clientEmail, clientName, amount, dueDate, invoiceNumber } = await c.req.json();

    if (!clientEmail || !clientName || !amount) {
      return c.json({ error: 'Brak wymaganych danych' }, 400);
    }

    const subject = 'Przypomnienie o płatności';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Przypomnienie o płatności</h2>
        <p>Cześć ${clientName}!</p>
        <p>Przypominamy o nieopłaconej fakturze:</p>
        <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
          <p style="margin: 5px 0;"><strong>Kwota:</strong> ${amount} zł</p>
          ${dueDate ? `<p style="margin: 5px 0;"><strong>Termin płatności:</strong> ${dueDate}</p>` : ''}
          ${invoiceNumber ? `<p style="margin: 5px 0;"><strong>Numer faktury:</strong> ${invoiceNumber}</p>` : ''}
        </div>
        <p>Prosimy o dokonanie płatności w możliwie najszybszym terminie.</p>
        <p>W razie pytań, chętnie pomożemy!</p>
        <p style="color: #64748B; font-size: 12px; margin-top: 30px;">
          TrainerPro - System zarządzania dla trenerów personalnych
        </p>
      </div>
    `;

    const result = await sendEmail(clientEmail, subject, html);

    // Zapisz historię powiadomienia
    const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`notification:${userId}:${notificationId}`, {
      id: notificationId,
      type: 'payment-reminder',
      clientEmail,
      amount,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    return c.json({ success: true, message: 'Przypomnienie o płatności wysłane', result });
  } catch (err) {
    console.error('Send payment reminder error:', err);
    return c.json({ error: `Błąd wysyłania przypomnienia o płatności: ${err}` }, 500);
  }
});

// Wyślij wiadomość powitalną do nowego klienta
app.post("/make-server-e73d1e02/notifications/welcome", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);

    const { clientEmail, clientName, trainerName } = await c.req.json();

    if (!clientEmail || !clientName) {
      return c.json({ error: 'Brak wymaganych danych' }, 400);
    }

    const subject = `Witaj w ${trainerName ? `zespole ${trainerName}` : 'TrainerPro'}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Witaj, ${clientName}!</h2>
        <p>Cieszymy się, że dołączasz do nas!</p>
        <p>Od teraz wspólnie będziemy pracować nad osiągnięciem Twoich celów treningowych.</p>
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="margin-top: 0;">Co dalej?</h3>
          <ul style="padding-left: 20px;">
            <li>Skontaktujemy się z Tobą, aby umówić pierwszą sesję</li>
            <li>Przygotujemy dla Ciebie spersonalizowany plan treningowy</li>
            <li>Będziemy monitorować Twoje postępy</li>
          </ul>
        </div>
        <p>Masz pytania? Śmiało pisz - chętnie pomożemy!</p>
        <p style="margin-top: 30px;">Do zobaczenia na treningu! 💪</p>
        <p style="color: #64748B; font-size: 12px; margin-top: 30px;">
          ${trainerName || 'TrainerPro'}
        </p>
      </div>
    `;

    const result = await sendEmail(clientEmail, subject, html);

    // Zapisz historię powiadomienia
    const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`notification:${userId}:${notificationId}`, {
      id: notificationId,
      type: 'welcome',
      clientEmail,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    return c.json({ success: true, message: 'Wiadomość powitalna wysłana', result });
  } catch (err) {
    console.error('Send welcome email error:', err);
    return c.json({ error: `Błąd wysyłania wiadomości powitalnej: ${err}` }, 500);
  }
});

// Pobierz historię powiadomień
app.get("/make-server-e73d1e02/notifications", async (c) => {
  try {
    const { error, userId } = await verifyUser(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);

    const notifications = await kv.getByPrefix(`notification:${userId}:`);
    return c.json({ notifications });
  } catch (err) {
    console.error('Get notifications error:', err);
    return c.json({ error: `Błąd pobierania powiadomień: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);