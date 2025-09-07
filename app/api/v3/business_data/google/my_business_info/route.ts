import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

/**
 * 🏢 DATAFORSEO GOOGLE MY BUSINESS INFO - FASCINANTE DIGITAL ELITE
 * 
 * Endpoint para obtener información de Google My Business usando DataForSEO
 * Basado en las mejores prácticas de Context7
 */

const DATAFORSEO_BASE_URL = process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com';
const DATAFORSEO_USERNAME = process.env.DATAFORSEO_USERNAME;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const endpoint = `/api/v3/business_data/google/my_business_info`;

  try {
    if (!DATAFORSEO_USERNAME || !DATAFORSEO_PASSWORD) {
      logger.error('DataForSEO credentials not configured');
      return NextResponse.json({ error: 'DataForSEO credentials not configured' }, { status: 500 });
    }

    // Get request body
    let body = await request.json();

    // Convert single object to array for DataForSEO compatibility
    if (!Array.isArray(body)) {
      body = [body];
    }

    // Validate required fields
    for (const task of body) {
      if (!task.keyword) {
        return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
      }
      if (!task.location_name && !task.location_code && !task.location_coordinate) {
        return NextResponse.json({ error: 'location_name, location_code, or location_coordinate is required' }, { status: 400 });
      }
      if (!task.language_name && !task.language_code) {
        return NextResponse.json({ error: 'language_name or language_code is required' }, { status: 400 });
      }
    }

    // Generate cache key
    const cacheKey = cacheService.generateCacheKey(endpoint, body);
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Google My Business Info`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    // Prepare DataForSEO request
    const dataforseoUrl = `${DATAFORSEO_BASE_URL}/v3/business_data/google/my_business_info/task_post`;
    const credentials = Buffer.from(`${DATAFORSEO_USERNAME}:${DATAFORSEO_PASSWORD}`).toString('base64');

    const response = await fetch(dataforseoUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error(`DataForSEO API error:`, data);
      return NextResponse.json({ 
        error: 'DataForSEO API error', 
        details: data 
      }, { status: response.status });
    }

    // Cache successful response for 1 hour
    await cacheService.set(cacheKey, data, 3600);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_my_business_info_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'POST',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        tasksCount: body.length,
        cost: data.cost || 0,
        statusCode: data.status_code,
      },
    });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
        'X-DataForSEO-Cost': data.cost?.toString() || '0',
      },
    });

  } catch (error: any) {
    logger.error(`Error in Google My Business Info endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_my_business_info_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'POST',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('task_id');
  const endpoint = `/api/v3/business_data/google/my_business_info`;

  try {
    if (!taskId) {
      return NextResponse.json({ error: 'task_id parameter is required' }, { status: 400 });
    }

    if (!DATAFORSEO_USERNAME || !DATAFORSEO_PASSWORD) {
      logger.error('DataForSEO credentials not configured');
      return NextResponse.json({ error: 'DataForSEO credentials not configured' }, { status: 500 });
    }

    // Generate cache key
    const cacheKey = cacheService.generateCacheKey(endpoint, { task_id: taskId });
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Google My Business Info task: ${taskId}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    // Get task results from DataForSEO
    const dataforseoUrl = `${DATAFORSEO_BASE_URL}/v3/business_data/google/my_business_info/task_get/${taskId}`;
    const credentials = Buffer.from(`${DATAFORSEO_USERNAME}:${DATAFORSEO_PASSWORD}`).toString('base64');

    const response = await fetch(dataforseoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error(`DataForSEO API error for task ${taskId}:`, data);
      return NextResponse.json({ 
        error: 'DataForSEO API error', 
        details: data 
      }, { status: response.status });
    }

    // Cache successful response for 30 minutes
    await cacheService.set(cacheKey, data, 1800);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_my_business_info_get_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'GET',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        taskId,
        statusCode: data.status_code,
      },
    });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Google My Business Info GET endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_my_business_info_get_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'GET',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        taskId,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
