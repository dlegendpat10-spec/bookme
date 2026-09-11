export type UserRole = 'CUSTOMER' | 'BUSINESS_ADMIN' | 'GUEST';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type ThemeMode = 'midnight' | 'porcelain' | 'emerald' | 'violet' | 'sunset' | 'oceanic';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  businessId?: string; // If business admin
}

export interface BusinessHours {
  dayOfWeek: number; // 0=Sunday, 1=Monday ... 6=Saturday
  dayName: string;
  isClosed: boolean;
  openTime: string; // e.g. "09:00"
  closeTime: string; // e.g. "18:00"
  breaks?: { start: string; end: string }[];
}

export interface BlockedDate {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  bookingCount: number;
  imageUrl?: string;
  badge?: string; // e.g. "Popular", "20% OFF", "VIP"
}

export interface TokenizedCard {
  id: string;
  cardType: 'visa' | 'mastercard' | 'verve';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  businessId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  totalBookings: number;
  totalSpend: number;
  lastVisit?: string;
  createdAt: string;
  savedCards?: TokenizedCard[];
}

export interface TimeSlot {
  time: string; // e.g. "16:30"
  displayTime: string; // e.g. "4:30 PM"
  isAvailable: boolean;
  reason?: string;
}

export interface ServiceBooking {
  id: string;
  bookingReference: string; // e.g. "BK-98421"
  businessId: string;
  businessName: string;
  businessSlug: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // "17:00"
  displayTime: string; // "5:00 PM"
  endTime: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  paymentMethod: string;
  customerNotes?: string;
  createdAt: string;
  discountApplied?: number;
}

export interface NotificationLog {
  id: string;
  bookingId: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  recipient: string;
  title: string;
  message: string;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
  sentAt: string;
}

export interface ReminderRule {
  id: string;
  businessId: string;
  hoursBefore: number;
  channels: ('EMAIL' | 'SMS' | 'WHATSAPP')[];
  enabled: boolean;
  template: string;
}

export interface AdCampaign {
  id: string;
  businessId: string;
  title: string;
  headline: string;
  description: string;
  discountCode?: string;
  discountPercent?: number;
  imageUrl?: string;
  badgeText: string; // e.g. "LIMITED TIME OFFER", "FLASH SALE", "SPONSORED"
  ctaText: string; // e.g. "Claim 20% Off & Book", "Unlock VIP Deal"
  targetServiceId?: string;
  placement: 'HERO_BANNER' | 'TOP_MARQUEE' | 'POPUP_CARD';
  isActive: boolean;
  impressions: number;
  clicks: number;
  bookingsCount: number;
  createdAt: string;
}

export interface BusinessTenant {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoUrl?: string;
  heroImageUrl?: string;
  phone: string;
  email: string;
  address: string;
  accentColor: string; // HEX e.g. "#10B981"
  ownerId: string;
  rating: number;
  reviewCount: number;
  hours: BusinessHours[];
  blockedDates: BlockedDate[];
  reminderRules: ReminderRule[];
  notificationsEnabled: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}
