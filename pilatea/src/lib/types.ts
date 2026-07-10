export interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  membership?: UserMembership;
  [key: string]: unknown;
}

interface UserMembership {
  id?: number;
  end_date?: string;
  membership?: {
    id?: number;
    name?: string;
    price?: number;
  };
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  location_name: string;
  price: number;
  capacity: number;
  image?: string;
  category?: { id: number; name: string };
  byo_enabled?: boolean;
  byo_capacity?: number;
  byo_price?: number;
  byo_description?: string;
  byo_spots_remaining?: number;
  spots_remaining?: number;
  [key: string]: unknown;
}

export interface Booking {
  id: number;
  event_id: number;
  name?: string;
  email?: string;
  phone?: string;
  spots_booked: number;
  reference?: string;
  status?: string;
  total_price?: number;
  payment_status?: string;
  event?: Event;
  [key: string]: unknown;
}

export interface TeaItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  ingredients?: string;
  category?: { id: number; name: string };
  [key: string]: unknown;
}

export interface MembershipPlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_months: number;
  features?: string[];
  popular?: boolean;
  [key: string]: unknown;
}

export interface GalleryImage {
  id: number;
  image: string;
  title?: string;
  [key: string]: unknown;
}

export interface Banner {
  id: number;
  image: string;
  title?: string;
  link?: string;
  [key: string]: unknown;
}
