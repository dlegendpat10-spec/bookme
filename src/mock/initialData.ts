import { BusinessTenant, Service, ServiceBooking, Customer, User, AdCampaign } from '../types';

export const INITIAL_BUSINESSES: BusinessTenant[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Brain Teaser Educational Consults',
    slug: 'luxe-grooming',
    category: 'Advisory',
    description: 'Professional educational guidance, tutoring, and university admissions advisory.',
    logoUrl: '',
    phone: '+234 800 000 0000',
    email: 'hello@brainteaser.ng',
    address: 'Lagos, Nigeria',
    accentColor: '#7C3AED',
    ownerId: 'usr-001',
    rating: 4.9,
    reviewCount: 142,
    hours: [
      { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '09:00', closeTime: '16:00' },
      { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '00:00', closeTime: '00:00' },
    ],
    blockedDates: [],
    reminderRules: [],
    notificationsEnabled: {
      email: true,
      sms: true,
      whatsapp: true,
    }
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    businessId: '00000000-0000-0000-0000-000000000001',
    name: 'Initial Academic Consultation',
    description: 'Comprehensive 1-on-1 assessment of student goals and academic strategy.',
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 15000,
    currency: 'NGN',
    bookingCount: 42,
    isActive: true,
    category: 'Consultation'
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    businessId: '00000000-0000-0000-0000-000000000001',
    name: '1-on-1 Subject Tutoring',
    description: 'Personalised subject tutoring session with practice materials.',
    durationMinutes: 90,
    bufferMinutes: 15,
    price: 25000,
    currency: 'NGN',
    bookingCount: 88,
    isActive: true,
    category: 'Tutoring'
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    businessId: '00000000-0000-0000-0000-000000000001',
    name: 'University Admissions Strategy',
    description: 'Expert guidance on university application essays and interview prep.',
    durationMinutes: 120,
    bufferMinutes: 30,
    price: 40000,
    currency: 'NGN',
    bookingCount: 64,
    isActive: true,
    category: 'Admissions'
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_USERS: User[] = [];

export const INITIAL_ADS: AdCampaign[] = [
  {
    id: 'ad-001',
    businessId: '00000000-0000-0000-0000-000000000001',
    placement: 'HERO_BANNER',
    badgeText: 'New Client Special',
    title: 'Special Offer',
    headline: 'Get 20% Off Your First Consultation',
    description: 'Book your academic session today and lock in instant discount.',
    ctaText: 'Claim Offer',
    discountCode: 'BOOK20',
    isActive: true,
    impressions: 120,
    clicks: 45,
    bookingsCount: 12,
    createdAt: new Date().toISOString()
  }
];
