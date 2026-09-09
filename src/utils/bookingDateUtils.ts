import { Booking, CalendarEvent } from '../types';

/**
 * Helper to add days to a YYYY-MM-DD date string (positive or negative)
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map((v) => parseInt(v, 10));
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get list of all dates between startDate and endDate inclusive
 */
export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = startDate;
  let guard = 0;

  while (current <= endDate && guard < 60) {
    dates.push(current);
    current = addDaysToDateString(current, 1);
    guard++;
  }

  return dates;
}

export interface BlockedDateInfo {
  date: string;
  isEventDay: boolean;
  isBufferDay: boolean;
  isBufferBefore?: boolean;
  isBufferAfter?: boolean;
  bufferDayNumber?: number;
  title: string;
  clientName?: string;
  reason: string;
  reference?: string;
}

/**
 * Build a map of all blocked dates from confirmed bookings and booked calendar events.
 * User requirement: By default, make 2 days BEFORE the event unavailable for site setup, tent rigging, staging, and logistics,
 * with admin-configurable buffer days before and after.
 */
export function getBlockedDatesMap(
  bookings: Booking[],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): Map<string, BlockedDateInfo> {
  const map = new Map<string, BlockedDateInfo>();

  // 1. Process Confirmed / Completed Bookings
  bookings.forEach((b) => {
    if (b.status === 'confirmed' || b.status === 'completed') {
      if (!b.eventDate) return;
      const start = b.eventDate;
      const end = b.endDate || b.eventDate;

      // Event active days
      const activeEventDays = getDatesBetween(start, end);
      activeEventDays.forEach((d) => {
        map.set(d, {
          date: d,
          isEventDay: true,
          isBufferDay: false,
          title: `${b.eventType.toUpperCase()} Event (${b.clientName})`,
          clientName: b.clientName,
          reason: `Confirmed Event Date (${b.eventType.replace('_', ' ')})`,
          reference: b.referenceNumber
        });
      });

      // Buffer Days BEFORE event (Site prep, mega tent rigging, sound/stage transport & installation)
      for (let i = 1; i <= bufferDaysBefore; i++) {
        const bufferDate = addDaysToDateString(start, -i);
        if (!map.has(bufferDate)) {
          map.set(bufferDate, {
            date: bufferDate,
            isEventDay: false,
            isBufferDay: true,
            isBufferBefore: true,
            bufferDayNumber: i,
            title: `Site Prep & Rigging Buffer (${i} day${i > 1 ? 's' : ''} before)`,
            clientName: b.clientName,
            reason: `Mandatory Pre-Event Setup & Tent Rigging Buffer (${b.clientName})`,
            reference: b.referenceNumber
          });
        }
      }

      // Buffer Days AFTER event (Teardown & restock if configured)
      for (let i = 1; i <= bufferDaysAfter; i++) {
        const bufferDate = addDaysToDateString(end, i);
        if (!map.has(bufferDate)) {
          map.set(bufferDate, {
            date: bufferDate,
            isEventDay: false,
            isBufferDay: true,
            isBufferAfter: true,
            bufferDayNumber: i,
            title: `Teardown & Logistics Buffer (Day ${i})`,
            clientName: b.clientName,
            reason: `Post-Event Fleet Restocking & Inspection Buffer`,
            reference: b.referenceNumber
          });
        }
      }
    }
  });

  // 2. Process Booked Calendar Events
  calendarEvents.forEach((evt) => {
    if (evt.status === 'booked') {
      if (!evt.startDate) return;
      const start = evt.startDate;
      const end = evt.endDate || evt.startDate;

      const activeDays = getDatesBetween(start, end);
      activeDays.forEach((d) => {
        if (!map.has(d)) {
          map.set(d, {
            date: d,
            isEventDay: true,
            isBufferDay: false,
            title: evt.title,
            clientName: evt.clientName,
            reason: `Confirmed Event Schedule: ${evt.title}`,
          });
        }
      });

      // Buffer days BEFORE event
      for (let i = 1; i <= bufferDaysBefore; i++) {
        const bufferDate = addDaysToDateString(start, -i);
        if (!map.has(bufferDate)) {
          map.set(bufferDate, {
            date: bufferDate,
            isEventDay: false,
            isBufferDay: true,
            isBufferBefore: true,
            bufferDayNumber: i,
            title: `Pre-Event Setup Buffer (${i} day${i > 1 ? 's' : ''} prior)`,
            clientName: evt.clientName,
            reason: `Site Preparation & Staging Buffer for ${evt.title}`,
          });
        }
      }

      // Buffer days AFTER event
      for (let i = 1; i <= bufferDaysAfter; i++) {
        const bufferDate = addDaysToDateString(end, i);
        if (!map.has(bufferDate)) {
          map.set(bufferDate, {
            date: bufferDate,
            isEventDay: false,
            isBufferDay: true,
            isBufferAfter: true,
            bufferDayNumber: i,
            title: `Post-Event Teardown Buffer (Day ${i})`,
            reason: `Fleet Recovery & Restock Buffer`,
          });
        }
      }
    }
  });

  return map;
}

