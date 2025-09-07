/**
 * 🔐 FASCINANTE DIGITAL - GPT ACTIONS AUTH MIDDLEWARE
 * 
 * Middleware de autenticación para GPT Actions
 * Soporta API Key y OAuth JWT
 */

import { NextRequest } from 'next/server';
import { validateAccessToken } from '@/lib/jwt-oauth';
import { oauthConfig } from '@/lib/oauth-config';
import { logger } from '@/lib/logger';

export interface GPTActionsAuthContext {
  mode: 'api-key' | 'oauth';
  subject: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
}

export async function validateGPTActionsAuth(req: NextRequest): Promise<GPTActionsAuthContext> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    logger.warn('Missing or invalid authorization header in GPT Actions request');
    throw new Error('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);
  
  // Modo 1: API Key (simple)
  if (token === oauthConfig.gptActionsApiKey) {
    logger.info('GPT Actions request authenticated with API Key');
    return {
      mode: 'api-key',
      subject: 'gpt-actions'
    };
  }
  
  // Modo 2: OAuth JWT (avanzado)
  if (token.startsWith('eyJ')) { // JWT token
    const user = validateAccessToken(token);
    if (!user) {
      logger.warn('Invalid OAuth token in GPT Actions request');
      throw new Error('Invalid OAuth token');
    }
    
    logger.info('GPT Actions request authenticated with OAuth', {
      user_id: user.sub,
      email: user.email
    });
    
    return {
      mode: 'oauth',
      subject: user.sub,
      email: user.email,
      name: user.name,
      email_verified: user.email_verified
    };
  }
  
  logger.warn('Invalid token format in GPT Actions request');
  throw new Error('Invalid token format');
}
