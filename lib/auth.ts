import jwt from 'jsonwebtoken';
import { logger } from './logger';

export interface JWTPayload {
  sub: string;
  type: 'api_key' | 'user';
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthResult {
  authenticated: boolean;
  userId?: string;
  message?: string;
}

export class AuthService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret';
  }

  /**
   * Generate JWT token for API access
   */
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
    try {
      const payload = jwt.verify(token, this.secret) as JWTPayload;
      return {
        valid: true,
        payload,
      };
    } catch (error: any) {
      logger.warn('JWT verification failed:', error.message);
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractToken(authHeader: string | null): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Validate API key (simple implementation)
   */
  validateApiKey(apiKey: string): boolean {
    const validApiKeys = [
      process.env.API_GATEWAY_SECRET,
      // Add more API keys as needed
    ].filter(Boolean);

    return validApiKeys.includes(apiKey);
  }

  /**
   * Check if user has required permission
   */
  hasPermission(payload: JWTPayload, permission: string): boolean {
    return payload.permissions.includes(permission) || payload.permissions.includes('*');
  }
}

export const authService = new AuthService();

/**
 * Authenticate request using API key or JWT token
 */
export async function authenticateRequest(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');

  // Try API key first
  if (apiKey && authService.validateApiKey(apiKey)) {
    return {
      authenticated: true,
      userId: 'api-key-user',
    };
  }

  // Try JWT token
  if (authHeader) {
    const token = authService.extractToken(authHeader);
    if (token) {
      const result = authService.verifyToken(token);
      if (result.valid && result.payload) {
        return {
          authenticated: true,
          userId: result.payload.sub,
        };
      }
    }
  }

  return {
    authenticated: false,
    message: 'Invalid or missing authentication credentials',
  };
}