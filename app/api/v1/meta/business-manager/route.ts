import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/lib/cache';
import { analyticsService } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/utils';

/**
 * 🏢 META BUSINESS MANAGER API - FASCINANTE DIGITAL ELITE
 * 
 * Endpoint para gestión de Meta Business Manager
 * Minimiza el uso de dashboards web y UI de Meta
 */

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_BUSINESS_ID = process.env.META_BUSINESS_ID;
const META_GRAPH_API_URL = 'https://graph.facebook.com/v20.0';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'info';
  const businessId = searchParams.get('business_id') || META_BUSINESS_ID || 'me';

  const endpoint = `/api/v1/meta/business-manager`;

  try {
    if (!META_ACCESS_TOKEN) {
      logger.error('Meta access token not configured');
      return NextResponse.json({ error: 'Meta access token not configured' }, { status: 500 });
    }

    const cacheKey = cacheService.generateCacheKey(endpoint, { action, businessId });
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      logger.info(`Cache hit for Meta Business Manager: ${action}`);
      return NextResponse.json(cachedResponse, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      });
    }

    let result;

    switch (action) {
      case 'info':
        result = await getBusinessManagerInfo(businessId);
        break;
      case 'adaccounts':
        result = await getAdAccounts(businessId);
        break;
      case 'pages':
        result = await getFacebookPages();
        break;
      case 'instagram':
        result = await getInstagramAccounts();
        break;
      case 'users':
        result = await getBusinessUsers(businessId);
        break;
      case 'system_users':
        result = await getSystemUsers(businessId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action. Use: info, adaccounts, pages, instagram, users, system_users' }, { status: 400 });
    }

    await cacheService.set(cacheKey, result, 1800); // 30 minutes cache

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_business_manager_request',
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
        businessId,
      },
    });

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Meta Business Manager endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_business_manager_error',
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
        businessId,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const body = await request.json();
  const { action, businessId, data } = body;

  const endpoint = `/api/v1/meta/business-manager`;

  try {
    let result;

    switch (action) {
      case 'create_system_user':
        if (!businessId || !data) {
          return NextResponse.json({ error: 'businessId and data are required' }, { status: 400 });
        }
        result = await createSystemUser(businessId, data);
        break;
      case 'assign_asset':
        if (!businessId || !data) {
          return NextResponse.json({ error: 'businessId and data are required' }, { status: 400 });
        }
        result = await assignAsset(businessId, data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action. Use: create_system_user, assign_asset' }, { status: 400 });
    }

    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_business_manager_post_request',
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
        businessId,
      },
    });

    return NextResponse.json(result, {
      headers: {
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error: any) {
    logger.error(`Error in Meta Business Manager POST endpoint:`, error);
    const responseTime = Date.now() - startTime;
    analyticsService.trackRequest({
      event: 'meta_business_manager_post_error',
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
        businessId,
        error: error.message,
      },
    });
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

/**
 * Obtener información de Business Manager
 */
async function getBusinessManagerInfo(businessId: string) {
  const url = businessId ? `${META_GRAPH_API_URL}/${businessId}` : `${META_GRAPH_API_URL}/me`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,primary_page,timezone_id,created_time,updated_time,verification_status'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    business_manager: data,
    message: 'Business Manager information retrieved successfully'
  };
}

/**
 * Obtener cuentas publicitarias
 */
async function getAdAccounts(businessId: string) {
  const url = businessId ? `${META_GRAPH_API_URL}/${businessId}/adaccounts` : `${META_GRAPH_API_URL}/me/adaccounts`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,account_status,currency,timezone_name,amount_spent,balance,created_time,disable_reason'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    ad_accounts: data,
    message: 'Ad accounts retrieved successfully'
  };
}

/**
 * Obtener páginas de Facebook
 */
async function getFacebookPages() {
  const url = `${META_GRAPH_API_URL}/me/accounts`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,category,fan_count,access_token,instagram_business_account,website'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    facebook_pages: data,
    message: 'Facebook pages retrieved successfully'
  };
}

/**
 * Obtener cuentas de Instagram Business
 */
async function getInstagramAccounts() {
  const pages = await getFacebookPages();
  const instagramAccounts = [];

  for (const page of pages.facebook_pages.data || []) {
    if (page.instagram_business_account) {
      const url = `${META_GRAPH_API_URL}/${page.instagram_business_account.id}`;
      const params = new URLSearchParams({
        access_token: META_ACCESS_TOKEN!,
        fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography'
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (response.ok) {
        instagramAccounts.push({
          ...data,
          page_id: page.id,
          page_name: page.name
        });
      }
    }
  }

  return {
    instagram_accounts: { data: instagramAccounts },
    message: 'Instagram Business accounts retrieved successfully'
  };
}

/**
 * Obtener usuarios del Business Manager
 */
async function getBusinessUsers(businessId: string) {
  const url = `${META_GRAPH_API_URL}/${businessId}/users`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,email,role,created_time,updated_time'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    business_users: data,
    message: 'Business users retrieved successfully'
  };
}

/**
 * Obtener System Users
 */
async function getSystemUsers(businessId: string) {
  const url = `${META_GRAPH_API_URL}/${businessId}/system_users`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    fields: 'id,name,role,created_time,updated_time'
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Meta API Error: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    system_users: data,
    message: 'System users retrieved successfully'
  };
}

/**
 * Crear System User
 */
async function createSystemUser(businessId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${businessId}/system_users`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    name: data.name,
    role: data.role || 'ADMIN'
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
    system_user: result,
    message: 'System user created successfully'
  };
}

/**
 * Asignar asset a usuario
 */
async function assignAsset(businessId: string, data: any) {
  const url = `${META_GRAPH_API_URL}/${businessId}/assigned_users`;
  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN!,
    user: data.userId,
    tasks: data.tasks.join(',')
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
    assignment: result,
    message: 'Asset assigned successfully'
  };
}
