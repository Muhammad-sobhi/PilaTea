const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('customer_token');
  return null;
}

async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function getEvents() {
  return fetchAPI('/events');
}

export function getEvent(id) {
  return fetchAPI(`/events/${id}`);
}

export function getTeaItems() {
  return fetchAPI('/tea-items');
}

export function getTeaCategories() {
  return fetchAPI('/tea-categories');
}

export function getMemberships() {
  return fetchAPI('/memberships');
}

export function getTestimonials() {
  return fetchAPI('/testimonials');
}

export function getGallery() {
  return fetchAPI('/gallery');
}

export function getBanners() {
  return fetchAPI('/banners');
}

export function getInstructors() {
  return fetchAPI('/instructors');
}

export function getSettings() {
  return fetchAPI('/settings');
}

export function createBooking(data) {
  return fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function verifyBooking(reference) {
  return fetchAPI(`/bookings/verify/${reference}`);
}

export function getExistingBooking(eventId) {
  return fetchAPI(`/bookings/check/${eventId}`);
}

export function addGuestsToBooking(id, data) {
  return fetchAPI(`/bookings/${id}/add-guests`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitContact(data) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function register(data) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout() {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
}

export function getUser() {
  return fetchAPI('/auth/user');
}

export function purchaseMembership(membershipId) {
  return fetchAPI('/memberships/purchase', {
    method: 'POST',
    body: JSON.stringify({ membership_id: membershipId }),
  });
}

export function getMyBookings() {
  return fetchAPI('/bookings/mine');
}
