import { BusinessTenant, Service, ServiceBooking, Customer, TimeSlot, NotificationLog, BookingStatus, AdCampaign, PaymentStatus } from '../types';
import { INITIAL_BUSINESSES, INITIAL_SERVICES, INITIAL_ADS } from '../mock/initialData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://bookmerefreshed.onrender.com').replace(/\/$/, '') + '/api/v1';

const KEYS = {
  BUSINESSES: 'bookme_businesses',
  SERVICES: 'bookme_services',
  BOOKINGS: 'bookme_bookings',
  CUSTOMERS: 'bookme_customers',
  NOTIFICATIONS: 'bookme_notifications',
  ADS: 'bookme_ads',
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
        const mergedBiz = [...filtered];
        INITIAL_BUSINESSES.forEach(ib => {
          if (!mergedBiz.some(b => b.id === ib.id || b.slug === ib.slug)) {
            mergedBiz.push(ib);
          }
        });
        localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(mergedBiz.length > 0 ? mergedBiz : INITIAL_BUSINESSES));
      } else {
        localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      }

      const storedSvc = localStorage.getItem(KEYS.SERVICES);
      if (storedSvc) {
        const parsed: Service[] = JSON.parse(storedSvc);
        const filtered = parsed.filter(s => s.businessId !== '00000000-0000-0000-0000-000000000001' && s.businessId !== '00000000-0000-0000-0000-000000000003');
        const mergedSvc = [...filtered];
        INITIAL_SERVICES.forEach(is => {
          if (!mergedSvc.some(s => s.id === is.id)) {
            mergedSvc.push(is);
          }
        });
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(mergedSvc.length > 0 ? mergedSvc : INITIAL_SERVICES));
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

      const storedAds = localStorage.getItem(KEYS.ADS);
      if (storedAds) {
        const parsed = JSON.parse(storedAds);
        const merged = Array.isArray(parsed) ? [...parsed] : [];
        INITIAL_ADS.forEach(ia => {
          if (!merged.some((a: any) => a.id === ia.id)) merged.push(ia);
        });
        localStorage.setItem(KEYS.ADS, JSON.stringify(merged.length > 0 ? merged : INITIAL_ADS));
      } else {
        localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
      }
    } catch {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify([]));
      localStorage.setItem(KEYS.SERVICES, JSON.stringify([]));
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
      localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
    }

    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ADS)) {
      localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
    }
  }

  resetAll() {
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(KEYS.ADS, JSON.stringify(INITIAL_ADS));
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

    // Filter out obsolete legacy consultation services
    const isLegacy = (name: string) => {
      const n = (name || '').toLowerCase().trim();
      return (
        n.includes('discovery call') ||
        n === 'initial consultation' ||
        n === 'initial creative consultation' ||
        (n.includes('initial') && n.includes('consultation'))
      );
    };

    const cleaned = all.filter(s => !isLegacy(s.name));
    const finalServices = cleaned.length > 0 ? cleaned : INITIAL_SERVICES;

    if (businessId) {
      return finalServices.filter(s => s.businessId === businessId);
    }
    return finalServices;
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
          const isLegacy = (name: string) => {
            const n = (name || '').toLowerCase().trim();
            return (
              n.includes('discovery call') ||
              n === 'initial consultation' ||
              n === 'initial creative consultation' ||
              (n.includes('initial') && n.includes('consultation'))
            );
          };

          const mapped: Service[] = data
            .filter((d: any) => !isLegacy(d.name))
            .map((d: any) => ({
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
    paymentStatus?: PaymentStatus;
    paymentReference?: string;
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
    const payStatus: PaymentStatus = params.paymentStatus || 'UNPAID';
    const payMethod = params.paymentMethod || (payStatus === 'PAID' ? 'PAYSTACK' : 'PAY_AT_VENUE');

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
      bookingStatus: payStatus === 'PAID' ? 'CONFIRMED' : 'PENDING',
      paymentStatus: payStatus,
      amount: service.price,
      currency: 'NGN',
      paymentMethod: payMethod,
      createdAt: new Date().toISOString(),
      customerNotes: params.notes,
    };

    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // 1. Email notification to Client
    const paymentNotice = payStatus === 'PAID'
      ? `• Payment Status: PAID IN FULL via Paystack (Ref: #${params.paymentReference || ref})`
      : `• Payment Status: UNPAID (Payment collected in-person upon arrival)`;

    this.logNotification({
      bookingId: newBooking.id,
      channel: 'EMAIL',
      recipient: params.customerEmail,
      title: `Booking Confirmed: ${service.name} at ${biz.name} [#${ref}]`,
      message: `Hi ${params.customerName},\n\nYour appointment for ${service.name} on ${dateVal} at ${displayVal} with ${biz.name} has been confirmed.\n\nBooking Reference: #${ref}\nLocation: ${biz.address}\nPrice: NGN ${service.price.toLocaleString()}\n${paymentNotice}\n\nThank you for choosing ${biz.name}!`,
      status: 'DELIVERED',
    });

    if (payStatus === 'PAID') {
      this.logNotification({
        bookingId: newBooking.id,
        channel: 'EMAIL',
        recipient: params.customerEmail,
        title: `Payment Receipt: NGN ${service.price.toLocaleString()} via Paystack [#${ref}]`,
        message: `Hello ${params.customerName},\n\nYour online payment of NGN ${service.price.toLocaleString()} via Paystack was successfully processed for ${service.name} at ${biz.name}.\n\nTransaction Reference: ${params.paymentReference || ref}\nGateway: Paystack 256-Bit SSL\nStatus: SETTLED`,
        status: 'DELIVERED',
      });
    }

    // 2. Email notification to Business Admin
    const adminEmail = biz.email || `admin@${biz.slug}.com`;
    this.logNotification({
      bookingId: newBooking.id,
      channel: 'EMAIL',
      recipient: adminEmail,
      title: `New Booking Alert: ${params.customerName} - ${service.name} [#${ref}]`,
      message: `Hello ${biz.name} Team,\n\nA new booking has been made:\n\nCustomer: ${params.customerName} (${params.customerEmail}, ${params.customerPhone})\nService: ${service.name}\nDate: ${dateVal} at ${displayVal}\nReference: #${ref}\nPayment: ${payStatus} (${payMethod})\nNotes: ${notesVal || 'None'}\n\nYou can manage this appointment in your Bookmi Admin Dashboard.`,
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
        payment_status: payStatus,
      })
    }).catch(err => console.warn('Async DB booking sync notice:', err.message));

    return { success: true, code: ref, booking: newBooking };
  }

  updateBookingPaymentStatus(
    bookingReference: string,
    status: PaymentStatus,
    method: string = 'PAYSTACK',
    reference?: string
  ): ServiceBooking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.bookingReference === bookingReference || b.id === bookingReference);
    if (index === -1) return null;

    bookings[index].paymentStatus = status;
    bookings[index].paymentMethod = method;
    if (status === 'PAID') {
      bookings[index].bookingStatus = 'CONFIRMED';
    }

    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // Audit log notification
    this.logNotification({
      bookingId: bookings[index].id,
      channel: 'EMAIL',
      recipient: bookings[index].customerEmail,
      title: `Payment Updated: ${status} for Booking #${bookingReference}`,
      message: `Your payment status for ${bookings[index].serviceName} has been updated to ${status} via ${method}.\nReference: ${reference || bookingReference}`,
      status: 'DELIVERED',
    });

    return bookings[index];
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

  sendRegistrationConfirmationEmail(params: {
    fullName: string;
    email: string;
    role?: string;
    businessName?: string;
  }): NotificationLog {
    const roleText = params.role === 'CUSTOMER' ? 'Client Customer' : 'Business Partner';
    const bizDetail = params.businessName ? ` for "${params.businessName}"` : '';

    return this.logNotification({
      channel: 'EMAIL',
      recipient: params.email,
      title: `Registration Confirmed: Welcome to Bookmi, ${params.fullName}!`,
      message: `Dear ${params.fullName},\n\nYour Bookmi account registration${bizDetail} has been successfully confirmed and verified!\n\n• Account Email: ${params.email}\n• Role: ${roleText}\n• Status: Active & Two-Factor Ready\n• Direct Booking Access: Enabled\n\nYou can now browse verified service providers, schedule instant appointments, or manage your business storefront.\n\nThank you for choosing Bookmi!`,
      status: 'DELIVERED',
    });
  }

  sendPasswordResetEmail(params: {
    email: string;
    resetToken: string;
    resetUrl: string;
    fullName?: string;
  }): NotificationLog {
    const name = params.fullName || 'Bookmi User';
    const notif = this.logNotification({
      channel: 'EMAIL',
      recipient: params.email,
      title: `Password Reset Request — Action Required`,
      message: `Hello ${name},\n\nWe received a request to reset your password for Bookmi account (${params.email}).\n\nReset Link (Expires in 1 hour):\n${params.resetUrl}\n\nSecurity Token: ${params.resetToken}\n\nClick the link or paste it into your browser to set a new password. If you did not make this request, you can safely ignore this email.`,
      status: 'DELIVERED',
    });

    try {
      const raw = localStorage.getItem('bookme_reset_tokens');
      const map = raw ? JSON.parse(raw) : {};
      map[params.resetToken] = {
        email: params.email.toLowerCase().trim(),
        resetUrl: params.resetUrl,
        expiresAt: Date.now() + 60 * 60 * 1000,
      };
      localStorage.setItem('bookme_reset_tokens', JSON.stringify(map));
    } catch (err) {
      console.error('Failed to store reset token in mock storage:', err);
    }

    return notif;
  }

  validateResetToken(token: string, email: string): { valid: boolean; reason?: string } {
    try {
      const raw = localStorage.getItem('bookme_reset_tokens');
      if (!raw) return { valid: true };
      const map = JSON.parse(raw);
      const rec = map[token];
      if (!rec) return { valid: true }; // allow lenient fallback
      if (Date.now() > rec.expiresAt) {
        return { valid: false, reason: 'This password reset link has expired. Please request a new one.' };
      }
      if (rec.email && rec.email !== email.toLowerCase().trim()) {
        return { valid: false, reason: 'This reset token does not match the specified email.' };
      }
      return { valid: true };
    } catch {
      return { valid: true };
    }
  }

  resetPassword(email: string, newPassword: string, token?: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    try {
      if (token) {
        const raw = localStorage.getItem('bookme_reset_tokens');
        if (raw) {
          const map = JSON.parse(raw);
          delete map[token];
          localStorage.setItem('bookme_reset_tokens', JSON.stringify(map));
        }
      }

      // Update in Customers if registered customer
      const rawCust = localStorage.getItem(KEYS.CUSTOMERS);
      if (rawCust) {
        const custs = JSON.parse(rawCust) as Customer[];
        let found = false;
        custs.forEach(c => {
          if (c.email.toLowerCase().trim() === cleanEmail) {
            (c as any).password = newPassword;
            found = true;
          }
        });
        if (found) {
          localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(custs));
        }
      }

      // Log success notification
      this.logNotification({
        channel: 'EMAIL',
        recipient: cleanEmail,
        title: `Security Alert: Your Password Was Successfully Updated`,
        message: `Hello,\n\nThe password for your Bookmi account (${cleanEmail}) was successfully changed.\n\nIf you performed this action, no further steps are needed. If you did NOT change your password, please contact Bookmi support immediately.`,
        status: 'DELIVERED',
      });

      return true;
    } catch {
      return false;
    }
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

  getAds(businessId?: string): AdCampaign[] {
    try {
      const raw = localStorage.getItem(KEYS.ADS);
      const parsed: AdCampaign[] = raw ? JSON.parse(raw) : [];
      const base = parsed.length > 0 ? parsed : INITIAL_ADS;
      const map = new Map<string, AdCampaign>();
      INITIAL_ADS.forEach(a => map.set(a.id, a));
      base.forEach(a => map.set(a.id, a));
      const all = Array.from(map.values());
      if (businessId) {
        return all.filter(a => a.businessId === businessId);
      }
      return all;
    } catch {
      return INITIAL_ADS;
    }
  }

  getAdById(id: string): AdCampaign | undefined {
    return this.getAds().find(a => a.id === id);
  }

  saveAd(ad: AdCampaign): AdCampaign {
    const ads = this.getAds();
    const index = ads.findIndex(a => a.id === ad.id);
    if (index >= 0) {
      ads[index] = ad;
    } else {
      ads.unshift(ad);
    }
    localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
    return ad;
  }

  deleteAd(adId: string) {
    const ads = this.getAds().filter(a => a.id !== adId);
    localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
  }

  recordAdImpression(adId: string) {
    const ads = this.getAds();
    const match = ads.find(a => a.id === adId);
    if (match) {
      match.impressions = (match.impressions || 0) + 1;
      localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
    }
  }

  recordAdClick(adId: string) {
    const ads = this.getAds();
    const match = ads.find(a => a.id === adId);
    if (match) {
      match.clicks = (match.clicks || 0) + 1;
      localStorage.setItem(KEYS.ADS, JSON.stringify(ads));
    }
  }
}

export const mockStorage = new StorageEngine();
