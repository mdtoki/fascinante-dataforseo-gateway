import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

/**
 * 📊 META MARKETING API - FASCINANTE DIGITAL ELITE
 * 
 * Endpoint para gestión de Meta Marketing API
 * Campañas, anuncios, audiencias y métricas
 */

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'campaigns';
  const adAccountId = searchParams.get('ad_account_id') || process.env.META_AD_ACCOUNT_ID;
  const campaignId = searchParams.get('campaign_id');
  const adSetId = searchParams.get('adset_id');
  const adId = searchParams.get('ad_id');

  const endpoint = `/api/v1/meta/marketing-api`;

  try {
    if (!META_ACCESS_TOKEN) {
      logger.error('Meta access token not configured');
      return NextResponse.json({ error: 'Meta access token not configured' }, { status: 500 });
    }

    const cacheKey = cacheService.generateCacheKey(endpoint, { action, adAccountId, campaignId, adSetId, adId });
    const cachedResponse = await cacheService.getCachedResponse(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Meta Marketing API: ${action}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    let result;

    switch (action) {
      case 'campaigns':
        if (!adAccountId) {
          return NextResponse.json({ error: 'ad_account_id is required for campaigns action' }, { status: 400 });
        }
        result = await getCampaigns(adAccountId);
        break;
      case 'adsets':
        if (!adAccountId) {
          return NextResponse.json({ error: 'ad_account_id is required for adsets action' }, { status: 400 });
        }
        result = await getAdSets(adAccountId);
        break;
      case 'ads':
        if (!adAccountId) {
          return NextResponse.json({ error: 'ad_account_id is required for ads action' }, { status: 400 });
        }
        result = await getAds(adAccountId);
        break;
      case 'insights':
        if (!campaignId && !adSetId && !adId) {
          return NextResponse.json({ error: 'campaign_id, adset_id, or ad_id is required for insights action' }, { status: 400 });
        }
        result = await getInsights(campaignId, adSetId, adId);
        break;
      case 'audiences':
        if (!adAccountId) {
          return NextResponse.json({ error: 'ad_account_id is required for audiences action' }, { status: 400 });
        }
        result = await getAudiences(adAccountId);
        break;
      case 'creative_assets':
        if (!adAccountId) {
          return NextResponse.json({ error: 'ad_account_id is required for creative_assets action' }, { status: 400 });
        }
        result = await getCreativeAssets(adAccountId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action. Use: campaigns, adsets, ads, insights, audiences, creative_assets' }, { status: 400 });
    }

    await cacheService.cacheResponse(cacheKey, result, 900); // 15 minutes cache

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_marketing_api_request',
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
        adAccountId,
        campaignId,
        adSetId,
        adId,
      },
    });

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Meta Marketing API endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_marketing_api_error',
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
        adAccountId,
        campaignId,
        adSetId,
        adId,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const body = await request.json();
  const { action, adAccountId, data } = body;

  const endpoint = `/api/v1/meta/marketing-api`;

  try {
    let result;

    switch (action) {
      case 'create_campaign':
        if (!adAccountId || !data) {
          return NextResponse.json({ error: 'adAccountId and data are required' }, { status: 400 });
        }
        result = await createCampaign(adAccountId, data);
        break;
      case 'create_adset':
        if (!adAccountId || !data) {
          return NextResponse.json({ error: 'adAccountId and data are required' }, { status: 400 });
        }
        result = await createAdSet(adAccountId, data);
        break;
      case 'create_ad':
        if (!adAccountId || !data) {
          return NextResponse.json({ error: 'adAccountId and data are required' }, { status: 400 });
        }
        result = await createAd(adAccountId, data);
        break;
      case 'create_audience':
        if (!adAccountId || !data) {
          return NextResponse.json({ error: 'adAccountId and data are required' }, { status: 400 });
        }
        result = await createAudience(adAccountId, data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action. Use: create_campaign, create_adset, create_ad, create_audience' }, { status: 400 });
    }

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_marketing_api_post_request',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'POST',
      statusCode: 200,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        action,
        adAccountId,
      },
    });

    return NextResponse.json(result, {
      headers: {
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Meta Marketing API POST endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_marketing_api_post_error',
      userId: request.headers.get('x-user-id') || 'anonymous',
      apiKey: request.headers.get('x-api-key') || undefined,
      endpoint: endpoint,
      method: 'POST',
      statusCode: 500,
      responseTime,
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request),
      metadata: {
        action,
        adAccountId,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

/**
 * Obtener campañas
 */
async function getCampaigns(adAccountId: string) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/campaigns`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,status,objective,created_time,updated_time,start_time,end_time,daily_budget,lifetime_budget,effective_status'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    campaigns: data,
    message: 'Campaigns retrieved successfully'
  };
}

/**
 * Obtener conjuntos de anuncios
 */
async function getAdSets(adAccountId: string) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/adsets`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,status,campaign_id,created_time,updated_time,start_time,end_time,daily_budget,lifetime_budget,optimization_goal,targeting'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    adsets: data,
    message: 'Ad sets retrieved successfully'
  };
}

/**
 * Obtener anuncios
 */
async function getAds(adAccountId: string) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/ads`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,status,adset_id,campaign_id,created_time,updated_time,creative'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    ads: data,
    message: 'Ads retrieved successfully'
  };
}

/**
 * Obtener insights
 */
async function getInsights(campaignId?: string, adSetId?: string, adId?: string) {
  const id = campaignId || adSetId || adId;
  const url = `${META_GRAPH_API_URL}/${id}/insights`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,cpp,actions,conversions',
    date_preset: 'last_30d'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    insights: data,
    message: 'Insights retrieved successfully'
  };
}

/**
 * Obtener audiencias
 */
async function getAudiences(adAccountId: string) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/customaudiences`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,description,approximate_count,created_time,updated_time,subtype'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    audiences: data,
    message: 'Audiences retrieved successfully'
  };
}

