/**
 * 🔑 FASCINANTE DIGITAL - OAUTH TOKEN ENDPOINT
 * 
 * Endpoint de intercambio de tokens OAuth 2.0 + OIDC
 * Siguiendo documentación oficial de OpenAI
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateAccessToken, generateRefreshToken, validateRefreshToken } from '@/lib/jwt-oauth';
import { oauthConfig } from '@/lib/oauth-config';
import { logger } from '@/lib/logger';

const tokenRequestSchema = z.object({
  grant_type: z.enum(['authorization_code', 'refresh_token']),
  code: z.string().optional(),
  redirect_uri: z.string().url().optional(),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  code_verifier: z.string().optional(),
  refresh_token: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar parámetros de request
    const params = tokenRequestSchema.parse(body);

    // Validar client credentials
    if (params.client_id !== oauthConfig.clientId || 
        params.client_secret !== oauthConfig.clientSecret) {
      logger.warn('Invalid client credentials in OAuth token request', {
        client_id: params.client_id
      });
      return Response.json({ error: 'Invalid client credentials' }, { status: 401 });
    }

    if (params.grant_type === 'authorization_code') {
      return await handleAuthorizationCodeGrant(params);
    } else if (params.grant_type === 'refresh_token') {
      return await handleRefreshTokenGrant(params);
    } else {
      return Response.json({ error: 'Unsupported grant_type' }, { status: 400 });
    }
    
  } catch (error) {
    logger.error('Error in OAuth token endpoint', { error });
    
    if (error instanceof z.ZodError) {
      return Response.json({ 
        error: 'Invalid request parameters',
        details: error.errors 
      }, { status: 400 });
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleAuthorizationCodeGrant(params: any) {
  const { code, redirect_uri, code_verifier } = params;
  
  if (!code || !redirect_uri || !code_verifier) {
    return Response.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Validar authorization code (en producción usar Redis)
  // TODO: Implementar validación de authorization code
  
  // Validar PKCE code verifier
  // TODO: Implementar validación de PKCE
  
  // Simular usuario (en producción obtener de base de datos)
  const user = {
    id: 'user_12345',
    email: 'usuario@empresa.com',
    name: 'Juan Pérez',
    email_verified: true
  };
  
  // Generar tokens
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user.id);
  
  logger.info('OAuth tokens generated', {
    user_id: user.id,
    grant_type: 'authorization_code'
  });
  
  return Response.json({
    access_token,
    token_type: 'Bearer',
    expires_in: oauthConfig.jwtExpiresIn,
    refresh_token,
    scope: oauthConfig.scopes.join(' ')
  });
}

async function handleRefreshTokenGrant(params: any) {
  const { refresh_token } = params;
  
  if (!refresh_token) {
    return Response.json({ error: 'Missing refresh_token' }, { status: 400 });
  }

  // Validar refresh token
  const payload = validateRefreshToken(refresh_token);
  if (!payload) {
    return Response.json({ error: 'Invalid refresh_token' }, { status: 401 });
  }

  // Simular usuario (en producción obtener de base de datos)
  const user = {
    id: payload.sub,
    email: 'usuario@empresa.com',
    name: 'Juan Pérez',
    email_verified: true
  };
  
  // Generar nuevos tokens
  const access_token = generateAccessToken(user);
  const new_refresh_token = generateRefreshToken(user.id);
  
  logger.info('OAuth tokens refreshed', {
    user_id: user.id,
    grant_type: 'refresh_token'
  });
  
  return Response.json({
    access_token,
    token_type: 'Bearer',
    expires_in: oauthConfig.jwtExpiresIn,
    refresh_token: new_refresh_token,
    scope: oauthConfig.scopes.join(' ')
  });
}
