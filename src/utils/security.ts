/**
 * SBL Events Security & Input Sanitization Suite
 * Provides defensive input sanitization, brute-force lockout protection,
 * rate limiting, and spam protection for client web forms and admin consoles.
 */

// 1. Defend Against XSS & Malicious Injections
export const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') return '';

  return input
    // Strip HTML script, iframe, object, and embed tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip javascript: pseudo-protocol
    .replace(/javascript\s*:/gi, '')
    // Strip inline HTML event handlers (e.g., onload=, onerror=, onclick=)
    .replace(/\bon\w+\s*=/gi, '')
    // Strip HTML tags
    .replace(/<[^>]+>/g, '')
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  const cleaned = sanitizeInput(email).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : '';
};

export const sanitizePhone = (phone: string): string => {
  const cleaned = sanitizeInput(phone);
  // Keep only digits, plus sign, spaces, and hyphens
  return cleaned.replace(/[^\d+ \-]/g, '').slice(0, 20);
};

// 2. Honeypot Anti-Bot Verification
export const isHoneypotTriggered = (honeypotValue?: string): boolean => {
  // Real humans leave honeypot fields empty. Bots typically populate every field.
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
};

// 3. Admin Authentication Brute-Force Rate Limiting & Lockout
const LOGIN_ATTEMPTS_KEY = 'sbl_sec_admin_attempts';
const LOCKOUT_EXPIRY_KEY = 'sbl_sec_admin_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds progressive lockout

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsCount: number;
  maxAttempts: number;
}

export const checkAdminLockoutStatus = (): LockoutStatus => {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_EXPIRY_KEY) || '0', 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        attemptsCount: MAX_ATTEMPTS,
        maxAttempts: MAX_ATTEMPTS,
      };
    }

    const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '0', 10);
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsCount: attempts,
      maxAttempts: MAX_ATTEMPTS,
    };
  } catch {
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsCount: 0,
      maxAttempts: MAX_ATTEMPTS,
    };
  }
};

export const recordFailedLoginAttempt = (): LockoutStatus => {
  try {
    const currentAttempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, currentAttempts.toString());

    if (currentAttempts >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_EXPIRY_KEY, lockoutUntil.toString());
      return {
        isLocked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attemptsCount: currentAttempts,
        maxAttempts: MAX_ATTEMPTS,
      };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsCount: currentAttempts,
      maxAttempts: MAX_ATTEMPTS,
    };
  } catch {
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsCount: 1,
      maxAttempts: MAX_ATTEMPTS,
    };
  }
};

export const resetLoginAttempts = (): void => {
  try {
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_EXPIRY_KEY);
  } catch {
    // Ignore storage issues
  }
};

// 4. Client & Public API Rate Limiting Suite
export interface RateLimitResult {
  allowed: boolean;
  remainingSeconds: number;
  currentCount: number;
  maxRequests: number;
  message?: string;
}

// In-memory fallback if localStorage is disabled/blocked in iframe or private browsing
const memoryRateStore = new Map<string, number[]>();
const memoryPayloadStore = new Map<string, { hash: string; timestamp: number }>();

const getStoredTimestamps = (storageKey: string): number[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((t) => typeof t === 'number');
      }
    }
  } catch {
    // fallback to memory
  }
  return memoryRateStore.get(storageKey) || [];
};

const setStoredTimestamps = (storageKey: string, timestamps: number[]): void => {
  memoryRateStore.set(storageKey, timestamps);
  try {
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
  } catch {
    // Storage full or private mode; in-memory store remains active
  }
};

export const checkRateLimit = (
  key: string,
  maxRequests: number,
  windowSeconds: number,
  consumeToken = false
): RateLimitResult => {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const storageKey = `sbl_ratelimit_${key}`;

  const allTimestamps = getStoredTimestamps(storageKey);
  // Keep only timestamps within the rolling window
  const validTimestamps = allTimestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const expiry = oldest + windowMs;
    const remainingSeconds = Math.max(1, Math.ceil((expiry - now) / 1000));

    return {
      allowed: false,
      remainingSeconds,
      currentCount: validTimestamps.length,
      maxRequests,
      message: `Too many submissions. Please wait ${remainingSeconds} seconds before submitting again.`,
    };
  }

  if (consumeToken) {
    validTimestamps.push(now);
    setStoredTimestamps(storageKey, validTimestamps);
  }

  return {
    allowed: true,
    remainingSeconds: 0,
    currentCount: validTimestamps.length + (consumeToken ? 1 : 0),
    maxRequests,
  };
};

// 5. Duplicate Submission Blocker (Prevents rapid repeated clicks with identical data)
export const isDuplicatePayload = (
  bucket: string,
  payloadString: string,
  minIntervalSeconds = 45
): boolean => {
  const now = Date.now();
  const key = `sbl_dup_${bucket}`;
  const intervalMs = minIntervalSeconds * 1000;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.hash === payloadString && now - parsed.timestamp < intervalMs) {
        return true;
      }
    }
  } catch {
    const mem = memoryPayloadStore.get(key);
    if (mem && mem.hash === payloadString && now - mem.timestamp < intervalMs) {
      return true;
    }
  }

  // Record this payload
  const record = { hash: payloadString, timestamp: now };
  memoryPayloadStore.set(key, record);
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // in-memory only
  }

  return false;
};

// 6. Contact Form Specific Rate Limiting (Max 3 inquiries per 120 seconds)
export const checkContactRateLimit = (consume = false): RateLimitResult => {
  return checkRateLimit('contact_inquiry', 3, 120, consume);
};

export const recordContactSubmission = (): RateLimitResult => {
  return checkRateLimit('contact_inquiry', 3, 120, true);
};

// 7. Public Booking API Rate Limiting (Max 3 bookings per 180 seconds)
export const checkBookingRateLimit = (consume = false): RateLimitResult => {
  return checkRateLimit('public_booking', 3, 180, consume);
};

export const recordBookingSubmission = (): RateLimitResult => {
  return checkRateLimit('public_booking', 3, 180, true);
};

// 8. Callback Request Rate Limiting (Max 3 callback requests per 120 seconds)
export const checkCallbackRateLimit = (consume = false): RateLimitResult => {
  return checkRateLimit('callback_request', 3, 120, consume);
};

export const recordCallbackSubmission = (): RateLimitResult => {
  return checkRateLimit('callback_request', 3, 120, true);
};

