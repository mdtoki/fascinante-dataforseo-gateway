/**
 * 👤 FASCINANTE DIGITAL - OAUTH USER INFO ENDPOINT
 * 
 * Endpoint de información de usuario OAuth 2.0 + OIDC
 * Siguiendo documentación oficial de OpenAI
 */

import { NextRequest } from 'next/server';
import { validateAccessToken } from '@/lib/jwt-oauth';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header in userinfo request');
      return Response.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const user = validateAccessToken(token);
    
    if (!user) {
      logger.warn('Invalid access token in userinfo request');
      return Response.json({ error: 'Invalid access token' }, { status: 401 });
    }
    
    logger.info('User info requested', {
      user_id: user.sub,
      email: user.email
    });
    
    return Response.json({
      sub: user.sub,
      email: user.email,
      name: user.name,
      email_verified: user.email_verified
    });
    
  } catch (error) {
    logger.error('Error in OAuth userinfo endpoint', { error });
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