/**
 * Check if a single date is blocked
 */
export function checkDateBlocked(
  dateStr: string,
  bookings: Booking[],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): BlockedDateInfo | null {
  if (!dateStr) return null;
  const blockedMap = getBlockedDatesMap(bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter);
  return blockedMap.get(dateStr) || null;
}

/**
 * Check if a date range (start date + duration days) conflicts with any confirmed booking or buffer days
 */
export function checkDateRangeBlocked(
  startDateStr: string,
  durationDays: number,
  bookings: Booking[],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): { isBlocked: boolean; conflict?: BlockedDateInfo } {
  if (!startDateStr) return { isBlocked: false };

  const blockedMap = getBlockedDatesMap(bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter);
  let current = startDateStr;

  for (let i = 0; i < Math.max(1, durationDays); i++) {
    const conflict = blockedMap.get(current);
    if (conflict) {
      return { isBlocked: true, conflict };
    }
    current = addDaysToDateString(current, 1);
  }

  return { isBlocked: false };
}

/**
 * Get current today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Check if a date string is in the past (before today)
 */
export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = getTodayDateString();
  return dateStr < today;
}

export interface DateValidationResult {
  isValid: boolean;
  status: 'empty' | 'valid' | 'past' | 'unavailable' | 'buffer';
  message: string;
  conflict?: BlockedDateInfo;
  blockedDates?: string[];
}

/**
 * Comprehensive validation for a booking start date and duration:
 * 1. Checks if empty
 * 2. Checks if date is in the past
 * 3. Checks if any day in the booking range falls on a confirmed event or buffer day
 */
export function validateBookingDate(
  startDateStr: string,
  durationDays: number = 1,
  bookings: Booking[] = [],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): DateValidationResult {
  if (!startDateStr || startDateStr.trim() === '') {
    return {
      isValid: false,
      status: 'empty',
      message: 'Please select your event date.'
    };
  }

  // 1. Check past date
  if (isPastDate(startDateStr)) {
    return {
      isValid: false,
      status: 'past',
      message: 'Past dates cannot be selected. Please choose today or an upcoming date.'
    };
  }

  // 2. Check unavailable / buffer conflict
  const rangeCheck = checkDateRangeBlocked(
    startDateStr,
    durationDays,
    bookings,
    calendarEvents,
    bufferDaysBefore,
    bufferDaysAfter
  );

  if (rangeCheck.isBlocked && rangeCheck.conflict) {
    const isBuffer = rangeCheck.conflict.isBufferDay;
    return {
      isValid: false,
      status: isBuffer ? 'buffer' : 'unavailable',
      message: isBuffer
        ? `Selected date overlaps with mandatory staging/rigging buffer (${rangeCheck.conflict.reason}).`
        : `Selected date is unavailable due to an existing confirmed booking (${rangeCheck.conflict.reason}).`,
      conflict: rangeCheck.conflict
    };
  }

  return {
    isValid: true,
    status: 'valid',
    message: 'Date is available for equipment rigging and dispatch.'
  };
}

