// 🚀 FASCINANTE DIGITAL - API GATEWAY WORKER ELITE
// Cloudflare Worker para proxy y cache de DataForSEO API

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 🛡️ CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400',
    };

    // 🔄 Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    // 🔐 API Key Validation
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== env.API_GATEWAY_SECRET) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized', 
        message: 'Invalid API Key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 📊 Rate Limiting
    const clientIP = request.headers.get('CF-Connecting-IP');
    const rateLimitKey = `rate_limit:${clientIP}`;
    const rateLimit = await env.CACHE.get(rateLimitKey);
    
    if (rateLimit && parseInt(rateLimit) > 100) { // 100 requests per minute
      return new Response(JSON.stringify({ 
        error: 'Rate Limited', 
        message: 'Too many requests' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 📈 Update rate limit
    await env.CACHE.put(rateLimitKey, (parseInt(rateLimit) || 0) + 1, { expirationTtl: 60 });

    // 🎯 Route to DataForSEO API
    if (url.pathname.startsWith('/api/v3/')) {
      return handleDataForSEO(request, env, corsHeaders);
    }

    // 🏠 Health Check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Fascinante Digital API Gateway',
        version: '1.0.0'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 📚 API Documentation
    if (url.pathname === '/docs') {
      return new Response(JSON.stringify({
        title: 'Fascinante Digital API Gateway',
        version: '1.0.0',
        endpoints: {
          '/api/v3/ai_optimization/chat_gpt/llm_responses/live': 'POST - Generate AI content',
          '/api/v3/serp/google/organic/live/advanced': 'POST - SERP analysis',
          '/health': 'GET - Health check',
          '/docs': 'GET - API documentation'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Not Found', 
      message: 'Endpoint not found' 
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// 🔄 Handle DataForSEO API requests
async function handleDataForSEO(request, env, corsHeaders) {
  const url = new URL(request.url);
  const dataForSEOUrl = `https://api.dataforseo.com${url.pathname}${url.search}`;
  
  // 🔍 Check cache first
  const cacheKey = `dataforseo:${url.pathname}:${await request.text()}`;
  const cached = await env.CACHE.get(cacheKey);
  
  if (cached) {
    return new Response(cached, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Cache': 'HIT'
      }
    });
  }

  // 🚀 Forward to DataForSEO
  const dataForSEORequest = new Request(dataForSEOUrl, {
    method: request.method,
    headers: {
      'Authorization': `Basic ${btoa(`${env.DATAFORSEO_USERNAME}:${env.DATAFORSEO_PASSWORD}`)}`,
      'Content-Type': 'application/json',
    },
    body: request.body
  });

  try {
    const response = await fetch(dataForSEORequest);
    const responseData = await response.text();
    
    // 💾 Cache successful responses
    if (response.ok) {
      await env.CACHE.put(cacheKey, responseData, { expirationTtl: 3600 });
    }
    
    return new Response(responseData, {
      status: response.status,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
