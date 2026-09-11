import { BusinessTenant, Service, ServiceBooking, Customer, TimeSlot, NotificationLog, BookingStatus } from '../types';
import { INITIAL_BUSINESSES, INITIAL_SERVICES, INITIAL_ADS } from '../mock/initialData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://bookmerefreshed.onrender.com').replace(/\/$/, '') + '/api/v1';

const KEYS = {
  BUSINESSES: 'bookme_businesses',
  SERVICES: 'bookme_services',
  BOOKINGS: 'bookme_bookings',
  CUSTOMERS: 'bookme_customers',
  SIMULATE_CONFLICT: 'bookme_sim_conflict'
};

class StorageEngine {
  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    if (!localStorage.getItem(KEYS.BUSINESSES)) {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    }
    if (!localStorage.getItem(KEYS.SERVICES)) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
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

  getBusinessBySlug(slug: string): BusinessTenant | undefined {
    return this.getBusinesses().find(b => b.slug === slug) || this.getBusinesses()[0];
  }

  getBusinessById(id: string): BusinessTenant | undefined {
    return this.getBusinesses().find(b => b.id === id) || this.getBusinesses()[0];
  }

  updateBusiness(id: string, updates: Partial<BusinessTenant>): BusinessTenant {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) return INITIAL_BUSINESSES[0];
    businesses[index] = { ...businesses[index], ...updates };
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    return businesses[index];
  }

  addBusiness(business: BusinessTenant): BusinessTenant {
    const businesses = this.getBusinesses();
    businesses.push(business);
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    return business;
  }

  getServices(businessId?: string): Service[] {
    const raw = localStorage.getItem(KEYS.SERVICES);
    const all = raw ? (JSON.parse(raw) as Service[]) : INITIAL_SERVICES;
    if (businessId) {
      const filtered = all.filter(s => s.businessId === businessId);
      return filtered.length > 0 ? filtered : INITIAL_SERVICES;
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
        notes: params.notes || ''
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
    return bookings[index];
  }

  updateBookingStatus(bookingId: string, status: BookingStatus): ServiceBooking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].bookingStatus = status;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  }

  getCustomers(businessId?: string): Customer[] {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    const all = raw ? (JSON.parse(raw) as Customer[]) : [];
    if (businessId) return all.filter(c => c.businessId === businessId);
    return all;
  }

  getNotifications(businessId?: string): NotificationLog[] {
    return [];
  }
}

export const mockStorage = new StorageEngine();
