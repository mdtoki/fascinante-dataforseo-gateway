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
    const cacheKey = `pagespeed-summary:${url}:${strategy}`;
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for PageSpeed Summary: ${url}`);
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

    // Extract only essential data for ChatGPT
    const summary = {
      url: data.lighthouseResult?.requestedUrl || url,
      strategy: strategy,
      scores: {
        performance: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
        accessibility: Math.round((data.lighthouseResult?.categories?.accessibility?.score || 0) * 100),
        best_practices: Math.round((data.lighthouseResult?.categories?.['best-practices']?.score || 0) * 100),
        seo: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100)
      },
      core_web_vitals: {
        lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A',
        fcp: data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || 'N/A',
        cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A',
        fid: data.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A'
      },
      opportunities: data.lighthouseResult?.audits ? 
        Object.entries(data.lighthouseResult.audits)
          .filter(([key, audit]: [string, any]) => 
            audit.details?.type === 'opportunity' && 
            audit.score !== null && 
            audit.score < 0.9
          )
          .slice(0, 5) // Only top 5 opportunities
          .map(([key, audit]: [string, any]) => ({
            title: audit.title,
            description: audit.description,
            score: Math.round((audit.score || 0) * 100),
            savings: audit.details?.overallSavingsMs || 0
          })) : [],
      diagnostics: data.lighthouseResult?.audits ?
        Object.entries(data.lighthouseResult.audits)
          .filter(([key, audit]: [string, any]) => 
            audit.details?.type === 'diagnostic' && 
            audit.score !== null && 
            audit.score < 0.9
          )
          .slice(0, 3) // Only top 3 diagnostics
          .map(([key, audit]: [string, any]) => ({
            title: audit.title,
            description: audit.description,
            score: Math.round((audit.score || 0) * 100)
          })) : []
    };

    // Cache successful responses for 1 hour
    await cacheService.set(cacheKey, summary, 3600);

    // Track analytics
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_summary_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed/summary',
      method: 'POST',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        url,
        strategy,
        performance_score: summary.scores.performance,
      },
    });

    return NextResponse.json(summary, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error('Error in PageSpeed Summary API:', error);

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'pagespeed_summary_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: '/api/v1/pagespeed/summary',
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
