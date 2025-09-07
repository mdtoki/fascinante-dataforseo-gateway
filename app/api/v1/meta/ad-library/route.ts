import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

/**
 * 📚 META AD LIBRARY API - FASCINANTE DIGITAL ELITE
 * 
 * Endpoint para acceso a Meta Ad Library
 * Búsqueda de anuncios, análisis de competencia
 */

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'search';
  const searchTerms = searchParams.get('search_terms');
  const adReachedCountries = searchParams.get('ad_reached_countries') || 'US';
  const adActiveStatus = searchParams.get('ad_active_status') || 'ALL';
  const adType = searchParams.get('ad_type') || 'ALL';
  const publisherPlatform = searchParams.get('publisher_platform') || 'ALL';
  const mediaType = searchParams.get('media_type') || 'ALL';
  const limit = searchParams.get('limit') || '25';

  const endpoint = `/api/v1/meta/ad-library`;

  try {
    if (!META_ACCESS_TOKEN) {
      logger.error('Meta access token not configured');
      return NextResponse.json({ error: 'Meta access token not configured' }, { status: 500 });
    }

    const cacheKey = cacheService.generateCacheKey(endpoint, { 
      action, searchTerms, adReachedCountries, adActiveStatus, adType, publisherPlatform, mediaType, limit 
    });
    const cachedResponse = await cacheService.getCachedResponse(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Meta Ad Library: ${action}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    let result;

    switch (action) {
      case 'search':
        if (!searchTerms) {
          return NextResponse.json({ error: 'search_terms is required for search action' }, { status: 400 });
        }
        result = await searchAds(searchTerms, {
          adReachedCountries,
          adActiveStatus,
          adType,
          publisherPlatform,
          mediaType,
          limit
        });
        break;
      case 'ad_details':
        const adId = searchParams.get('ad_id');
        if (!adId) {
          return NextResponse.json({ error: 'ad_id is required for ad_details action' }, { status: 400 });
        }
        result = await getAdDetails(adId);
        break;
      case 'page_ads':
        const pageId = searchParams.get('page_id');
        if (!pageId) {
          return NextResponse.json({ error: 'page_id is required for page_ads action' }, { status: 400 });
        }
        result = await getPageAds(pageId, {
          adReachedCountries,
          adActiveStatus,
          adType,
          publisherPlatform,
          mediaType,
          limit
        });
        break;
      case 'topics':
        result = await getTopics();
        break;
      case 'regions':
        result = await getRegions();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action. Use: search, ad_details, page_ads, topics, regions' }, { status: 400 });
    }

    await cacheService.cacheResponse(cacheKey, result, 3600); // 1 hour cache

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_ad_library_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'GET',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        action,
        searchTerms,
        adReachedCountries,
        adActiveStatus,
        adType,
        publisherPlatform,
        mediaType,
        limit,
      },
    });

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Meta Ad Library endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_ad_library_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'GET',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        action,
        searchTerms,
        adReachedCountries,
        adActiveStatus,
        adType,
        publisherPlatform,
        mediaType,
        limit,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

/**
 * Buscar anuncios en Ad Library
 */
async function searchAds(searchTerms: string, options: any) {
  const url = `${META_GRAPH_API_URL}/ads_archive`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    search_terms: searchTerms,
    ad_reached_countries: options.adReachedCountries,
    ad_active_status: options.adActiveStatus,
    ad_type: options.adType,
    publisher_platform: options.publisherPlatform,
    media_type: options.mediaType,
    limit: options.limit,
    fields: 'id,ad_creation_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,byline,currency,estimated_audience_size,impressions,page_id,page_name,publisher_platforms,region_distribution,spend'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    ads: data,
    search_terms: searchTerms,
    filters: options,
    message: 'Ads search completed successfully'
  };
}

/**
 * Obtener detalles de un anuncio específico
 */
async function getAdDetails(adId: string) {
  const url = `${META_GRAPH_API_URL}/ads_archive`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    ad_ids: adId,
    fields: 'id,ad_creation_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,byline,currency,estimated_audience_size,impressions,page_id,page_name,publisher_platforms,region_distribution,spend,demographic_distribution'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    ad_details: data,
    message: 'Ad details retrieved successfully'
  };
}

/**
 * Obtener anuncios de una página específica
 */
async function getPageAds(pageId: string, options: any) {
  const url = `${META_GRAPH_API_URL}/ads_archive`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    search_page_ids: pageId,
    ad_reached_countries: options.adReachedCountries,
    ad_active_status: options.adActiveStatus,
    ad_type: options.adType,
    publisher_platform: options.publisherPlatform,
    media_type: options.mediaType,
    limit: options.limit,
    fields: 'id,ad_creation_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,byline,currency,estimated_audience_size,impressions,page_id,page_name,publisher_platforms,region_distribution,spend'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    page_ads: data,
    page_id: pageId,
    filters: options,
    message: 'Page ads retrieved successfully'
  };
}

/**
 * Obtener temas disponibles
 */
async function getTopics() {
  const url = `${META_GRAPH_API_URL}/ads_archive_topics`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    topics: data,
    message: 'Topics retrieved successfully'
  };
}

/**
 * Obtener regiones disponibles
 */
async function getRegions() {
  const url = `${META_GRAPH_API_URL}/ads_archive_regions`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    regions: data,
    message: 'Regions retrieved successfully'
  };
}
