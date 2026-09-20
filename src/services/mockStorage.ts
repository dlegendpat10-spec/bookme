import { BusinessTenant, Service, ServiceBooking, Customer, TimeSlot, NotificationLog, BookingStatus } from '../types';
import { INITIAL_BUSINESSES, INITIAL_SERVICES, INITIAL_ADS } from '../mock/initialData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://bookmerefreshed.onrender.com').replace(/\/$/, '') + '/api/v1';

const KEYS = {
  BUSINESSES: 'bookme_businesses',
  SERVICES: 'bookme_services',
  BOOKINGS: 'bookme_bookings',
  CUSTOMERS: 'bookme_customers',
  NOTIFICATIONS: 'bookme_notifications',
  SIMULATE_CONFLICT: 'bookme_sim_conflict'
};

const EMPTY_BUSINESS: BusinessTenant = {
  id: '',
  name: 'My Business',
  slug: 'my-business',
  category: 'General',
  description: '',
  logoUrl: '',
  phone: '',
  email: '',
  address: '',
  accentColor: '#7C3AED',
  ownerId: '',
  rating: 5.0,
  reviewCount: 0,
  hours: [
    { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '08:00', closeTime: '17:00' },
    { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '08:00', closeTime: '17:00' },
    { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '08:00', closeTime: '17:00' },
    { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '08:00', closeTime: '17:00' },
    { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '08:00', closeTime: '17:00' },
    { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '09:00', closeTime: '15:00' },
    { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '00:00', closeTime: '00:00' },
  ],
  blockedDates: [],
  reminderRules: [],
  notificationsEnabled: {
    email: true,
    sms: false,
    whatsapp: false,
  },
};

class StorageEngine {
  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    try {
      const storedBiz = localStorage.getItem(KEYS.BUSINESSES);
      if (storedBiz) {
        const parsed: BusinessTenant[] = JSON.parse(storedBiz);
        const filtered = parsed.filter(b => b.slug !== 'luxe-grooming' && b.id !== '00000000-0000-0000-0000-000000000001');
        localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(filtered));
      } else {
        localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      }

