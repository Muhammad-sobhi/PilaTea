import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');

// Resources
export const getEvents = () => api.get('/admin/events/all');
export const getEvent = (id) => api.get(`/admin/events/${id}`);
export const createEvent = (data) => api.post('/admin/events', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, data) => {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return api.post(`/admin/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.put(`/admin/events/${id}`, data);
};
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);

export const getBookings = () => api.get('/admin/bookings');
export const getBooking = (id) => api.get(`/admin/bookings/${id}`);
export const updateBooking = (id, data) => api.put(`/admin/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/admin/bookings/${id}`);
export const updateBookingStatus = (id, payment_status) => api.patch(`/admin/bookings/${id}`, { payment_status });

export const getTeaItems = () => api.get('/admin/tea-items');
export const getTeaItem = (id) => api.get(`/admin/tea-items/${id}`);
export const createTeaItem = (data) => api.post('/admin/tea-items', data);
export const updateTeaItem = (id, data) => api.put(`/admin/tea-items/${id}`, data);
export const deleteTeaItem = (id) => api.delete(`/admin/tea-items/${id}`);

export const getTeaCategories = () => api.get('/admin/tea-categories');
export const createTeaCategory = (data) => api.post('/admin/tea-categories', data);
export const updateTeaCategory = (id, data) => api.put(`/admin/tea-categories/${id}`, data);
export const deleteTeaCategory = (id) => api.delete(`/admin/tea-categories/${id}`);

export const getMemberships = () => api.get('/admin/memberships');
export const getMembership = (id) => api.get(`/admin/memberships/${id}`);
export const createMembership = (data) => api.post('/admin/memberships', data);
export const updateMembership = (id, data) => api.put(`/admin/memberships/${id}`, data);
export const deleteMembership = (id) => api.delete(`/admin/memberships/${id}`);

export const getGallery = () => api.get('/admin/gallery');
export const createGallery = (data) => api.post('/admin/gallery', data);
export const updateGalleryItem = (id, data) => api.put(`/admin/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/admin/gallery/${id}`);

export const getTestimonials = () => api.get('/admin/testimonials');
export const createTestimonial = (data) => api.post('/admin/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/admin/testimonials/${id}`, data);
export const updateTestimonialStatus = (id, is_active) => api.patch(`/admin/testimonials/${id}`, { is_active: !!is_active });
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);

export const getContacts = () => api.get('/admin/contacts');
export const getContact = (id) => api.get(`/admin/contacts/${id}`);
export const updateContactRead = (id, is_read) => api.patch(`/admin/contacts/${id}`, { is_read: !!is_read });
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`);

export const getBanners = () => api.get('/admin/banners');
export const createBanner = (data) => api.post('/admin/banners', data);
export const updateBanner = (id, data) => api.put(`/admin/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`);

export const getInstructors = () => api.get('/admin/instructors/all');
export const getInstructor = (id) => api.get(`/admin/instructors/${id}`);
export const createInstructor = (data) => api.post('/admin/instructors', data);
export const updateInstructor = (id, data) => api.put(`/admin/instructors/${id}`, data);
export const deleteInstructor = (id) => api.delete(`/admin/instructors/${id}`);

export const getDiscountCodes = () => api.get('/admin/discount-codes');
export const createDiscountCode = (data) => api.post('/admin/discount-codes', data);
export const updateDiscountCode = (id, data) => api.put(`/admin/discount-codes/${id}`, data);
export const deleteDiscountCode = (id) => api.delete(`/admin/discount-codes/${id}`);

export const getSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.post('/admin/settings', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Phase 1 - Event completion
export const completeEvent = (id) => api.post(`/admin/events/${id}/complete`);
export const sendThankYou = (id) => api.post(`/admin/events/${id}/send-thank-you`);

// Phase 2 - Drink orders
export const getTeaOrders = (bookingId) => api.get(`/admin/bookings/${bookingId}/tea-orders`);
export const createTeaOrder = (bookingId, data) => api.post(`/admin/bookings/${bookingId}/tea-orders`, data);
export const getTeaSummary = (bookingId) => api.get(`/admin/bookings/${bookingId}/tea-summary`);
export const deleteTeaOrder = (id) => api.delete(`/admin/tea-orders/${id}`);

// Phase 3 - Email / Marketing
export const getSubscribers = () => api.get('/admin/contacts/subscribers');
export const sendMarketingEmail = (data) => api.post('/admin/marketing/send', data);
export const getCampaigns = () => api.get('/admin/marketing/campaigns');
export const getCampaign = (id) => api.get(`/admin/marketing/campaigns/${id}`);
export const updateSubscription = (id, is_subscribed) => api.patch(`/admin/contacts/${id}`, { is_subscribed: !!is_subscribed });

// Phase 4 - Expenses & Finance
export const getExpenses = () => api.get('/admin/expenses');
export const getExpense = (id) => api.get(`/admin/expenses/${id}`);
export const createExpense = (data) => api.post('/admin/expenses', data);
export const updateExpense = (id, data) => api.put(`/admin/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/admin/expenses/${id}`);
export const getFinanceSummary = (params) => api.get('/admin/finance/summary', { params });

// Dashboard Users (Admin Only)
export const getDashboardUsers = () => api.get('/admin/dashboard-users');
export const createDashboardUser = (data) => api.post('/admin/dashboard-users', data);
export const updateDashboardUser = (id, data) => api.put(`/admin/dashboard-users/${id}`, data);
export const deleteDashboardUser = (id) => api.delete(`/admin/dashboard-users/${id}`);

// Email Templates
export const getEmailTemplates = () => api.get('/admin/email-templates');
export const getEmailTemplate = (slug) => api.get(`/admin/email-templates/${slug}`);
export const updateEmailTemplate = (slug, data) => api.post(`/admin/email-templates/${slug}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const previewEmailTemplate = (slug) => api.get(`/admin/email-templates/${slug}/preview`);
export const sendTemplateEmail = (data) => api.post('/admin/email-templates/send', data);
