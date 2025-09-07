/**
 * 🧪 FASCINANTE DIGITAL - GPT ACTIONS TESTS
 * 
 * Tests para endpoints GPT Actions
 * Usando Vitest para testing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/gpt-actions/leads/route';
import { POST as pagespeedPOST } from '@/app/api/gpt-actions/pagespeed/route';

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock de fetch
global.fetch = vi.fn();

describe('GPT Actions Endpoints', () => {
  beforeEach(() => {
    // Setup test environment
    process.env.GPT_ACTIONS_API_KEY = 'test-api-key';
    process.env.AUDITORIA_BASE_URL = 'https://auditoria.fascinantedigital.com';
    process.env.GATEWAY_INTERNAL_KEY = 'test-internal-key';
    process.env.IP_SALT = 'test-salt';
    
    // Reset mocks
    vi.clearAllMocks();
  });

  describe('POST /api/gpt-actions/leads', () => {
    it('should create lead with valid API key', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true,
          name: 'Test User'
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.email).toBe('test@example.com');
      expect(data.consent).toBe(true);
      expect(data.id).toBeDefined();
      expect(data.created_at).toBeDefined();
    });

    it('should create lead with OAuth JWT token', async () => {
      // Mock JWT token
      const mockJWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2F1ZGl0b3JpYS5mYXNjaW5hbnRlZGlnaXRhbC5jb20iLCJhdWQiOiJodHRwczovL2F1ZGl0b3JpYS5mYXNjaW5hbnRlZGlnaXRhbC5jb20iLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY0MDk5NTIwMCwianRpIjoiMTIzNDU2Nzg5MCJ9.signature';
      
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true,
          name: 'Test User'
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.email).toBe('test@example.com');
      expect(data.consent).toBe(true);
    });

    it('should reject request without authorization', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject request with invalid API key', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject request without consent', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          consent: false
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('should reject request with invalid email', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'invalid-email',
          consent: true
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('should reject request with missing required fields', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/leads', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          consent: true
          // Missing email
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });
  });

  describe('POST /api/gpt-actions/pagespeed', () => {
    it('should run PageSpeed audit with valid request', async () => {
      // Mock successful response from upstream API
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          performance_score: 85,
          core_web_vitals: {
            lcp: 2.5,
            fcp: 1.2,
            cls: 0.1
          }
        }),
        headers: {
          get: (name: string) => name === 'x-response-time' ? '2.5' : null
        }
      });

      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'desktop'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.performance_score).toBe(85);
      expect(data.core_web_vitals.lcp).toBe(2.5);
      expect(data.core_web_vitals.fcp).toBe(1.2);
      expect(data.core_web_vitals.cls).toBe(0.1);
    });

    it('should run PageSpeed audit with mobile strategy', async () => {
      // Mock successful response from upstream API
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          performance_score: 75,
          core_web_vitals: {
            lcp: 3.2,
            fcp: 1.8,
            cls: 0.2
          }
        }),
        headers: {
          get: (name: string) => name === 'x-response-time' ? '3.2' : null
        }
      });

      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'mobile'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.performance_score).toBe(75);
      expect(data.core_web_vitals.lcp).toBe(3.2);
    });

    it('should reject request without authorization', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'desktop'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject request with invalid URL', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'invalid-url',
          strategy: 'desktop'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('should reject request with invalid strategy', async () => {
      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'invalid-strategy'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('should handle upstream API error', async () => {
      // Mock error response from upstream API
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'desktop'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    it('should handle network error', async () => {
      // Mock network error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const request = new Request('http://localhost:3000/api/gpt-actions/pagespeed', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://www.example.com',
          strategy: 'desktop'
        })
      });

      const response = await pagespeedPOST(request);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });
  });
});
