const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://bookmerefreshed.onrender.com').replace(/\/$/, '') + '/api/v1';

export function getAuthToken(): string | null {
  return localStorage.getItem('bookme_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('bookme_token', token);
  } else {
    localStorage.removeItem('bookme_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; error?: string }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, data: null as any, error: json.error || json.message || 'Request failed' };
    }

    return { success: true, data: json.data || json };
  } catch (err: any) {
    return { success: false, data: null as any, error: err.message || 'Network error' };
  }
}

export const api = {
  // Auth
  register: (full_name: string, email: string, password: string) =>
    request<{ id: string; email: string; full_name: string; role: string; access_token: string; business_id?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ id: string; email: string; full_name: string; role: string; access_token: string; business_id?: string; business_name?: string; business_slug?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () =>
    request<{ id: string; email: string; full_name: string; role: string; business_id: string | null; business_name?: string; business_slug?: string }>('/auth/me'),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, new_password: string, token?: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, new_password, token }),
    }),

  // Business
  createBusiness: (data: { name: string; slug?: string; category?: string; template?: string; country?: string; address?: string; description?: string; phone?: string }) =>
    request<any>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyBusiness: () =>
    request<any>('/businesses/me'),

  updateMyBusiness: (data: {
    name?: string;
    slug?: string;
    category?: string;
    phone?: string;
    email?: string;
    address?: string;
    description?: string;
    accentColor?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    pictures?: string[];
  }) =>
    request<any>('/businesses/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Services
  getServices: (slug?: string) =>
    request<any[]>(`/services${slug ? `?slug=${slug}` : ''}`),

  // Dashboard Stats
  getDashboardStats: () =>
    request<{ total_bookings: number; pending_bookings: number; confirmed_bookings: number; completed_bookings: number; cancelled_bookings: number; total_revenue: number }>('/dashboard/stats'),

  // Paystack Payments
  getPaystackConfig: () =>
    request<{ public_key: string; gateway: string; supported_channels: string[]; currency: string }>('/payments/config'),

  initializePayment: (data: {
    booking_id?: string;
    booking_reference?: string;
    email: string;
    amount: number;
    currency?: string;
    callback_url?: string;
    customer_name?: string;
    service_name?: string;
    business_name?: string;
  }) =>
    request<{ authorization_url: string; access_code: string; reference: string; public_key: string }>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyPayment: (reference: string) =>
    request<{ verified: boolean; reference: string; payment_status: string; booking_status: string }>('/payments/verify/' + encodeURIComponent(reference)),
};