/**
 * Obtener assets creativos
 */
async function getCreativeAssets(adAccountId: string) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/adimages`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,url,created_time,updated_time'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    creative_assets: data,
    message: 'Creative assets retrieved successfully'
  };
}

/**
 * Crear campaña
 */
async function createCampaign(adAccountId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/campaigns`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    name: data.name,
    status: data.status || 'PAUSED',
    objective: data.objective,
    daily_budget: data.dailyBudget,
    start_time: data.startTime,
    end_time: data.endTime
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${result.error?.message || 'Unknown error'}`);
  }

  return {
    campaign: result,
    message: 'Campaign created successfully'
  };
}

/**
 * Crear conjunto de anuncios
 */
async function createAdSet(adAccountId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/adsets`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    name: data.name,
    campaign_id: data.campaignId,
    status: data.status || 'PAUSED',
    daily_budget: data.dailyBudget,
    optimization_goal: data.optimizationGoal,
    targeting: JSON.stringify(data.targeting)
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${result.error?.message || 'Unknown error'}`);
  }

  return {
    adset: result,
    message: 'Ad set created successfully'
  };
}

/**
 * Crear anuncio
 */
async function createAd(adAccountId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/ads`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    name: data.name,
    adset_id: data.adSetId,
    status: data.status || 'PAUSED',
    creative: JSON.stringify(data.creative)
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${result.error?.message || 'Unknown error'}`);
  }

  return {
    ad: result,
    message: 'Ad created successfully'
  };
}

/**
 * Crear audiencia personalizada
 */
async function createAudience(adAccountId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${adAccountId}/customaudiences`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    name: data.name,
    description: data.description,
    subtype: data.subtype || 'CUSTOM',
    customer_file_source: data.customerFileSource || 'USER_PROVIDED_ONLY'
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${result.error?.message || 'Unknown error'}`);
  }

  return {
    audience: result,
    message: 'Audience created successfully'
  };
}
