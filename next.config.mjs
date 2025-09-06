/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['redis'],
  output: 'standalone',
  env: {
    DATAFORSEO_USERNAME: process.env.DATAFORSEO_USERNAME,
    DATAFORSEO_PASSWORD: process.env.DATAFORSEO_PASSWORD,
    DATAFORSEO_BASE_URL: process.env.DATAFORSEO_BASE_URL,
    API_GATEWAY_SECRET: process.env.API_GATEWAY_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-API-Key',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
