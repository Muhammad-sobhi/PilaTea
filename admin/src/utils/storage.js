// Shared storage URL helper — uses VITE_STORAGE_URL env var in production
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage/';

export default STORAGE_URL;
