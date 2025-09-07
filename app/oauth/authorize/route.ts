/**
 * 🔐 FASCINANTE DIGITAL - OAUTH AUTHORIZATION ENDPOINT
 * 
 * Endpoint de autorización OAuth 2.0 + OIDC
 * Siguiendo documentación oficial de OpenAI
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateAuthCode } from '@/lib/jwt-oauth';
import { oauthConfig } from '@/lib/oauth-config';
import { logger } from '@/lib/logger';

const authorizeRequestSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().url(),
  scope: z.string().min(1),
  state: z.string().min(1),
  code_challenge: z.string().min(1),
  code_challenge_method: z.enum(['S256']),
  response_type: z.enum(['code']),
  response_mode: z.enum(['query']).optional()
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Validar parámetros de request
    const params = authorizeRequestSchema.parse({
      client_id: searchParams.get('client_id'),
      redirect_uri: searchParams.get('redirect_uri'),
      scope: searchParams.get('scope'),
      state: searchParams.get('state'),
      code_challenge: searchParams.get('code_challenge'),
      code_challenge_method: searchParams.get('code_challenge_method'),
      response_type: searchParams.get('response_type'),
      response_mode: searchParams.get('response_mode')
    });

    // Validar client_id
    if (params.client_id !== oauthConfig.clientId) {
      logger.warn('Invalid client_id in OAuth authorization request', {
        client_id: params.client_id,
        expected: oauthConfig.clientId
      });
      return Response.json({ error: 'Invalid client_id' }, { status: 400 });
    }

    // Validar redirect_uri
    if (params.redirect_uri !== oauthConfig.redirectUri) {
      logger.warn('Invalid redirect_uri in OAuth authorization request', {
        redirect_uri: params.redirect_uri,
        expected: oauthConfig.redirectUri
      });
      return Response.json({ error: 'Invalid redirect_uri' }, { status: 400 });
    }

    // Validar scopes
    const requestedScopes = params.scope.split(' ');
    const validScopes = oauthConfig.scopes;
    const invalidScopes = requestedScopes.filter(scope => !validScopes.includes(scope));
    
    if (invalidScopes.length > 0) {
      logger.warn('Invalid scopes in OAuth authorization request', {
        invalid_scopes: invalidScopes,
        valid_scopes: validScopes
      });
      return Response.json({ error: 'Invalid scope' }, { status: 400 });
    }

    // Generar authorization code
    const authCode = generateAuthCode();
    
    // Almacenar temporalmente (en producción usar Redis)
    // TODO: Implementar almacenamiento temporal de auth codes
    
    logger.info('OAuth authorization code generated', {
      code: authCode,
      client_id: params.client_id,
      scopes: requestedScopes
    });

    // Redirigir a OpenAI con authorization code
    const redirectUrl = new URL(params.redirect_uri);
    redirectUrl.searchParams.set('code', authCode);
    redirectUrl.searchParams.set('state', params.state);
    
    return Response.redirect(redirectUrl.toString());
    
  } catch (error) {
    logger.error('Error in OAuth authorization endpoint', { error });
    
    if (error instanceof z.ZodError) {
      return Response.json({ 
        error: 'Invalid request parameters',
        details: error.errors 
      }, { status: 400 });
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
