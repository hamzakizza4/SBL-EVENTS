import { Booking, CalendarEvent } from '../types';
import { getDatesBetween, addDaysToDateString } from './bookingDateUtils';

export interface BookingConflictDetails {
  hasConflict: boolean;
  severity: 'critical' | 'warning' | 'none';
  conflictType: 
    | 'confirmed_reservation' 
    | 'calendar_event' 
    | 'buffer_collision' 
    | 'contested_pending' 
    | 'none';
  badgeText: string;
  summary: string;
  conflictingTitle: string;
  conflictingClient: string;
  conflictingRef: string;
  conflictingDates: string;
  conflictingStatus?: string;
  conflictingSource: 'booking' | 'calendar' | 'pending';
  overlappingDates: string[];
  overlapCount: number;
  recommendation: string;
}

/**
 * Validate a specific booking against all existing reservations in the system & calendar.
 */
export function validateBookingOverlap(
  booking: Booking,
  allBookings: Booking[],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): BookingConflictDetails {
  const noConflict: BookingConflictDetails = {
    hasConflict: false,
    severity: 'none',
    conflictType: 'none',
    badgeText: 'Available',
    summary: 'No schedule conflicts detected in calendar.',
    conflictingTitle: '',
    conflictingClient: '',
    conflictingRef: '',
    conflictingDates: '',
    conflictingSource: 'booking',
    overlappingDates: [],
    overlapCount: 0,
    recommendation: 'Dates are clear for equipment dispatch and confirmed reservations.'
  };

  if (!booking.eventDate) return noConflict;

  // Calculate booking dates range
  const bookingStart = booking.eventDate;
  const bookingDuration = Math.max(1, booking.durationDays || 1);
  const bookingEnd = booking.endDate || addDaysToDateString(bookingStart, bookingDuration - 1);
  const requestedDates = getDatesBetween(bookingStart, bookingEnd);
  const requestedDatesSet = new Set(requestedDates);

  // 1. Check against OTHER confirmed / completed bookings (Critical direct collision)
  for (const other of allBookings) {
    if (other.id === booking.id) continue;
    if (other.status !== 'confirmed' && other.status !== 'completed') continue;
    if (!other.eventDate) continue;

    const otherStart = other.eventDate;
    const otherDuration = Math.max(1, other.durationDays || 1);
    const otherEnd = other.endDate || addDaysToDateString(otherStart, otherDuration - 1);
    const otherDates = getDatesBetween(otherStart, otherEnd);

    const commonDates = otherDates.filter((d) => requestedDatesSet.has(d));
    if (commonDates.length > 0) {
      return {
        hasConflict: true,
        severity: 'critical',
        conflictType: 'confirmed_reservation',
        badgeText: 'Calendar Overlap',
        summary: `Clashes with Confirmed Reservation #${other.referenceNumber} (${other.clientName})`,
        conflictingTitle: `${other.eventType.toUpperCase()} Event`,
        conflictingClient: other.clientName,
        conflictingRef: other.referenceNumber,
        conflictingDates: `${otherStart}${otherEnd !== otherStart ? ` to ${otherEnd}` : ''}`,
        conflictingStatus: other.status,
        conflictingSource: 'booking',
        overlappingDates: commonDates,
        overlapCount: commonDates.length,
        recommendation: `Action Required: Contact ${other.clientName} or ${booking.clientName} to offer alternate dates or split equipment inventory.`
      };
    }
  }

  // 2. Check against Booked Calendar Events (Critical direct collision)
  for (const evt of calendarEvents) {
    if (evt.status !== 'booked') continue;
    // Skip if it's the exact same linked booking
    if (evt.relatedBookingId && evt.relatedBookingId === booking.id) continue;
    if (booking.referenceNumber && evt.title.includes(booking.referenceNumber)) continue;
    if (!evt.startDate) continue;

    const evtStart = evt.startDate;
    const evtEnd = evt.endDate || evt.startDate;
    const evtDates = getDatesBetween(evtStart, evtEnd);

    const commonDates = evtDates.filter((d) => requestedDatesSet.has(d));
    if (commonDates.length > 0) {
      return {
        hasConflict: true,
        severity: 'critical',
        conflictType: 'calendar_event',
        badgeText: 'Calendar Overlap',
        summary: `Direct Clash with Calendar Reservation: "${evt.title}" (${evt.clientName || 'Reserved'})`,
        conflictingTitle: evt.title,
        conflictingClient: evt.clientName || 'Calendar Reserved',
        conflictingRef: evt.id,
        conflictingDates: `${evtStart}${evtEnd !== evtStart ? ` to ${evtEnd}` : ''}`,
        conflictingStatus: 'booked',
        conflictingSource: 'calendar',
        overlappingDates: commonDates,
        overlapCount: commonDates.length,
        recommendation: `Calendar clash detected on ${commonDates.join(', ')}. Coordinate with event coordinator before confirming.`
      };
    }
  }

  // 3. Check against Pre-Event & Post-Event Setup/Rigging Buffers (Warning)
  // Check if requestedDates fall into buffer of any confirmed booking or calendar event
  for (const other of allBookings) {
    if (other.id === booking.id) continue;
    if (other.status !== 'confirmed' && other.status !== 'completed') continue;
    if (!other.eventDate) continue;

    const otherStart = other.eventDate;
    const otherDuration = Math.max(1, other.durationDays || 1);
    const otherEnd = other.endDate || addDaysToDateString(otherStart, otherDuration - 1);

    // Buffer dates before other event
    const bufferBeforeDates: string[] = [];
    for (let i = 1; i <= bufferDaysBefore; i++) {
      bufferBeforeDates.push(addDaysToDateString(otherStart, -i));
    }
    // Buffer dates after other event
    const bufferAfterDates: string[] = [];
    for (let i = 1; i <= bufferDaysAfter; i++) {
      bufferAfterDates.push(addDaysToDateString(otherEnd, i));
    }

    const bufferClashDates = [...bufferBeforeDates, ...bufferAfterDates].filter((d) =>
      requestedDatesSet.has(d)
    );

    if (bufferClashDates.length > 0) {
      return {
        hasConflict: true,
        severity: 'warning',
        conflictType: 'buffer_collision',
        badgeText: 'Buffer Conflict',
        summary: `Falls within ${bufferDaysBefore}-day setup/rigging buffer for #${other.referenceNumber} (${other.clientName})`,
        conflictingTitle: `Rigging/Logistics Buffer for #${other.referenceNumber}`,
        conflictingClient: other.clientName,
        conflictingRef: other.referenceNumber,
        conflictingDates: `Event starts ${otherStart} (Setup: ${bufferBeforeDates[bufferBeforeDates.length - 1] || otherStart} - ${bufferBeforeDates[0] || otherStart})`,
        conflictingStatus: 'buffer_active',
        conflictingSource: 'booking',
        overlappingDates: bufferClashDates,
        overlapCount: bufferClashDates.length,
        recommendation: `Logistics Notice: Trucks and staging riggers will be on-site preparing #${other.referenceNumber}. Ensure secondary rigging crew and fleet availability.`
      };
    }
  }

  // 4. Check for Contested Pending Requests (Other pending clients requesting same date)
  if (booking.status === 'pending') {
    for (const other of allBookings) {
      if (other.id === booking.id) continue;
      if (other.status !== 'pending') continue;
      if (!other.eventDate) continue;

      const otherStart = other.eventDate;
      const otherDuration = Math.max(1, other.durationDays || 1);
      const otherEnd = other.endDate || addDaysToDateString(otherStart, otherDuration - 1);
      const otherDates = getDatesBetween(otherStart, otherEnd);

      const commonDates = otherDates.filter((d) => requestedDatesSet.has(d));
      if (commonDates.length > 0) {
        return {
          hasConflict: true,
          severity: 'warning',
          conflictType: 'contested_pending',
          badgeText: 'Contested Date',
          summary: `Another pending request #${other.referenceNumber} (${other.clientName}) is competing for this date`,
          conflictingTitle: `Pending Request #${other.referenceNumber}`,
          conflictingClient: other.clientName,
          conflictingRef: other.referenceNumber,
          conflictingDates: `${otherStart}${otherEnd !== otherStart ? ` to ${otherEnd}` : ''}`,
          conflictingStatus: 'pending',
          conflictingSource: 'pending',
          overlappingDates: commonDates,
          overlapCount: commonDates.length,
          recommendation: `Two clients requested the same date. First client to pay deposit secures reservation.`
        };
      }
    }
  }

  return noConflict;
}

/**
 * Builds a fast lookup map of conflict details for all bookings.
 */
export function buildAllBookingConflictsMap(
  bookings: Booking[],
  calendarEvents: CalendarEvent[] = [],
  bufferDaysBefore: number = 2,
  bufferDaysAfter: number = 0
): Map<string, BookingConflictDetails> {
  const map = new Map<string, BookingConflictDetails>();
  for (const b of bookings) {
    map.set(
      b.id,
      validateBookingOverlap(b, bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter)
    );
  }
  return map;
}
