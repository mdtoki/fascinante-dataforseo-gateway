/**
 * 🔐 FASCINANTE DIGITAL - OAUTH CONFIGURATION
 * 
 * Configuración OAuth 2.0 + OIDC para GPT Actions
 * Siguiendo documentación oficial de OpenAI
 */

import { z } from 'zod';

export const oauthConfigSchema = z.object({
  issuer: z.string().url(),
  audience: z.string().url(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.string().url(),
  scopes: z.array(z.string()),
  jwtPrivateKey: z.string().min(1),
  jwtPublicKey: z.string().min(1),
  jwtKid: z.string().min(1),
  jwtAlgorithm: z.enum(['RS256', 'RS384', 'RS512']),
  jwtExpiresIn: z.number().positive(),
  jwtRefreshExpiresIn: z.number().positive(),
  pkceCodeChallengeMethod: z.enum(['S256']),
  pkceCodeVerifierLength: z.number().positive(),
  gptActionsApiKey: z.string().min(1),
  gptActionsRateLimit: z.number().positive()
});

export const oauthConfig = oauthConfigSchema.parse({
  issuer: process.env.OAUTH_ISSUER,
  audience: process.env.OAUTH_AUDIENCE,
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  redirectUri: process.env.OAUTH_REDIRECT_URI,
  scopes: process.env.OAUTH_SCOPES?.split(' ') || ['openid', 'email', 'profile'],
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  jwtKid: process.env.JWT_KID,
  jwtAlgorithm: process.env.JWT_ALGORITHM as 'RS256',
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
  jwtRefreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '86400'),
  pkceCodeChallengeMethod: process.env.PKCE_CODE_CHALLENGE_METHOD as 'S256',
  pkceCodeVerifierLength: parseInt(process.env.PKCE_CODE_VERIFIER_LENGTH || '128'),
  gptActionsApiKey: process.env.GPT_ACTIONS_API_KEY,
  gptActionsRateLimit: parseInt(process.env.GPT_ACTIONS_RATE_LIMIT || '100')
});

export type OAuthConfig = z.infer<typeof oauthConfigSchema>;
