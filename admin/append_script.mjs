import fs from 'fs';

const extraCode = `
export const downloadBookingInvoice = (bookingId) => api.get('/admin/bookings/' + bookingId + '/invoice/download', { responseType: 'blob' });
export const sendBookingInvoice = (bookingId) => api.post('/admin/bookings/' + bookingId + '/invoice/send');
`;

fs.appendFileSync('/var/www/pilatea/admin/src/utils/api.js', extraCode);
console.log('Appended successfully');
