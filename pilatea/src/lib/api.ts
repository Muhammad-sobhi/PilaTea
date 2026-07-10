const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('customer_token');
  return null;
}

async function fetchAPI<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('customer_token');
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function getEvents<T = unknown>() { return fetchAPI<T>('/events'); }
export function getEvent<T = unknown>(id: string | number) { return fetchAPI<T>(`/events/${id}`); }
export function getTeaItems<T = unknown>() { return fetchAPI<T>('/tea-items'); }
export function getTeaCategories<T = unknown>() { return fetchAPI<T>('/tea-categories'); }
export function getMemberships<T = unknown>() { return fetchAPI<T>('/memberships'); }
export function getTestimonials<T = unknown>() { return fetchAPI<T>('/testimonials'); }
export function getGallery<T = unknown>() { return fetchAPI<T>('/gallery'); }
export function getBanners<T = unknown>() { return fetchAPI<T>('/banners'); }
export function getInstructors<T = unknown>() { return fetchAPI<T>('/instructors'); }
export function getSettings<T = unknown>() { return fetchAPI<T>('/settings'); }

export function createBooking<T = unknown>(data: Record<string, unknown>) {
  return fetchAPI<T>('/bookings', { method: 'POST', body: JSON.stringify(data) });
}

export function verifyBooking<T = unknown>(reference: string) {
  return fetchAPI<T>(`/bookings/verify/${reference}`);
}

export function getExistingBooking<T = unknown>(eventId: string | number) {
  return fetchAPI<T>(`/bookings/check/${eventId}`);
}

export function addGuestsToBooking<T = unknown>(id: number, data: Record<string, unknown>) {
  return fetchAPI<T>(`/bookings/${id}/add-guests`, { method: 'POST', body: JSON.stringify(data) });
}

export function submitContact<T = unknown>(data: Record<string, string>) {
  return fetchAPI<T>('/contact', { method: 'POST', body: JSON.stringify(data) });
}

export function login<T = unknown>(data: { email: string; password: string }) {
  return fetchAPI<T>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
}

export function register<T = unknown>(data: Record<string, string>) {
  return fetchAPI<T>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export function logout<T = unknown>() {
  return fetchAPI<T>('/auth/logout', { method: 'POST' });
}

export function getUser<T = unknown>() {
  return fetchAPI<T>('/auth/user');
}

export function purchaseMembership<T = unknown>(membershipId: number) {
  return fetchAPI<T>('/memberships/purchase', { method: 'POST', body: JSON.stringify({ membership_id: membershipId }) });
}

export function getMyBookings<T = unknown>() {
  return fetchAPI<T>('/bookings/mine');
}

export function validateDiscountCode<T = unknown>(code: string) {
  return fetchAPI<T>('/discount-codes/validate', { method: 'POST', body: JSON.stringify({ code }) });
}