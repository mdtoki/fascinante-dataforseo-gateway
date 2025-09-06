import { NextRequest, NextResponse } from 'next/server';
import { getDataForSEOClient } from '@/lib/dataforseo-client';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now();
  const params = await context.params;
  const path = params.path.join('/');
  const fullPath = `/v3/${path}`;

  try {
    // Get request body
    const body = await request.json();

    // Check cache first
    const cacheKey = cacheService.generateCacheKey(fullPath, body);
    const cachedResponse = await cacheService.getCachedDataForSEOResponse(
      fullPath,
      body
    );

    if (cachedResponse) {
      logger.info(`Cache hit for ${fullPath}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    // Make request to DataForSEO
    const dataForSEOClient = getDataForSEOClient();
    const response = await dataForSEOClient.post(fullPath, body);

    // Cache successful responses
    if (response.status_code === 20000) {
      await cacheService.cacheDataForSEOResponse(
        fullPath,
        body,
        response,
        3600
      ); // 1 hour cache
    }

    // Track analytics
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: fullPath,
      method: 'POST',
      statusCode: 200,
      responseTime,
      cost: response.cost,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        tasksCount: response.tasks_count,
        tasksError: response.tasks_error,
      },
    });

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-DataForSEO-Cost': response.cost.toString(),
      },
    });
  } catch (error: any) {
    logger.error(`Error in ${fullPath}:`, error);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: fullPath,
      method: 'POST',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        error: error.message,
      },
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error.message,
        path: fullPath,
      },
      {
        status: 500,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now();
  const params = await context.params;
  const path = params.path.join('/');
  const fullPath = `/v3/${path}`;

  try {
    // Check cache first
    const cacheKey = cacheService.generateCacheKey(fullPath, {});
    const cachedResponse = await cacheService.getCachedDataForSEOResponse(
      fullPath,
      {}
    );

    if (cachedResponse) {
      logger.info(`Cache hit for ${fullPath}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    // Make request to DataForSEO
    const dataForSEOClient = getDataForSEOClient();
    const response = await dataForSEOClient.get(fullPath);

    // Cache successful responses
    if (response.status_code === 20000) {
      await cacheService.cacheDataForSEOResponse(fullPath, {}, response, 1800); // 30 minutes cache
    }

    // Track analytics
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: fullPath,
      method: 'GET',
      statusCode: 200,
      responseTime,
      cost: response.cost,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
    });

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-DataForSEO-Cost': response.cost.toString(),
      },
    });
  } catch (error: any) {
    logger.error(`Error in ${fullPath}:`, error);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'dataforseo_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: fullPath,
      method: 'GET',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        error: error.message,
      },
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error.message,
        path: fullPath,
      },
      {
        status: 500,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}
