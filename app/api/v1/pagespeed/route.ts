import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { url, strategy = 'desktop', category = 'performance' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `pagespeed:${url}:${strategy}:${category}`;
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for PageSpeed: ${url}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    // Make request to Google PageSpeed Insights API
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google PageSpeed API key not configured' },
        { status: 500 }
      );
    }

    const pagespeedUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    pagespeedUrl.searchParams.set('url', url);
    pagespeedUrl.searchParams.set('strategy', strategy);
    pagespeedUrl.searchParams.set('category', category);
    pagespeedUrl.searchParams.set('key', apiKey);

    const response = await fetch(pagespeedUrl.toString());
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache successful responses for 1 hour
    await cacheService.set(cacheKey, data, 3600);

    // Track analytics
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed',
      method: 'POST',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        url,
        strategy,
        category,
        score: data.lighthouseResult?.categories?.performance?.score,
      },
    });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error('Error in PageSpeed API:', error);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed',
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

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const strategy = request.nextUrl.searchParams.get('strategy') || 'desktop';
  const category = request.nextUrl.searchParams.get('category') || 'performance';

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Convert GET to POST request
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ url, strategy, category }),
  });

  return POST(postRequest);
}
