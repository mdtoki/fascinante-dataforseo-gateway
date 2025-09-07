/**
 * 🔑 FASCINANTE DIGITAL - JWT OAUTH UTILITIES
 * 
 * Utilidades para JWT OAuth 2.0 + OIDC
 * Siguiendo estándares RFC 7519 y RFC 7517
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { oauthConfig } from './oauth-config';

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  jti?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  exp: number;
  iat: number;
  jti: string;
}

/**
 * Generar authorization code para OAuth flow
 */
export function generateAuthCode(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generar code verifier para PKCE
 */
export function generateCodeVerifier(): string {
  return crypto.randomBytes(oauthConfig.pkceCodeVerifierLength).toString('base64url');
}

/**
 * Generar code challenge para PKCE
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
}

/**
 * Generar access token JWT
 */
export function generateAccessToken(user: {
  id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
}): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    email_verified: user.email_verified,
    iss: oauthConfig.issuer,
    aud: oauthConfig.audience,
    exp: now + oauthConfig.jwtExpiresIn,
    iat: now,
    jti: crypto.randomUUID()
  };

  return jwt.sign(payload, oauthConfig.jwtPrivateKey, {
    algorithm: oauthConfig.jwtAlgorithm,
    keyid: oauthConfig.jwtKid
  });
}

/**
 * Generar refresh token JWT
 */
export function generateRefreshToken(userId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: RefreshTokenPayload = {
    sub: userId,
    type: 'refresh',
    exp: now + oauthConfig.jwtRefreshExpiresIn,
    iat: now,
    jti: crypto.randomUUID()
  };

  return jwt.sign(payload, oauthConfig.jwtPrivateKey, {
    algorithm: oauthConfig.jwtAlgorithm,
    keyid: oauthConfig.jwtKid
  });
}

/**
 * Validar access token JWT
 */
export function validateAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, oauthConfig.jwtPublicKey, {
      issuer: oauthConfig.issuer,
      audience: oauthConfig.audience,
      algorithms: [oauthConfig.jwtAlgorithm]
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Validar refresh token JWT
 */
export function validateRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, oauthConfig.jwtPublicKey, {
      issuer: oauthConfig.issuer,
      audience: oauthConfig.audience,
      algorithms: [oauthConfig.jwtAlgorithm]
    }) as RefreshTokenPayload;

    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extraer claims del JWT sin validar (para debugging)
 */
export function extractClaims(token: string): any {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return null;
  }
}
