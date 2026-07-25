/**
 * @file api.js
 * @description Centralized Axios HTTP client configuration and API service functions for the Pilatea Admin Dashboard.
 * Includes authentication token interceptors, unauthenticated error handling, and resource endpoints.
 */

import axios from 'axios';

/**
 * Axios instance pre-configured with default API base URL and headers.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json' 
  },
});

/**
 * Request Interceptor: Automatically attaches Bearer token from localStorage to outgoing requests if present.
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor: Listens for HTTP 401 Unauthorized responses to clear token and redirect user to login.
 */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

/* ==========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================== */

/**
 * Log in admin or staff user with email and password.
 * @param {Object} data - { email, password }
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Revoke the current access token and log out the user.
 */
export const logout = () => api.post('/auth/logout');

/* ==========================================================================
   EVENTS MANAGEMENT ENDPOINTS
   ========================================================================== */

/** Fetch all admin events */
export const getEvents = () => api.get('/admin/events/all');

/** Fetch single event by ID */
export const getEvent = (id) => api.get(`/admin/events/${id}`);

/** Create new event (supports multipart/form-data for image uploads) */
export const createEvent = (data) => api.post('/admin/events', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

/** Update existing event by ID */
export const updateEvent = (id, data) => {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return api.post(`/admin/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.put(`/admin/events/${id}`, data);
};

/** Delete event by ID */
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);

/** Mark event as complete */
export const completeEvent = (id) => api.post(`/admin/events/${id}/complete`);

/** Send thank-you email to event attendees */
export const sendThankYou = (id) => api.post(`/admin/events/${id}/send-thank-you`);

/* ==========================================================================
   BOOKINGS MANAGEMENT ENDPOINTS
   ========================================================================== */

/** Fetch all customer bookings */
export const getBookings = () => api.get('/admin/bookings');

/** Fetch single booking details by ID */
export const getBooking = (id) => api.get(`/admin/bookings/${id}`);

/** Update booking attributes */
export const updateBooking = (id, data) => api.put(`/admin/bookings/${id}`, data);

/** Delete booking record by ID */
export const deleteBooking = (id) => api.delete(`/admin/bookings/${id}`);

/** Update booking payment status (e.g. 'paid', 'pending') */
export const updateBookingStatus = (id, payment_status) => api.patch(`/admin/bookings/${id}`, { payment_status });

/** Download booking PDF invoice */
export const downloadBookingInvoice = (id) => api.get(`/admin/bookings/${id}/invoice`, { responseType: 'blob' });

/** Send booking invoice via email */
export const sendBookingInvoice = (id) => api.post(`/admin/bookings/${id}/send-invoice`);

/* ==========================================================================
   TEA MENU & CATEGORIES ENDPOINTS
   ========================================================================== */

/** Fetch all tea menu items */
export const getTeaItems = () => api.get('/admin/tea-items');

/** Fetch single tea item by ID */
export const getTeaItem = (id) => api.get(`/admin/tea-items/${id}`);

/** Create new tea menu item */
export const createTeaItem = (data) => api.post('/admin/tea-items', data);

/** Update existing tea menu item */
export const updateTeaItem = (id, data) => api.put(`/admin/tea-items/${id}`, data);

/** Delete tea menu item */
export const deleteTeaItem = (id) => api.delete(`/admin/tea-items/${id}`);

/** Fetch all tea categories */
export const getTeaCategories = () => api.get('/admin/tea-categories');

/** Create new tea category */
export const createTeaCategory = (data) => api.post('/admin/tea-categories', data);

/** Update existing tea category */
export const updateTeaCategory = (id, data) => api.put(`/admin/tea-categories/${id}`, data);

/** Delete tea category */
export const deleteTeaCategory = (id) => api.delete(`/admin/tea-categories/${id}`);

/* ==========================================================================
   MEMBERSHIPS ENDPOINTS
   ========================================================================== */

/** Fetch all membership plans */
export const getMemberships = () => api.get('/admin/memberships');

/** Fetch single membership plan by ID */
export const getMembership = (id) => api.get(`/admin/memberships/${id}`);

/** Create new membership plan */
export const createMembership = (data) => api.post('/admin/memberships', data);

/** Update membership plan */
export const updateMembership = (id, data) => api.put(`/admin/memberships/${id}`, data);

/** Delete membership plan */
export const deleteMembership = (id) => api.delete(`/admin/memberships/${id}`);

/* ==========================================================================
   GALLERY & MEDIA ENDPOINTS
   ========================================================================== */

/** Fetch gallery items */
export const getGallery = () => api.get('/admin/gallery');

/** Create new gallery item */
export const createGallery = (data) => api.post('/admin/gallery', data);

/** Update gallery item */
export const updateGalleryItem = (id, data) => api.put(`/admin/gallery/${id}`, data);

/** Delete gallery item */
export const deleteGalleryItem = (id) => api.delete(`/admin/gallery/${id}`);

/* ==========================================================================
   TESTIMONIALS & REVIEWS ENDPOINTS
   ========================================================================== */

/** Fetch all client testimonials */
export const getTestimonials = () => api.get('/admin/testimonials');

/** Create new testimonial */
export const createTestimonial = (data) => api.post('/admin/testimonials', data);

/** Update testimonial */
export const updateTestimonial = (id, data) => api.put(`/admin/testimonials/${id}`, data);

/** Toggle active status for testimonial */
export const updateTestimonialStatus = (id, is_active) => api.patch(`/admin/testimonials/${id}`, { is_active: !!is_active });

/** Delete testimonial */
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);

/* ==========================================================================
   CONTACT MESSAGES & NEWSLETTER
   ========================================================================== */

/** Fetch contact form submissions */
export const getContacts = () => api.get('/admin/contacts');

/** Fetch single contact message by ID */
export const getContact = (id) => api.get(`/admin/contacts/${id}`);

/** Mark contact message as read/unread */
export const updateContactRead = (id, is_read) => api.patch(`/admin/contacts/${id}`, { is_read: !!is_read });

/** Delete contact message */
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`);

/** Fetch email newsletter subscribers */
export const getSubscribers = () => api.get('/admin/contacts/subscribers');

/** Update user email subscription state */
export const updateSubscription = (id, is_subscribed) => api.patch(`/admin/contacts/${id}`, { is_subscribed: !!is_subscribed });

/** Send marketing email campaign */
export const sendMarketingEmail = (data) => api.post('/admin/marketing/send', data);

/** Fetch email campaigns */
export const getCampaigns = () => api.get('/admin/marketing/campaigns');

/** Fetch single campaign */
export const getCampaign = (id) => api.get(`/admin/marketing/campaigns/${id}`);

/* ==========================================================================
   HERO BANNERS & INSTRUCTORS
   ========================================================================== */

/** Fetch hero banners */
export const getBanners = () => api.get('/admin/banners');

/** Create banner */
export const createBanner = (data) => api.post('/admin/banners', data);

/** Update banner */
export const updateBanner = (id, data) => api.put(`/admin/banners/${id}`, data);

/** Delete banner */
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`);

/** Fetch all instructors */
export const getInstructors = () => api.get('/admin/instructors/all');

/** Fetch single instructor by ID */
export const getInstructor = (id) => api.get(`/admin/instructors/${id}`);

/** Create instructor */
export const createInstructor = (data) => api.post('/admin/instructors', data);

/** Update instructor */
export const updateInstructor = (id, data) => api.put(`/admin/instructors/${id}`, data);

/** Delete instructor */
export const deleteInstructor = (id) => api.delete(`/admin/instructors/${id}`);

/* ==========================================================================
   DISCOUNT CODES & SETTINGS
   ========================================================================== */

/** Fetch discount promo codes */
export const getDiscountCodes = () => api.get('/admin/discount-codes');

/** Create promo code */
export const createDiscountCode = (data) => api.post('/admin/discount-codes', data);

/** Update promo code */
export const updateDiscountCode = (id, data) => api.put(`/admin/discount-codes/${id}`, data);

/** Delete promo code */
export const deleteDiscountCode = (id) => api.delete(`/admin/discount-codes/${id}`);

/** Fetch site settings */
export const getSettings = () => api.get('/admin/settings');

/** Update site settings */
export const updateSettings = (data) => api.post('/admin/settings', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

/* ==========================================================================
   DRINK ORDERS (PHASE 2)
   ========================================================================== */

/** Fetch tea orders for a booking */
export const getTeaOrders = (bookingId) => api.get(`/admin/bookings/${bookingId}/tea-orders`);

/** Add tea order to a booking */
export const createTeaOrder = (bookingId, data) => api.post(`/admin/bookings/${bookingId}/tea-orders`, data);

/** Fetch tea summary for a booking */
export const getTeaSummary = (bookingId) => api.get(`/admin/bookings/${bookingId}/tea-summary`);

/** Delete tea order */
export const deleteTeaOrder = (id) => api.delete(`/admin/tea-orders/${id}`);

/* ==========================================================================
   EXPENSES & FINANCE (PHASE 4)
   ========================================================================== */

/** Fetch expenses list */
export const getExpenses = () => api.get('/admin/expenses');

/** Fetch single expense */
export const getExpense = (id) => api.get(`/admin/expenses/${id}`);

/** Create expense entry */
export const createExpense = (data) => api.post('/admin/expenses', data);

/** Update expense entry */
export const updateExpense = (id, data) => api.put(`/admin/expenses/${id}`, data);

/** Delete expense entry */
export const deleteExpense = (id) => api.delete(`/admin/expenses/${id}`);

/** Fetch finance summary analytics */
export const getFinanceSummary = (params) => api.get('/admin/finance/summary', { params });

/* ==========================================================================
   DASHBOARD USERS (STAFF & ADMINS)
   ========================================================================== */

/** Fetch internal dashboard users */
export const getDashboardUsers = () => api.get('/admin/dashboard-users');

/** Create dashboard staff/admin user */
export const createDashboardUser = (data) => api.post('/admin/dashboard-users', data);

/** Update dashboard staff/admin user */
export const updateDashboardUser = (id, data) => api.put(`/admin/dashboard-users/${id}`, data);

/** Delete dashboard user */
export const deleteDashboardUser = (id) => api.delete(`/admin/dashboard-users/${id}`);

/* ==========================================================================
   EMAIL TEMPLATES
   ========================================================================== */

/** Fetch email notification templates */
export const getEmailTemplates = () => api.get('/admin/email-templates');

/** Fetch single template by slug */
export const getEmailTemplate = (slug) => api.get(`/admin/email-templates/${slug}`);

/** Update template content */
export const updateEmailTemplate = (slug, data) => api.post(`/admin/email-templates/${slug}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

/** Preview template HTML rendering */
export const previewEmailTemplate = (slug) => api.get(`/admin/email-templates/${slug}/preview`);

/** Send test email with template */
export const sendTemplateEmail = (data) => api.post('/admin/email-templates/send', data);
