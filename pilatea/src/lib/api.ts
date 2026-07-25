/**
 * @file api.ts
 * @description Centralized HTTP client wrapper for the Pilatea Next.js storefront.
 * Exports strongly-typed API service functions for events, bookings, memberships, and user authentication.
 */

import {
  Event,
  Booking,
  TeaItem,
  TeaCategory,
  MembershipPlan,
  Testimonial,
  GalleryImage,
  Banner,
  Instructor,
  User,
  AuthResponse,
  DiscountValidationResponse
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Retrieve current customer token from localStorage.
 */
function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('customer_token');
  return null;
}

/**
 * Generic fetch wrapper for performing API requests.
 */
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

/* ==========================================================================
   PUBLIC RESOURCE ENDPOINTS
   ========================================================================== */

export function getEvents<T = Event[]>() { return fetchAPI<T>('/events'); }
export function getEvent<T = Event>(id: string | number) { return fetchAPI<T>(`/events/${id}`); }
export function getTeaItems<T = TeaItem[]>() { return fetchAPI<T>('/tea-items'); }
export function getTeaCategories<T = TeaCategory[]>() { return fetchAPI<T>('/tea-categories'); }
export function getMemberships<T = MembershipPlan[]>() { return fetchAPI<T>('/memberships'); }
export function getTestimonials<T = Testimonial[]>() { return fetchAPI<T>('/testimonials'); }
export function getGallery<T = GalleryImage[]>() { return fetchAPI<T>('/gallery'); }
export function getBanners<T = Banner[]>() { return fetchAPI<T>('/banners'); }
export function getInstructors<T = Instructor[]>() { return fetchAPI<T>('/instructors'); }
export function getSettings<T = Record<string, unknown>>() { return fetchAPI<T>('/settings'); }

/* ==========================================================================
   BOOKING & PURCHASES ENDPOINTS
   ========================================================================== */

export function createBooking<T = Booking>(data: Record<string, unknown>) {
  return fetchAPI<T>('/bookings', { method: 'POST', body: JSON.stringify(data) });
}

export function verifyBooking<T = Booking>(reference: string) {
  return fetchAPI<T>(`/bookings/verify/${reference}`);
}

export function getExistingBooking<T = { booking: Booking | null }>(eventId: string | number) {
  return fetchAPI<T>(`/bookings/check/${eventId}`);
}

export function addGuestsToBooking<T = Booking>(id: number, data: Record<string, unknown>) {
  return fetchAPI<T>(`/bookings/${id}/add-guests`, { method: 'POST', body: JSON.stringify(data) });
}

export function submitContact<T = { message: string }>(data: Record<string, string>) {
  return fetchAPI<T>('/contact', { method: 'POST', body: JSON.stringify(data) });
}

/* ==========================================================================
   AUTHENTICATION & USER PROFILE
   ========================================================================== */

export function login<T = AuthResponse>(data: { email: string; password: string }) {
  return fetchAPI<T>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
}

export function register<T = AuthResponse>(data: Record<string, string>) {
  return fetchAPI<T>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export function logout<T = { message: string }>() {
  return fetchAPI<T>('/auth/logout', { method: 'POST' });
}

export function getUser<T = User>() {
  return fetchAPI<T>('/auth/user');
}

export function purchaseMembership<T = Record<string, unknown>>(membershipId: number) {
  return fetchAPI<T>('/memberships/purchase', { method: 'POST', body: JSON.stringify({ membership_id: membershipId }) });
}

export function getMyBookings<T = Booking[]>() {
  return fetchAPI<T>('/bookings/mine');
}

export function validateDiscountCode<T = DiscountValidationResponse>(code: string) {
  return fetchAPI<T>('/discount-codes/validate', { method: 'POST', body: JSON.stringify({ code }) });
}