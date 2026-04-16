import { projectId } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e73d1e02`;

// Helper do wykonywania requestów
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = authToken;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Sprawdź czy odpowiedź jest JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`API Error (${endpoint}): Non-JSON response`);
      throw new Error('Błąd serwera - nieprawidłowa odpowiedź');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data.error || response.statusText);
      throw new Error(data.error || 'Błąd API');
    }

    return data;
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
}

// ============ KLIENCI ============

export async function getClients(authToken: string) {
  return apiRequest('/clients', { method: 'GET' }, authToken);
}

export async function createClient(clientData: any, authToken: string) {
  return apiRequest(
    '/clients',
    {
      method: 'POST',
      body: JSON.stringify(clientData),
    },
    authToken
  );
}

export async function updateClient(clientId: string, updates: any, authToken: string) {
  return apiRequest(
    `/clients/${clientId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    },
    authToken
  );
}

export async function deleteClient(clientId: string, authToken: string) {
  return apiRequest(
    `/clients/${clientId}`,
    { method: 'DELETE' },
    authToken
  );
}

// ============ PLANY TRENINGOWE ============

export async function getPlans(authToken: string) {
  return apiRequest('/plans', { method: 'GET' }, authToken);
}

export async function createPlan(planData: any, authToken: string) {
  return apiRequest(
    '/plans',
    {
      method: 'POST',
      body: JSON.stringify(planData),
    },
    authToken
  );
}

export async function updatePlan(planId: string, updates: any, authToken: string) {
  return apiRequest(
    `/plans/${planId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    },
    authToken
  );
}

export async function deletePlan(planId: string, authToken: string) {
  return apiRequest(
    `/plans/${planId}`,
    { method: 'DELETE' },
    authToken
  );
}

// ============ POSTĘP ============

export async function getProgress(clientId: string, authToken: string) {
  return apiRequest(`/progress/${clientId}`, { method: 'GET' }, authToken);
}

export async function addProgress(clientId: string, progressData: any, authToken: string) {
  return apiRequest(
    `/progress/${clientId}`,
    {
      method: 'POST',
      body: JSON.stringify(progressData),
    },
    authToken
  );
}

// ============ PŁATNOŚCI ============

export async function getPayments(authToken: string) {
  return apiRequest('/payments', { method: 'GET' }, authToken);
}

export async function addPayment(paymentData: any, authToken: string) {
  return apiRequest(
    '/payments',
    {
      method: 'POST',
      body: JSON.stringify(paymentData),
    },
    authToken
  );
}

// ============ SESJE ============

export async function getSessions(authToken: string) {
  return apiRequest('/sessions', { method: 'GET' }, authToken);
}

export async function createSession(sessionData: any, authToken: string) {
  return apiRequest(
    '/sessions',
    {
      method: 'POST',
      body: JSON.stringify(sessionData),
    },
    authToken
  );
}

export async function updateSession(sessionId: string, updates: any, authToken: string) {
  return apiRequest(
    `/sessions/${sessionId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    },
    authToken
  );
}

export async function deleteSession(sessionId: string, authToken: string) {
  return apiRequest(
    `/sessions/${sessionId}`,
    { method: 'DELETE' },
    authToken
  );
}

// ============ DASHBOARD ============

export async function getDashboardStats(authToken: string) {
  return apiRequest('/dashboard/stats', { method: 'GET' }, authToken);
}