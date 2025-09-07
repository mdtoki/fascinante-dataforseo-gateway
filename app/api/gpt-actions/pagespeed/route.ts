/**
 * 🚀 FASCINANTE DIGITAL - GPT ACTIONS PAGESPEED ENDPOINT
 * 
 * Endpoint para PageSpeed audit desde GPT Actions
 * Proxy a API existente con autenticación OAuth
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateGPTActionsAuth } from '@/lib/auth-gpt-actions';
import { pagespeedAuditSchema, pagespeedResponseSchema } from '@/lib/schemas-gpt-actions';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticación
    const auth = await validateGPTActionsAuth(req);
    
    // 2. Validar body
    const body = await req.json();
    const validated = pagespeedAuditSchema.parse(body);
    
    // 3. Proxy a API existente
    const response = await fetch(`${process.env.AUDITORIA_BASE_URL}/api/v1/pagespeed/core-web-vitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GATEWAY_INTERNAL_KEY
      },
      body: JSON.stringify(validated)
    });
    
    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 4. Log usage
    logger.info('PageSpeed audit via GPT Actions', {
      url: validated.url,
      strategy: validated.strategy,
      auth_mode: auth.mode,
      user_id: auth.subject,
      response_time: response.headers.get('x-response-time')
    });
    
    // 5. Retornar response
    const responseData = pagespeedResponseSchema.parse(data);
    return Response.json(responseData);
    
  } catch (error) {
    logger.error('Error in GPT Actions PageSpeed endpoint', { error });
    
    if (error instanceof z.ZodError) {
      return Response.json({ 
        error: 'Invalid request data',
        details: error.errors 
      }, { status: 400 });
    }
    
    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('token'))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
