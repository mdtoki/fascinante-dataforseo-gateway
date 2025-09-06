import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

interface CacheConfig {
  ttl: number; // Time to live in seconds
  keyPrefix: string;
}

class CacheService {
  private redis: RedisClientType | null = null;
  private memoryCache: Map<string, { value: any; expires: number }> = new Map();

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redis = createClient({
          url: process.env.REDIS_URL,
          password: process.env.REDIS_PASSWORD,
        });
        await this.redis.connect();
        logger.info('Redis connected for caching');
      }
    } catch (error) {
      logger.warn('Redis not available, using memory cache');
    }
  }

  /**
   * Get value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Fallback to memory cache
        const item = this.memoryCache.get(key);
        if (item && item.expires > Date.now()) {
          return item.value;
        } else if (item) {
          this.memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      if (this.redis) {
        await this.redis.setEx(key, ttl, JSON.stringify(value));
        return true;
      } else {
        // Fallback to memory cache
        this.memoryCache.set(key, {
          value,
          expires: Date.now() + ttl * 1000,
        });
        return true;
      }
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (this.redis) {
        await this.redis.del(key);
        return true;
      } else {
        this.memoryCache.delete(key);
        return true;
      }
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Generate cache key for DataForSEO requests
   */
  generateCacheKey(endpoint: string, params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as any);

    return `dataforseo:${endpoint}:${Buffer.from(JSON.stringify(sortedParams)).toString('base64')}`;
  }

  /**
   * Cache DataForSEO response
   */
  async cacheDataForSEOResponse(
    endpoint: string,
    params: any,
    response: any,
    ttl: number = 3600
  ): Promise<void> {
    const key = this.generateCacheKey(endpoint, params);
    await this.set(key, response, ttl);
  }

  /**
   * Get cached DataForSEO response
   */
  async getCachedDataForSEOResponse(
    endpoint: string,
    params: any
  ): Promise<any | null> {
    const key = this.generateCacheKey(endpoint, params);
    return this.get(key);
  }
}

export const cacheService = new CacheService();

/**
 * Get cached response
 */
export async function getCachedResponse(key: string): Promise<any | null> {
  return cacheService.get(key);
}

/**
 * Set cached response
 */
export async function setCachedResponse(
  key: string,
  value: any,
  ttl: number = 3600
): Promise<boolean> {
  return cacheService.set(key, value, ttl);
}
