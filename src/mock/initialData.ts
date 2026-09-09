import { BusinessTenant, Service, ServiceBooking, Customer, User, AdCampaign } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@luxegrooming.com',
    fullName: 'Marcus Vance',
    phone: '+234 802 345 6789',
    role: 'BUSINESS_ADMIN',
    businessId: 'biz-luxe-grooming'
  },
  {
    id: 'user-admin-2',
    email: 'sarah@apexadvisory.com',
    fullName: 'Dr. Sarah Jenkins',
    phone: '+234 803 987 6543',
    role: 'BUSINESS_ADMIN',
    businessId: 'biz-apex-advisory'
  },
  {
    id: 'user-customer-returning',
    email: 'alex.morgan@example.com',
    fullName: 'Alex Morgan',
    phone: '+234 809 111 2233',
    role: 'CUSTOMER'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-alex-morgan',
    businessId: 'biz-luxe-grooming',
    userId: 'user-customer-returning',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+234 809 111 2233',
    notes: 'Prefers matte finish pomade, sensitive skin on neck.',
    totalBookings: 6,
    totalSpend: 75000,
    lastVisit: '2026-08-28',
    createdAt: '2026-05-12T10:00:00Z',
    savedCards: [
      {
        id: 'card-tok-1',
        cardType: 'mastercard',
        last4: '4012',
        expiryMonth: 11,
        expiryYear: 2028,
        isDefault: true
      }
    ]
  },
  {
    id: 'cust-chioma-okafor',
    businessId: 'biz-luxe-grooming',
    fullName: 'Chioma Okafor',
    email: 'chioma@example.com',
    phone: '+234 805 777 8899',
    notes: 'Always books Saturday mornings.',
    totalBookings: 3,
    totalSpend: 45000,
    lastVisit: '2026-09-02',
    createdAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'cust-emmanuel-ade',
    businessId: 'biz-apex-advisory',
    fullName: 'Emmanuel Adeyemi',
    email: 'emmanuel.ade@example.com',
    phone: '+234 814 333 4455',
    notes: 'Applying for Oxford Fall 2027.',
    totalBookings: 2,
    totalSpend: 120000,
    lastVisit: '2026-09-01',
    createdAt: '2026-08-01T09:00:00Z'
  }
];

