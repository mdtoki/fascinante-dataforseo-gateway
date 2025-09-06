import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Fascinante Digital - DataForSEO API Gateway',
      description: 'API Gateway PRO ELITE para DataForSEO con Next.js 15. Acceso escalable y seguro a herramientas de SEO y análisis de datos.',
      version: '1.0.0',
      contact: {
        name: 'Fascinante Digital',
        email: 'info@fascinantedigital.com',
        url: 'https://fascinantedigital.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://auditoria.fascinantedigital.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
      {
        ApiKeyAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            code: {
              type: 'string',
              description: 'Error code',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
        RateLimitError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Rate limit exceeded',
            },
            retryAfter: {
              type: 'number',
              description: 'Seconds to wait before retrying',
            },
          },
        },
      },
    },
    paths: {
      '/v3/serp/{search_engine}/organic/live/advanced': {
        post: {
          summary: 'Get organic search results',
          description: 'Obtiene resultados de búsqueda orgánica para una palabra clave en el motor de búsqueda especificado',
          parameters: [
            {
              name: 'search_engine',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['google', 'bing', 'yahoo'],
              },
              description: 'Motor de búsqueda',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    location_name: {
                      type: 'string',
                      default: 'United States',
                      description: 'Nombre completo de la ubicación',
                    },
                    depth: {
                      type: 'number',
                      minimum: 10,
                      maximum: 700,
                      default: 10,
                      description: 'Profundidad de análisis',
                    },
                    language_code: {
                      type: 'string',
                      description: 'Código de idioma del motor de búsqueda',
                    },
                    keyword: {
                      type: 'string',
                      description: 'Palabra clave de búsqueda',
                    },
                    device: {
                      type: 'string',
                      default: 'desktop',
                      enum: ['desktop', 'mobile'],
                      description: 'Tipo de dispositivo',
                    },
                  },
                  required: ['language_code', 'keyword'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Respuesta exitosa',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      cost: { type: 'number' },
                      status_code: { type: 'number' },
                      status_message: { type: 'string' },
                      tasks: { type: 'array' },
                    },
                  },
                },
              },
            },
            '429': {
              description: 'Rate limit exceeded',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RateLimitError',
                  },
                },
              },
            },
          },
        },
      },
      '/v3/ai_optimization/chat_gpt/llm_responses/live': {
        post: {
          summary: 'Generate AI content',
          description: 'Genera contenido usando modelos de IA como ChatGPT, Claude, Gemini, etc.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      user_prompt: {
                        type: 'string',
                        description: 'Prompt del usuario',
                      },
                      model_name: {
                        type: 'string',
                        default: 'gpt-4o-mini',
                        description: 'Nombre del modelo de IA',
                      },
                      max_output_tokens: {
                        type: 'number',
                        default: 1000,
                        description: 'Máximo número de tokens de salida',
                      },
                      temperature: {
                        type: 'number',
                        default: 0.3,
                        description: 'Temperatura para la generación',
                      },
                      web_search: {
                        type: 'boolean',
                        default: true,
                        description: 'Habilitar búsqueda web',
                      },
                    },
                    required: ['user_prompt'],
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Contenido generado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      cost: { type: 'number' },
                      status_code: { type: 'number' },
                      tasks: { type: 'array' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/v3/keywords_data/google_ads/search_volume/live': {
        post: {
          summary: 'Get keyword search volume',
          description: 'Obtiene datos de volumen de búsqueda para palabras clave desde Google Ads',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    keywords: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Array de palabras clave',
                    },
                    location_name: {
                      type: 'string',
                      default: 'United States',
                      description: 'Ubicación',
                    },
                    language_code: {
                      type: 'string',
                      default: 'en',
                      description: 'Código de idioma',
                    },
                  },
                  required: ['keywords'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Datos de volumen obtenidos exitosamente',
            },
          },
        },
      },
      '/v3/dataforseo_labs/google/keyword_ideas/live': {
        post: {
          summary: 'Get keyword ideas',
          description: 'Obtiene ideas de palabras clave relevantes para las categorías de productos o servicios especificadas',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    keywords: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Palabras clave objetivo',
                    },
                    location_name: {
                      type: 'string',
                      default: 'United States',
                    },
                    language_code: {
                      type: 'string',
                      default: 'en',
                    },
                    limit: {
                      type: 'number',
                      default: 100,
                      maximum: 1000,
                      description: 'Número máximo de palabras clave a devolver',
                    },
                  },
                  required: ['keywords'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Ideas de palabras clave obtenidas exitosamente',
            },
          },
        },
      },
      '/v3/backlinks/summary/live': {
        post: {
          summary: 'Get backlinks summary',
          description: 'Obtiene un resumen de datos de backlinks disponibles para un dominio, subdominio o página web',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    target: {
                      type: 'string',
                      description: 'Dominio, subdominio o página web',
                    },
                    include_subdomains: {
                      type: 'boolean',
                      default: true,
                      description: 'Incluir enlaces indirectos',
                    },
                  },
                  required: ['target'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Resumen de backlinks obtenido exitosamente',
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
