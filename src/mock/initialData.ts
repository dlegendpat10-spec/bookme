import { BusinessTenant, Service, ServiceBooking, Customer, User, AdCampaign } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@bookme.app',
    fullName: 'Business Admin',
    phone: '+234 800 000 0000',
    role: 'BUSINESS_ADMIN',
    businessId: 'biz-default'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_BUSINESSES: BusinessTenant[] = [
  {
    id: 'biz-default',
    name: 'Brain Teaser Educational Consults',
    slug: 'brain-teaser',
    category: 'Educational Consulting & Tutoring',
    description: 'Personalised educational consulting and tutoring sessions designed to unlock each student\'s full potential.',
    phone: '+234 800 000 0000',
    email: 'hello@brainteaser.ng',
    address: 'Lagos, Nigeria',
    accentColor: '#10B981',
    ownerId: 'user-admin-1',
    rating: 5.0,
    reviewCount: 0,
    notificationsEnabled: {
      email: true,
      sms: true,
      whatsapp: true
    },
    hours: [
      { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '10:00', closeTime: '16:00' },
      { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '10:00', closeTime: '14:00' }
    ],
    blockedDates: [],
    reminderRules: []
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-001',
    businessId: 'biz-default',
    name: 'Discovery Call',
    category: 'Consultation',
    description: 'A free 30-minute introductory session to understand your educational needs and goals.',
    durationMinutes: 30,
    bufferMinutes: 5,
    price: 0,
    currency: 'NGN',
    isActive: true,
    bookingCount: 0,
    badge: 'Popular'
  },
  {
    id: 'srv-002',
    businessId: 'biz-default',
    name: 'Initial Consultation',
    category: 'Consultation',
    description: 'A comprehensive 90-minute deep-dive session covering academic history and customized study plan.',
    durationMinutes: 90,
    bufferMinutes: 10,
    price: 25000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 0
  }
];

export const INITIAL_ADS: AdCampaign[] = [];

export const INITIAL_BOOKINGS: ServiceBooking[] = [];