export const INITIAL_BUSINESSES: BusinessTenant[] = [
  {
    id: 'biz-luxe-grooming',
    name: 'Luxe Grooming Lounge',
    slug: 'luxe-grooming',
    category: 'Barbershop & Men\'s Grooming',
    description: 'Premier executive styling, precision beard trims, hot towel therapies, and luxury male grooming experiences in an atmosphere of tailored sophistication.',
    heroImageUrl: '/images/barber_hero.jpg',
    phone: '+234 802 345 6789',
    email: 'bookings@luxegrooming.com',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos',
    accentColor: '#10B981',
    ownerId: 'user-admin-1',
    rating: 4.9,
    reviewCount: 218,
    notificationsEnabled: {
      email: true,
      sms: true,
      whatsapp: true
    },
    hours: [
      { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '12:00', closeTime: '18:00' },
      { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '08:30', closeTime: '20:30' }
    ],
    blockedDates: [],
    reminderRules: [
      {
        id: 'rem-1',
        businessId: 'biz-luxe-grooming',
        hoursBefore: 24,
        channels: ['EMAIL', 'WHATSAPP'],
        enabled: true,
        template: 'Hi {{customer_name}}, this is a reminder for your {{service_name}} appointment tomorrow at {{time}} with Luxe Grooming.'
      },
      {
        id: 'rem-2',
        businessId: 'biz-luxe-grooming',
        hoursBefore: 2,
        channels: ['WHATSAPP', 'SMS'],
        enabled: true,
        template: 'Hi {{customer_name}}, your appointment is in 2 hours at {{time}}! See you soon at 14 Admiralty Way.'
      }
    ]
  },
  {
    id: 'biz-serenity-wellness',
    name: 'Serenity Wellness & Float Spa',
    slug: 'serenity-wellness',
    category: 'Medical & Wellness Spa',
    description: 'Holistic rejuvenation, deep tissue mineral therapies, Epsom float tanks, and lymphatic restoration designed for pure sensory tranquility.',
    heroImageUrl: '/images/spa_hero.jpg',
    phone: '+234 807 555 1212',
    email: 'relax@serenityspa.com',
    address: '8 Glover Road, Ikoyi, Lagos',
    accentColor: '#0EA5E9',
    ownerId: 'user-admin-1',
    rating: 4.8,
    reviewCount: 142,
    notificationsEnabled: {
      email: true,
      sms: true,
      whatsapp: true
    },
    hours: [
      { dayOfWeek: 0, dayName: 'Sunday', isClosed: false, openTime: '11:00', closeTime: '19:00' },
      { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '09:00', closeTime: '21:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '09:00', closeTime: '21:00' }
    ],
    blockedDates: [],
    reminderRules: []
  },
  {
    id: 'biz-apex-advisory',
    name: 'Apex Academic & Admissions Advisory',
    slug: 'apex-advisory',
    category: 'Educational Consulting & Tutoring',
    description: 'Strategic international university admissions consulting, Ivy League interview prep, and personalized academic coaching.',
    phone: '+234 803 987 6543',
    email: 'contact@apexadvisory.com',
    address: 'Victoria Island & Virtual (Zoom/Meet)',
    accentColor: '#6366F1',
    ownerId: 'user-admin-2',
    rating: 5.0,
    reviewCount: 94,
    notificationsEnabled: {
      email: true,
      sms: false,
      whatsapp: true
    },
    hours: [
      { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '10:00', closeTime: '16:00' },
      { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '10:00', closeTime: '18:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '10:00', closeTime: '18:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '10:00', closeTime: '18:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '10:00', closeTime: '18:00' },
      { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '10:00', closeTime: '17:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '10:00', closeTime: '15:00' }
    ],
    blockedDates: [],
    reminderRules: []
  }
];

export const INITIAL_SERVICES: Service[] = [
  // Luxe Grooming Services
  {
    id: 'srv-haircut-classic',
    businessId: 'biz-luxe-grooming',
    name: 'Executive Precision Haircut',
    category: 'Haircut',
    description: 'Detailed consultation, precision scissor & clipper styling, energizing scalp wash, and finishing with premium pomade.',
    durationMinutes: 30,
    bufferMinutes: 10,
    price: 10000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 142,
    imageUrl: '/images/haircut_card.jpg',
    badge: 'Most Popular'
  },
  {
    id: 'srv-beard-sculpt',
    businessId: 'biz-luxe-grooming',
    name: 'Hot Towel Beard Sculpt & Oil Treatment',
    category: 'Beard Care',
    description: 'Steamed lavender hot towel compress, razor-crisp contour definition, and organic cedarwood beard butter massage.',
    durationMinutes: 30,
    bufferMinutes: 5,
    price: 7500,
    currency: 'NGN',
    isActive: true,
    bookingCount: 98,
    badge: 'Staff Pick'
  },
  {
    id: 'srv-vip-combo',
    businessId: 'biz-luxe-grooming',
    name: 'The Royal Treatment (Haircut + Beard + Facial)',
    category: 'Combos',
    description: 'The definitive executive package: Precision haircut, signature beard sculpt, purifying volcanic charcoal mask, and neck massage.',
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 22000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 84,
    badge: 'VIP Experience'
  },
  {
    id: 'srv-kids-cut',
    businessId: 'biz-luxe-grooming',
    name: 'Young Executive Cut (Ages 3-12)',
    category: 'Haircut',
    description: 'Gentle, patient styling, soft taper fade, and crisp edge trim tailored for young gentlemen.',
    durationMinutes: 30,
    bufferMinutes: 5,
    price: 8000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 31
  },

  // Serenity Wellness
  {
    id: 'srv-deep-tissue',
    businessId: 'biz-serenity-wellness',
    name: 'Deep Tissue Mineral Massage (60 min)',
    category: 'Massage',
    description: 'Targeted myofascial release with organic eucalyptus & arnica therapeutic massage oils.',
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 32000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 77,
    imageUrl: '/images/spa_hero.jpg',
    badge: 'Recommended'
  },
  {
    id: 'srv-float-therapy',
    businessId: 'biz-serenity-wellness',
    name: 'Sensory Deprivation Epsom Float (60 min)',
    category: 'Flotation',
    description: 'Zero-gravity flotation in 500kg medical-grade magnesium solution for instant nervous system reset.',
    durationMinutes: 60,
    bufferMinutes: 20,
    price: 28000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 65
  },

  // Apex Advisory Services
  {
    id: 'srv-ivy-strategy',
    businessId: 'biz-apex-advisory',
    name: 'Undergraduate Admissions Strategy Session',
    category: 'Advisory',
    description: 'Comprehensive 1-on-1 evaluation of academic portfolio, extracurricular spike planning, and college list formulation.',
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 65000,
    currency: 'NGN',
    isActive: true,
    bookingCount: 46,
    badge: 'High Demand'
  }
];

export const INITIAL_ADS: AdCampaign[] = [
  {
    id: 'ad-weekend-flash',
    businessId: 'biz-luxe-grooming',
    title: 'Weekend Executive Flash Sale',
    headline: '⚡ 20% OFF All Executive Combos This Weekend',
    description: 'Use code LUXE20 during checkout to enjoy luxury grooming at a preferential rate. Limited slots available.',
    discountCode: 'LUXE20',
    discountPercent: 20,
    badgeText: 'FEATURED PROMOTION',
    ctaText: 'Claim 20% Off & Book Now',
    targetServiceId: 'srv-vip-combo',
    placement: 'HERO_BANNER',
    isActive: true,
    impressions: 482,
    clicks: 136,
    bookingsCount: 29,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ad-top-marquee',
    businessId: 'biz-luxe-grooming',
    title: 'New Client VIP Perks',
    headline: '🎉 First time booking? Receive a complimentary hot towel scalp therapy with any service!',
    description: 'Automatically applied to all first-time client appointments.',
    badgeText: 'SPECIAL ANNOUNCEMENT',
    ctaText: 'Explore Menu',
    placement: 'TOP_MARQUEE',
    isActive: true,
    impressions: 890,
    clicks: 215,
    bookingsCount: 42,
    createdAt: '2026-09-02T10:00:00Z'
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: 'bk-1001',
    bookingReference: 'BK-78412',
    businessId: 'biz-luxe-grooming',
    businessName: 'Luxe Grooming Lounge',
    businessSlug: 'luxe-grooming',
    serviceId: 'srv-haircut-classic',
    serviceName: 'Executive Precision Haircut',
    serviceDuration: 30,
    customerId: 'cust-alex-morgan',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    customerPhone: '+234 809 111 2233',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    displayTime: '2:00 PM',
    endTime: '14:30',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    amount: 10000,
    currency: 'NGN',
    paymentMethod: 'Mastercard •••• 4012',
    customerNotes: 'Please wash scalp thoroughly.',
    createdAt: '2026-09-05T12:00:00Z'
  }
];
