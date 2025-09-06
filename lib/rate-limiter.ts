import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

interface RateLimitConfig {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration?: number;
}

class RateLimiterService {
  private rateLimiters: Map<string, RateLimiterMemory | RateLimiterRedis> =
    new Map();
  private redis: RedisClientType | null = null;

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
        logger.info('Redis connected for rate limiting');
      }
    } catch (error) {
      logger.warn('Redis not available, using memory rate limiter');
    }
  }

  private getRateLimiter(
    config: RateLimitConfig
  ): RateLimiterMemory | RateLimiterRedis {
    const key = `${config.keyPrefix}-${config.points}-${config.duration}`;

    if (!this.rateLimiters.has(key)) {
      const limiter = this.redis
        ? new RateLimiterRedis({
            storeClient: this.redis,
            keyPrefix: config.keyPrefix,
            points: config.points,
            duration: config.duration,
            blockDuration: config.blockDuration || config.duration,
          })
        : new RateLimiterMemory({
            keyPrefix: config.keyPrefix,
            points: config.points,
            duration: config.duration,
            blockDuration: config.blockDuration || config.duration,
          });

      this.rateLimiters.set(key, limiter);
    }

    return this.rateLimiters.get(key)!;
  }

  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remainingPoints: number; resetTime: Date }> {
    try {
      const limiter = this.getRateLimiter(config);
      const result = await limiter.consume(identifier);

      return {
        allowed: true,
        remainingPoints: result.remainingPoints,
        resetTime: new Date(Date.now() + result.msBeforeNext),
      };
    } catch (rejRes: any) {
      return {
        allowed: false,
        remainingPoints: 0,
        resetTime: new Date(Date.now() + rejRes.msBeforeNext),
      };
    }
  }

  async resetRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<void> {
    try {
      const limiter = this.getRateLimiter(config);
      await limiter.delete(identifier);
    } catch (error) {
      logger.error('Error resetting rate limit:', error);
    }
  }
}

export const rateLimiterService = new RateLimiterService();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  API_KEY: {
    keyPrefix: 'api_key',
    points: parseInt(process.env.API_RATE_LIMIT_PER_MINUTE || '1000'),
    duration: 60, // 1 minute
    blockDuration: 60,
  },
  IP: {
    keyPrefix: 'ip',
    points: 100,
    duration: 60, // 1 minute
    blockDuration: 60,
  },
  USER: {
    keyPrefix: 'user',
    points: 500,
    duration: 3600, // 1 hour
    blockDuration: 3600,
  },
} as const;

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimiting(
  request: Request,
  userId: string
): Promise<{ allowed: boolean; message?: string }> {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Check IP rate limit
  const ipLimit = await rateLimiterService.checkRateLimit(ip, RATE_LIMITS.IP);
  if (!ipLimit.allowed) {
    return {
      allowed: false,
      message: 'Rate limit exceeded for IP address',
    };
  }

  // Check user rate limit
  const userLimit = await rateLimiterService.checkRateLimit(
    userId,
    RATE_LIMITS.USER
  );
  if (!userLimit.allowed) {
    return {
      allowed: false,
      message: 'Rate limit exceeded for user',
    };
  }

  return { allowed: true };
}
