import { logger } from './logger';
import { getClientIP } from './utils';

export interface AnalyticsEvent {
  event: string;
  timestamp: Date;
  userId?: string;
  apiKey?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  cost?: number;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalRequests: number;
  totalCost: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  topUsers: Array<{ userId: string; count: number }>;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.ENABLE_ANALYTICS === 'true';
  }

  /**
   * Track API request event
   */
  trackRequest(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.events.push(analyticsEvent);
    logger.info('Analytics event tracked:', analyticsEvent);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * Get analytics metrics
   */
  getMetrics(timeRange: number = 24 * 60 * 60 * 1000): AnalyticsMetrics {
    const cutoffTime = new Date(Date.now() - timeRange);
    const recentEvents = this.events.filter(event => event.timestamp >= cutoffTime);

    const totalRequests = recentEvents.length;
    const totalCost = recentEvents.reduce((sum, event) => sum + (event.cost || 0), 0);
    const averageResponseTime = recentEvents.reduce((sum, event) => sum + event.responseTime, 0) / totalRequests || 0;
    const errorRate = recentEvents.filter(event => event.statusCode >= 400).length / totalRequests || 0;

    // Top endpoints
    const endpointCounts = recentEvents.reduce((counts, event) => {
      counts[event.endpoint] = (counts[event.endpoint] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top users
    const userCounts = recentEvents.reduce((counts, event) => {
      const userId = event.userId || event.apiKey || 'anonymous';
      counts[userId] = (counts[userId] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRequests,
      totalCost,
      averageResponseTime,
      errorRate,
      topEndpoints,
      topUsers,
    };
  }

  /**
   * Get events for a specific user
   */
  getUserEvents(userId: string, limit: number = 100): AnalyticsEvent[] {
    return this.events
      .filter(event => event.userId === userId || event.apiKey === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear old events
   */
  clearOldEvents(olderThan: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = new Date(Date.now() - olderThan);
    this.events = this.events.filter(event => event.timestamp >= cutoffTime);
  }
}

export const analyticsService = new AnalyticsService();

/**
 * Record analytics for API request
 */
export function recordAnalytics(
  userId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  fromCache: boolean = false,
  cost: number = 0,
  error?: string
): void {
  analyticsService.trackRequest({
    event: fromCache ? 'cache_hit' : 'api_request',
    userId,
    endpoint,
    method,
    statusCode,
    responseTime,
    cost,
    metadata: {
      fromCache,
      error,
    },
  });
}