      const storedSvc = localStorage.getItem(KEYS.SERVICES);
      if (storedSvc) {
        const parsed: Service[] = JSON.parse(storedSvc);
        const filtered = parsed.filter(s => s.businessId !== '00000000-0000-0000-0000-000000000001' && s.businessId !== '00000000-0000-0000-0000-000000000003');
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(filtered));
      } else {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      }

      const storedNotifs = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (storedNotifs) {
        const parsed = JSON.parse(storedNotifs);
        const filtered = Array.isArray(parsed) ? parsed.filter((n: any) => !n.title?.includes('Luxe') && !n.message?.includes('Luxe')) : [];
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(filtered));
      } else {
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
      }
    } catch {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify([]));
      localStorage.setItem(KEYS.SERVICES, JSON.stringify([]));
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    }

    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
    }
  }

  resetAll() {
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
  }

  getBusinesses(): BusinessTenant[] {
    const raw = localStorage.getItem(KEYS.BUSINESSES);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.length > 0 ? parsed : INITIAL_BUSINESSES;
  }

  getActiveBusiness(businessId?: string | null, slug?: string | null): BusinessTenant {
    const all = this.getBusinesses();
    if (businessId) {
      const match = all.find(b => b.id === businessId);
      if (match) return match;
    }
    if (slug) {
      const match = all.find(b => b.slug.toLowerCase() === slug.toLowerCase());
      if (match) return match;
    }
    return all[0] || EMPTY_BUSINESS;
  }

  getBusinessBySlug(slug: string): BusinessTenant | undefined {
    if (!slug) return undefined;
    const clean = slug.toLowerCase().trim();
    return this.getBusinesses().find(b => b.slug.toLowerCase() === clean);
  }

  getBusinessById(id: string): BusinessTenant | undefined {
    return this.getBusinesses().find(b => b.id === id);
  }

  updateBusiness(id: string, updates: Partial<BusinessTenant>): BusinessTenant {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) {
      const created: BusinessTenant = {
        ...EMPTY_BUSINESS,
        id,
        ...updates
      } as BusinessTenant;
      businesses.push(created);
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
      return created;
    }
    businesses[index] = { ...businesses[index], ...updates };
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    return businesses[index];
  }

  addBusiness(business: BusinessTenant): BusinessTenant {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === business.id || b.slug === business.slug);
    if (index >= 0) {
      businesses[index] = { ...businesses[index], ...business };
    } else {
      businesses.unshift(business);
    }
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    return business;
  }

  getServices(businessId?: string): Service[] {
    const raw = localStorage.getItem(KEYS.SERVICES);
    const all = raw ? (JSON.parse(raw) as Service[]) : INITIAL_SERVICES;
    if (businessId) {
      return all.filter(s => s.businessId === businessId);
    }
    return all.length > 0 ? all : INITIAL_SERVICES;
  }

  saveService(service: Service): Service {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.unshift(service);
    }
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    return service;
  }

  deleteService(serviceId: string) {
    const services = this.getServices().filter(s => s.id !== serviceId);
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
  }

  async fetchRemoteServices(businessSlug?: string): Promise<Service[]> {
    try {
      const url = businessSlug
        ? `${API_BASE_URL}/services?slug=${encodeURIComponent(businessSlug)}`
        : `${API_BASE_URL}/services`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (Array.isArray(data)) {
          const mapped: Service[] = data.map((d: any) => ({
            id: d.id,
            businessId: d.business_id,
            name: d.name,
            category: d.category || 'General',
            description: d.description || '',
            durationMinutes: Number(d.duration_minutes) || 30,
            bufferMinutes: Number(d.buffer_minutes) || 0,
            price: Number(d.price) || 0,
            currency: d.currency || 'NGN',
            isActive: d.is_active ?? true,
            bookingCount: d.booking_count || 0,
            badge: d.badge,
            businessName: d.business_name,
            businessSlug: d.business_slug,
            businessAddress: d.business_address,
          }));

          if (mapped.length > 0) {
            const current = this.getServices();
            const map = new Map<string, Service>();
            current.forEach(s => map.set(s.id, s));
            mapped.forEach(s => map.set(s.id, s));
            localStorage.setItem(KEYS.SERVICES, JSON.stringify(Array.from(map.values())));
          }
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Could not fetch remote services, using local storage fallback:', e);
    }
    return businessSlug ? [] : this.getServices();
  }

  getSimulateConflict(): boolean {
    return localStorage.getItem(KEYS.SIMULATE_CONFLICT) === 'true';
  }

  setSimulateConflict(enabled: boolean) {
    localStorage.setItem(KEYS.SIMULATE_CONFLICT, enabled ? 'true' : 'false');
  }

  getAvailableSlots(businessId: string, serviceId: string, dateStr: string): TimeSlot[] {
    const defaultTimes = [
      { time: '09:00', displayTime: '09:00 AM' },
      { time: '10:30', displayTime: '10:30 AM' },
      { time: '13:00', displayTime: '01:00 PM' },
      { time: '14:30', displayTime: '02:30 PM' },
      { time: '16:00', displayTime: '04:00 PM' },
    ];
    return defaultTimes.map(t => ({
      time: t.time,
      displayTime: t.displayTime,
      isAvailable: true
    }));
  }

  getBookings(businessId?: string): ServiceBooking[] {
    const raw = localStorage.getItem(KEYS.BOOKINGS);
    const all = raw ? (JSON.parse(raw) as ServiceBooking[]) : [];
    if (businessId) return all.filter(b => b.businessId === businessId);
    return all;
  }

  getBookingById(id: string): ServiceBooking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  getBookingByReference(ref: string): ServiceBooking | undefined {
    return this.getBookings().find(b => b.bookingReference.toLowerCase() === ref.toLowerCase());
  }

  getCustomerBookings(emailOrPhone: string): ServiceBooking[] {
    return this.getBookings().filter(b => 
      b.customerEmail.toLowerCase() === emailOrPhone.toLowerCase() ||
      b.customerPhone === emailOrPhone
    );
  }

  createBooking(params: {
    businessId: string;
    serviceId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    bookingDate?: string;
    date?: string;
    startTime?: string;
    time?: string;
    displayTime?: string;
    paymentMethod?: string;
    notes?: string;
    customerNotes?: string;
  }): { success: boolean; code?: string; booking?: ServiceBooking; error?: string } {
    const bookings = this.getBookings();
    const ref = 'BKM-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const service = this.getServices().find(s => s.id === params.serviceId) || INITIAL_SERVICES[0];
    const biz = this.getBusinessById(params.businessId) || INITIAL_BUSINESSES[0];
    const dateVal = params.bookingDate || params.date || new Date().toISOString().split('T')[0];
    const timeVal = params.startTime || params.time || '09:00';
    const displayVal = params.displayTime || timeVal;
    const notesVal = params.notes || params.customerNotes || '';

    const newBooking: ServiceBooking = {
      id: 'bk-' + Date.now(),
      bookingReference: ref,
      businessId: biz.id,
      businessName: biz.name,
      businessSlug: biz.slug,
      serviceId: service.id,
      serviceName: service.name,
      serviceDuration: service.durationMinutes,
      customerId: 'cust-' + Date.now(),
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      date: dateVal,
      time: timeVal,
      displayTime: displayVal,
      endTime: timeVal,
      bookingStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      amount: service.price,
      currency: 'NGN',
      paymentMethod: 'PAY_AT_VENUE',
      createdAt: new Date().toISOString(),
      customerNotes: params.notes,
    };

    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // 1. Email notification to Client
    this.logNotification({
      bookingId: newBooking.id,
      channel: 'EMAIL',
      recipient: params.customerEmail,
      title: `Booking Confirmed: ${service.name} at ${biz.name} [#${ref}]`,
      message: `Hi ${params.customerName},\n\nYour appointment for ${service.name} on ${dateVal} at ${displayVal} with ${biz.name} has been confirmed.\n\nBooking Reference: #${ref}\nLocation: ${biz.address}\nPrice: NGN ${service.price.toLocaleString()}\n\nThank you for choosing ${biz.name}!`,
      status: 'DELIVERED',
    });

    // 2. Email notification to Business Admin
    const adminEmail = biz.email || `admin@${biz.slug}.com`;
    this.logNotification({
      bookingId: newBooking.id,
      channel: 'EMAIL',
      recipient: adminEmail,
      title: `New Booking Alert: ${params.customerName} - ${service.name} [#${ref}]`,
      message: `Hello ${biz.name} Team,\n\nA new booking has been made:\n\nCustomer: ${params.customerName} (${params.customerEmail}, ${params.customerPhone})\nService: ${service.name}\nDate: ${dateVal} at ${displayVal}\nReference: #${ref}\nNotes: ${notesVal || 'None'}\n\nYou can manage this appointment in your BookMe Admin Dashboard.`,
      status: 'DELIVERED',
    });

    // Asynchronous backend REST POST to PostgreSQL database
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: biz.id,
        service_id: service.id,
        customer_id: '00000000-0000-0000-0000-000000000002',
        booking_date: dateVal,
        start_time: params.startTime,
        notes: params.notes || '',
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
      })
    }).catch(err => console.warn('Async DB booking sync notice:', err.message));

    return { success: true, code: ref, booking: newBooking };
  }

  rescheduleBooking(bookingId: string, newDate: string, newTime: string, _reason?: string): ServiceBooking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].date = newDate;
    bookings[index].time = newTime;
    bookings[index].bookingStatus = 'RESCHEDULED';
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    const booking = bookings[index];
    const biz = this.getBusinessById(booking.businessId) || INITIAL_BUSINESSES[0];

    // Email to Client
    this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: booking.customerEmail,
      title: `Booking Rescheduled: #${booking.bookingReference} to ${newDate} at ${newTime}`,
      message: `Hi ${booking.customerName},\n\nYour appointment for ${booking.serviceName} at ${booking.businessName} has been rescheduled to ${newDate} at ${newTime}.\n\nWe look forward to seeing you then!`,
      status: 'DELIVERED',
    });

    // Email to Admin
    this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: biz.email || `admin@${biz.slug}.com`,
      title: `Schedule Change: Booking #${booking.bookingReference} Moved to ${newDate} at ${newTime}`,
      message: `Booking #${booking.bookingReference} for ${booking.customerName} has been rescheduled to ${newDate} at ${newTime}.`,
      status: 'DELIVERED',
    });

    return bookings[index];
  }

  updateBookingStatus(bookingId: string, status: BookingStatus, reason?: string): ServiceBooking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].bookingStatus = status;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    const booking = bookings[index];
    const biz = this.getBusinessById(booking.businessId) || INITIAL_BUSINESSES[0];

    // Email to Client
    this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: booking.customerEmail,
      title: `Booking #${booking.bookingReference} Status Changed to ${status}`,
      message: `Hi ${booking.customerName},\n\nYour appointment for ${booking.serviceName} at ${booking.businessName} on ${booking.date} at ${booking.displayTime} has been updated to: ${status}.${reason ? `\n\nReason: ${reason}` : ''}\n\nIf you have any questions, please contact ${booking.businessName}.`,
      status: 'DELIVERED',
    });

    // Email to Admin
    this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: biz.email || `admin@${biz.slug}.com`,
      title: `Booking #${booking.bookingReference} Status Updated to ${status}`,
      message: `Notice: Booking #${booking.bookingReference} for ${booking.customerName} has been marked as ${status}.${reason ? `\nReason: ${reason}` : ''}`,
      status: 'DELIVERED',
    });

    return bookings[index];
  }

  sendCustomerEmailMessage(bookingId: string, message: string): { clientEmail: NotificationLog; adminEmail: NotificationLog } {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');
    const biz = this.getBusinessById(booking.businessId) || INITIAL_BUSINESSES[0];

    const clientEmail = this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: booking.customerEmail,
      title: `Message from ${booking.businessName}: Re: Booking #${booking.bookingReference}`,
      message: `Hi ${booking.customerName},\n\n${booking.businessName} sent you a message regarding your appointment on ${booking.date} at ${booking.displayTime}:\n\n"${message}"\n\nYou can reply directly to this email to get in touch.`,
      status: 'DELIVERED',
    });

    const adminEmail = this.logNotification({
      bookingId: booking.id,
      channel: 'EMAIL',
      recipient: biz.email || `admin@${biz.slug}.com`,
      title: `[Sent Copy] Message sent to ${booking.customerName} [#${booking.bookingReference}]`,
      message: `A message was sent to ${booking.customerName} (${booking.customerEmail}):\n\n"${message}"`,
      status: 'DELIVERED',
    });

    return { clientEmail, adminEmail };
  }

  logNotification(params: {
    bookingId?: string;
    channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
    recipient: string;
    title: string;
    message: string;
    status?: 'DELIVERED' | 'QUEUED' | 'FAILED';
  }): NotificationLog {
    const all = this.getNotifications();
    const item: NotificationLog = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      bookingId: params.bookingId || '',
      channel: params.channel,
      recipient: params.recipient,
      title: params.title,
      message: params.message,
      status: params.status || 'DELIVERED',
      sentAt: new Date().toISOString()
    };
    all.unshift(item);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
    return item;
  }

  getCustomers(businessId?: string): Customer[] {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    const all = raw ? (JSON.parse(raw) as Customer[]) : [];
    if (businessId) return all.filter(c => c.businessId === businessId);
    return all;
  }

  getNotifications(businessId?: string): NotificationLog[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return [];
    try {
      const all = JSON.parse(raw) as NotificationLog[];
      return all;
    } catch {
      return [];
    }
  }
}

export const mockStorage = new StorageEngine();
