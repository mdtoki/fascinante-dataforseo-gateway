import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { url, strategy = 'desktop' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `pagespeed-cwv:${url}:${strategy}`;
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Core Web Vitals: ${url}`);
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
    pagespeedUrl.searchParams.set('key', apiKey);

    const response = await fetch(pagespeedUrl.toString());
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract only Core Web Vitals data
    const coreWebVitals = {
      url: data.lighthouseResult?.requestedUrl || url,
      strategy: strategy,
      performance_score: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
      core_web_vitals: {
        lcp: {
          value: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A',
          score: data.lighthouseResult?.audits?.['largest-contentful-paint']?.score || 0,
          status: data.lighthouseResult?.audits?.['largest-contentful-paint']?.score > 0.75 ? 'Good' : 
                  data.lighthouseResult?.audits?.['largest-contentful-paint']?.score > 0.5 ? 'Needs Improvement' : 'Poor'
        },
        fcp: {
          value: data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || 'N/A',
          score: data.lighthouseResult?.audits?.['first-contentful-paint']?.score || 0,
          status: data.lighthouseResult?.audits?.['first-contentful-paint']?.score > 0.9 ? 'Good' : 
                  data.lighthouseResult?.audits?.['first-contentful-paint']?.score > 0.75 ? 'Needs Improvement' : 'Poor'
        },
        cls: {
          value: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A',
          score: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.score || 0,
          status: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.score > 0.9 ? 'Good' : 
                  data.lighthouseResult?.audits?.['cumulative-layout-shift']?.score > 0.75 ? 'Needs Improvement' : 'Poor'
        },
        fid: {
          value: data.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A',
          score: data.lighthouseResult?.audits?.['max-potential-fid']?.score || 0,
          status: data.lighthouseResult?.audits?.['max-potential-fid']?.score > 0.9 ? 'Good' : 
                  data.lighthouseResult?.audits?.['max-potential-fid']?.score > 0.75 ? 'Needs Improvement' : 'Poor'
        }
      },
      recommendations: data.lighthouseResult?.audits ? 
        Object.entries(data.lighthouseResult.audits)
          .filter(([key, audit]: [string, any]) => 
            (key.includes('lcp') || key.includes('fcp') || key.includes('cls') || key.includes('fid')) &&
            audit.score !== null && 
            audit.score < 0.9
          )
          .slice(0, 3) // Only top 3 recommendations
          .map(([key, audit]: [string, any]) => ({
            metric: key,
            title: audit.title,
            description: audit.description,
            score: Math.round((audit.score || 0) * 100)
          })) : []
    };

    // Cache successful responses for 1 hour
    await cacheService.set(cacheKey, coreWebVitals, 3600);

    // Track analytics
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_cwv_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed/core-web-vitals',
      method: 'POST',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        url,
        strategy,
        performance_score: coreWebVitals.performance_score,
      },
    });

    return NextResponse.json(coreWebVitals, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error('Error in Core Web Vitals API:', error);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_cwv_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed/core-web-vitals',
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
    body: JSON.stringify({ url, strategy }),
  });

  return POST(postRequest);
}
