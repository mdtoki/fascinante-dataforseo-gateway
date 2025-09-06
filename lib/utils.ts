import { NextRequest } from 'next/server';

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  if (realIP) {
    return realIP;
  }

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  return 'unknown';
}
