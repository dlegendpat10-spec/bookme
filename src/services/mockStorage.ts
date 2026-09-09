import { BusinessTenant, Service, ServiceBooking, Customer, User, TimeSlot, NotificationLog } from '../types';
import { INITIAL_BUSINESSES, INITIAL_SERVICES, INITIAL_BOOKINGS, INITIAL_CUSTOMERS, INITIAL_USERS } from '../mock/initialData';

const KEYS = {
  BUSINESSES: 'bookme_businesses',
  SERVICES: 'bookme_services',
  BOOKINGS: 'bookme_bookings',
  CUSTOMERS: 'bookme_customers',
  USERS: 'bookme_users',
  NOTIFICATIONS: 'bookme_notifications',
  SIMULATE_CONFLICT: 'bookme_sim_conflict' // Test toggle for double-booking
};

class MockStorageEngine {
  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    const rawBiz = localStorage.getItem(KEYS.BUSINESSES);
    if (!rawBiz || rawBiz.includes('luxe-grooming')) {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
      return;
    }
    if (!localStorage.getItem(KEYS.SERVICES)) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
  }

  // --- Businesses ---
  getBusinesses(): BusinessTenant[] {
    return JSON.parse(localStorage.getItem(KEYS.BUSINESSES) || '[]');
  }

  getBusinessBySlug(slug: string): BusinessTenant | undefined {
    return this.getBusinesses().find(b => b.slug === slug);
  }

  getBusinessById(id: string): BusinessTenant | undefined {
    return this.getBusinesses().find(b => b.id === id);
  }

  updateBusiness(id: string, updates: Partial<BusinessTenant>): BusinessTenant {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
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

  // --- Services ---
  getServices(businessId?: string): Service[] {
    const all = JSON.parse(localStorage.getItem(KEYS.SERVICES) || '[]') as Service[];
    if (businessId) return all.filter(s => s.businessId === businessId);
    return all;
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

  // --- Double-Booking Simulation Toggle ---
  getSimulateConflict(): boolean {
    return localStorage.getItem(KEYS.SIMULATE_CONFLICT) === 'true';
  }

  setSimulateConflict(val: boolean) {
    localStorage.setItem(KEYS.SIMULATE_CONFLICT, val ? 'true' : 'false');
  }

  // --- Availability Calculator ---
  getAvailableSlots(businessId: string, serviceId: string, dateStr: string): TimeSlot[] {
    const business = this.getBusinessById(businessId);
    if (!business) return [];

    const service = this.getServices(businessId).find(s => s.id === serviceId);
    if (!service) return [];

    // Check blocked dates
    const isBlocked = business.blockedDates?.some(b => dateStr >= b.startDate && dateStr <= b.endDate);
    if (isBlocked) return [];

    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    const dayHours = business.hours.find(h => h.dayOfWeek === dayOfWeek);

    if (!dayHours || dayHours.isClosed) return [];

    // Parse open and close times
    const [openH, openM] = dayHours.openTime.split(':').map(Number);
    const [closeH, closeM] = dayHours.closeTime.split(':').map(Number);

    const slotDuration = service.durationMinutes + (service.bufferMinutes || 0);

    // Existing active bookings for this date and business
    const existingBookings = this.getBookings(businessId).filter(
      b => b.date === dateStr && b.bookingStatus !== 'CANCELLED'
    );

    const slots: TimeSlot[] = [];
    let currentMins = openH * 60 + openM;
    const endMins = closeH * 60 + closeM;

    while (currentMins + service.durationMinutes <= endMins) {
      const slotH = Math.floor(currentMins / 60);
      const slotM = currentMins % 60;
      const timeStr = `${String(slotH).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`;
      
      const period = slotH >= 12 ? 'PM' : 'AM';
      const displayH = slotH % 12 === 0 ? 12 : slotH % 12;
      const displayTime = `${displayH}:${String(slotM).padStart(2, '0')} ${period}`;

      // Check collision with existing bookings
      const slotStart = currentMins;
      const slotEnd = currentMins + service.durationMinutes;

      const hasConflict = existingBookings.some(b => {
        const [bStartH, bStartM] = b.time.split(':').map(Number);
        const bStart = bStartH * 60 + bStartM;
        const bEnd = bStart + b.serviceDuration;
        return slotStart < bEnd && slotEnd > bStart;
      });

      slots.push({
        time: timeStr,
        displayTime,
        isAvailable: !hasConflict
      });

      // Advance by 30-minute intervals
      currentMins += 30;
    }

    return slots;
  }

  // --- Bookings & Concurrency Protection ---
  getBookings(businessId?: string): ServiceBooking[] {
    const all = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]') as ServiceBooking[];
    if (businessId) return all.filter(b => b.businessId === businessId);
    return all;
  }

  getCustomerBookings(email: string): ServiceBooking[] {
    const all = this.getBookings();
    return all.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase());
  }

  getBookingById(id: string): ServiceBooking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  getBookingByReference(ref: string): ServiceBooking | undefined {
    return this.getBookings().find(b => b.bookingReference.toUpperCase() === ref.toUpperCase());
  }

  createBooking(data: {
    businessId: string;
    serviceId: string;
    date: string;
    time: string;
    displayTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNotes?: string;
    paymentMethod?: string;
  }): { success: boolean; booking?: ServiceBooking; error?: string; code?: string } {
    // 1. CONCURRENCY TEST TRIGGER: If simulation switch is on, trigger conflict
    if (this.getSimulateConflict()) {
      return {
        success: false,
        error: 'This time was just booked by another customer. Please select another available time.',
        code: 'CONFLICT_409'
      };
    }

    const business = this.getBusinessById(data.businessId);
    if (!business) return { success: false, error: 'Business not found' };

    const service = this.getServices(data.businessId).find(s => s.id === data.serviceId);
    if (!service) return { success: false, error: 'Service not found' };

    // 2. REAL ATOMIC CONFLICT CHECK
    const existing = this.getBookings(data.businessId).filter(
      b => b.date === data.date && b.bookingStatus !== 'CANCELLED'
    );

    const [reqH, reqM] = data.time.split(':').map(Number);
    const reqStart = reqH * 60 + reqM;
    const reqEnd = reqStart + service.durationMinutes;

    const conflict = existing.some(b => {
      const [bH, bM] = b.time.split(':').map(Number);
      const bStart = bH * 60 + bM;
      const bEnd = bStart + b.serviceDuration;
      return reqStart < bEnd && reqEnd > bStart;
    });

    if (conflict) {
      return {
        success: false,
        error: 'This time was just booked by another customer. Please select another available time.',
        code: 'CONFLICT_409'
      };
    }

    // 3. CREATE BOOKING RECORD
    const bookingRef = 'BK-' + Math.floor(10000 + Math.random() * 90000);
    const endH = Math.floor(reqEnd / 60);
    const endM = reqEnd % 60;
    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const newBooking: ServiceBooking = {
      id: 'bk-' + Date.now(),
      bookingReference: bookingRef,
      businessId: business.id,
      businessName: business.name,
      businessSlug: business.slug,
      serviceId: service.id,
      serviceName: service.name,
      serviceDuration: service.durationMinutes,
      customerId: 'cust-' + Date.now(),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      date: data.date,
      time: data.time,
      displayTime: data.displayTime,
      endTime: endTimeStr,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      amount: service.price,
      currency: service.currency,
      paymentMethod: data.paymentMethod || 'Saved Card •••• 4012',
      customerNotes: data.customerNotes,
      createdAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // 4. UPSERT CUSTOMER RECORD
    this.upsertCustomer(business.id, {
      fullName: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
      spendAdd: service.price
    });

    // 5. ASYNCHRONOUS DECOUPLED NOTIFICATION QUEUE DISPATCH
    setTimeout(() => {
      this.dispatchAsyncNotifications(newBooking);
    }, 100);

    return { success: true, booking: newBooking };
  }

  updateBookingStatus(id: string, status: ServiceBooking['bookingStatus']): ServiceBooking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index].bookingStatus = status;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  }

  rescheduleBooking(id: string, newDate: string, newTime: string, newDisplayTime: string): ServiceBooking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    const b = bookings[index];
    const [reqH, reqM] = newTime.split(':').map(Number);
    const reqEnd = reqH * 60 + reqM + b.serviceDuration;
    const endH = Math.floor(reqEnd / 60);
    const endM = reqEnd % 60;

    b.date = newDate;
    b.time = newTime;
    b.displayTime = newDisplayTime;
    b.endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    b.bookingStatus = 'RESCHEDULED';
    
    bookings[index] = b;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // Dispatch update notification asynchronously
    setTimeout(() => {
      this.addNotification({
        id: 'notif-' + Date.now(),
        bookingId: b.id,
        channel: 'WHATSAPP',
        recipient: b.customerPhone,
        title: 'Appointment Rescheduled',
        message: `Hi ${b.customerName}, your appointment for ${b.serviceName} at ${b.businessName} has been rescheduled to ${newDate} at ${newDisplayTime}.`,
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
    }, 100);

    return b;
  }

  // --- Customers CRM ---
  getCustomers(businessId?: string): Customer[] {
    const all = JSON.parse(localStorage.getItem(KEYS.CUSTOMERS) || '[]') as Customer[];
    if (businessId) return all.filter(c => c.businessId === businessId);
    return all;
  }

  private upsertCustomer(businessId: string, info: { fullName: string; email: string; phone: string; spendAdd: number }) {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.businessId === businessId && c.email.toLowerCase() === info.email.toLowerCase());
    if (existing) {
      existing.totalBookings += 1;
      existing.totalSpend += info.spendAdd;
      existing.lastVisit = new Date().toISOString().split('T')[0];
    } else {
      customers.push({
        id: 'cust-' + Date.now(),
        businessId,
        fullName: info.fullName,
        email: info.email,
        phone: info.phone,
        totalBookings: 1,
        totalSpend: info.spendAdd,
        lastVisit: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  // --- Notifications Queue Simulation ---
  getNotifications(bookingId?: string): NotificationLog[] {
    const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]') as NotificationLog[];
    if (bookingId) return all.filter(n => n.bookingId === bookingId);
    return all;
  }

  private addNotification(notif: NotificationLog) {
    const notifs = this.getNotifications();
    notifs.unshift(notif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  private dispatchAsyncNotifications(booking: ServiceBooking) {
    const business = this.getBusinessById(booking.businessId);
    if (!business) return;

    // 1. WhatsApp Confirmation
    if (business.notificationsEnabled.whatsapp) {
      this.addNotification({
        id: 'notif-wa-' + Date.now(),
        bookingId: booking.id,
        channel: 'WHATSAPP',
        recipient: booking.customerPhone,
        title: 'Booking Confirmed ✓',
        message: `Hello ${booking.customerName}! Your appointment for *${booking.serviceName}* on ${booking.date} at ${booking.displayTime} is confirmed (#${booking.bookingReference}). Location: ${business.address}. Reply to this chat if you have any questions!`,
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
    }

    // 2. Email Confirmation
    if (business.notificationsEnabled.email) {
      this.addNotification({
        id: 'notif-em-' + Date.now(),
        bookingId: booking.id,
        channel: 'EMAIL',
        recipient: booking.customerEmail,
        title: `Appointment Confirmed: ${booking.serviceName} at ${business.name}`,
        message: `Dear ${booking.customerName},\n\nThank you for booking with ${business.name}. Your appointment has been scheduled for ${booking.date} at ${booking.displayTime}.\nReference: ${booking.bookingReference}\nAmount Paid: ${booking.currency} ${booking.amount.toLocaleString()}`,
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
    }

    // 3. SMS Confirmation
    if (business.notificationsEnabled.sms) {
      this.addNotification({
        id: 'notif-sms-' + Date.now(),
        bookingId: booking.id,
        channel: 'SMS',
        recipient: booking.customerPhone,
        title: 'SMS Alert',
        message: `BookMe Alert: ${booking.serviceName} at ${business.name} confirmed for ${booking.date} at ${booking.displayTime}. Ref: ${booking.bookingReference}`,
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
    }
  }

  // --- Reset to Initial Seeds ---
  resetAll() {
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.SIMULATE_CONFLICT, 'false');
  }
}

export const mockStorage = new MockStorageEngine();
