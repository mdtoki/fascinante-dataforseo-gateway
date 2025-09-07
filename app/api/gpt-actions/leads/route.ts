/**
 * 📊 FASCINANTE DIGITAL - GPT ACTIONS LEADS ENDPOINT
 * 
 * Endpoint para crear leads desde GPT Actions
 * Soporta autenticación API Key y OAuth
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateGPTActionsAuth } from '@/lib/auth-gpt-actions';
import { createLeadSchema, leadResponseSchema } from '@/lib/schemas-gpt-actions';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticación
    const auth = await validateGPTActionsAuth(req);
    
    // 2. Validar body
    const body = await req.json();
    const validated = createLeadSchema.parse(body);
    
    // 3. Crear lead
    const lead = await createLead({
      ...validated,
      user_id: auth.subject,
      user_email: auth.email,
      user_name: auth.name,
      auth_mode: auth.mode,
      ip_hash: hashIP(req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'),
      user_agent: req.headers.get('user-agent') || 'unknown'
    });
    
    logger.info('Lead created via GPT Actions', {
      lead_id: lead.id,
      email: lead.email,
      auth_mode: auth.mode,
      user_id: auth.subject
    });
    
    // 4. Retornar response
    const response = leadResponseSchema.parse(lead);
    return Response.json(response, { status: 201 });
    
  } catch (error) {
    logger.error('Error in GPT Actions leads endpoint', { error });
    
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

async function createLead(data: any) {
  // TODO: Implementar persistencia en base de datos
  // Por ahora retornar mock
  return {
    id: crypto.randomUUID(),
    email: data.email,
    consent: data.consent,
    created_at: new Date().toISOString()
  };
}

function hashIP(ip: string): string {
  // TODO: Implementar hashing seguro de IP
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default-salt')).digest('hex');
}
