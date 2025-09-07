/**
 * 📊 FASCINANTE DIGITAL - GPT ACTIONS SCHEMAS
 * 
 * Schemas de validación para GPT Actions
 * Usando Zod para validación de tipos
 */

import { z } from 'zod';

// Schema para crear leads
export const createLeadSchema = z.object({
  email: z.string().email('Invalid email format'),
  source: z.string().default('gpt-actions'),
  consent: z.boolean().refine(val => val === true, {
    message: 'Explicit consent is required'
  }),
  name: z.string().optional(),
  notes: z.string().optional()
});

// Schema para PageSpeed audit
export const pagespeedAuditSchema = z.object({
  url: z.string().url('Invalid URL format'),
  strategy: z.enum(['mobile', 'desktop'], {
    errorMap: () => ({ message: 'Strategy must be mobile or desktop' })
  })
});

// Schema para response de leads
export const leadResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  consent: z.boolean(),
  created_at: z.string().datetime()
});

// Schema para response de PageSpeed
export const pagespeedResponseSchema = z.object({
  performance_score: z.number().min(0).max(100),
  core_web_vitals: z.object({
    lcp: z.number().positive(),
    fcp: z.number().positive(),
    cls: z.number().min(0)
  })
});

export type CreateLeadRequest = z.infer<typeof createLeadSchema>;
export type PagespeedAuditRequest = z.infer<typeof pagespeedAuditSchema>;
export type LeadResponse = z.infer<typeof leadResponseSchema>;
export type PagespeedResponse = z.infer<typeof pagespeedResponseSchema>;
