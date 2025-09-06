import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from './logger';

export interface DataForSEOConfig {
  username: string;
  password: string;
  baseURL: string;
  timeout?: number;
}

export interface DataForSEOResponse<T = any> {
  cost: number;
  status_code: number;
  status_message: string;
  tasks: Array<{
    cost: number;
    data: any;
    id: string;
    path: string[];
    result: T[];
    result_count: number;
    status_code: number;
    status_message: string;
    time: string;
  }>;
  tasks_count: number;
  tasks_error: number;
  time: string;
  version: string;
}

export class DataForSEOClient {
  private client: AxiosInstance;
  private config: DataForSEOConfig;

  constructor(config: DataForSEOConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      auth: {
        username: config.username,
        password: config.password,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Fascinante-Digital-API-Gateway/1.0.0',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`DataForSEO Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('DataForSEO Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse<DataForSEOResponse>) => {
        logger.info(`DataForSEO Response: ${response.status} - Cost: ${response.data.cost}`);
        return response;
      },
      (error) => {
        logger.error('DataForSEO Response Error:', {
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a POST request to DataForSEO API
   */
  async post<T = any>(
    endpoint: string,
    data: any,
    options?: { timeout?: number }
  ): Promise<DataForSEOResponse<T>> {
    try {
      const response = await this.client.post<DataForSEOResponse<T>>(endpoint, data, {
        timeout: options?.timeout || this.config.timeout,
      });
      return response.data;
    } catch (error: any) {
      logger.error(`DataForSEO POST Error for ${endpoint}:`, error.message);
      throw new Error(`DataForSEO API Error: ${error.message}`);
    }
  }

  /**
   * Make a GET request to DataForSEO API
   */
  async get<T = any>(
    endpoint: string,
    options?: { timeout?: number }
  ): Promise<DataForSEOResponse<T>> {
    try {
      const response = await this.client.get<DataForSEOResponse<T>>(endpoint, {
        timeout: options?.timeout || this.config.timeout,
      });
      return response.data;
    } catch (error: any) {
      logger.error(`DataForSEO GET Error for ${endpoint}:`, error.message);
      throw new Error(`DataForSEO API Error: ${error.message}`);
    }
  }

  /**
   * Get available AI models
   */
  async getAIModels(): Promise<DataForSEOResponse> {
    return this.get('/v3/ai_optimization/chat_gpt/llm_responses/models');
  }

  /**
   * Generate AI content
   */
  async generateAIContent(prompt: string, model: string = 'gpt-4o-mini'): Promise<DataForSEOResponse> {
    return this.post('/v3/ai_optimization/chat_gpt/llm_responses/live', [
      {
        user_prompt: prompt,
        model_name: model,
        max_output_tokens: 1000,
        temperature: 0.3,
        top_p: 0.5,
        web_search: true,
      },
    ]);
  }

  /**
   * Analyze SERP for keywords
   */
  async analyzeSERP(keyword: string, location: string = 'United States'): Promise<DataForSEOResponse> {
    return this.post('/v3/serp/google/organic/task_post', [
      {
        keyword,
        location_name: location,
        language_name: 'English',
        depth: 10,
        priority: 1,
      },
    ]);
  }

  /**
   * Get keyword search volume
   */
  async getKeywordVolume(keywords: string[]): Promise<DataForSEOResponse> {
    return this.post('/v3/keywords_data/google_ads/search_volume/live', {
      keywords,
      location_name: 'United States',
      language_code: 'en',
    });
  }

  /**
   * Get keyword ideas
   */
  async getKeywordIdeas(keywords: string[]): Promise<DataForSEOResponse> {
    return this.post('/v3/dataforseo_labs/google/keyword_ideas/live', {
      keywords,
      location_name: 'United States',
      language_code: 'en',
      limit: 100,
    });
  }

  /**
   * Get domain rank overview
   */
  async getDomainRankOverview(domain: string): Promise<DataForSEOResponse> {
    return this.post('/v3/dataforseo_labs/google/domain_rank_overview/live', {
      target: domain,
      location_name: 'United States',
      language_code: 'en',
    });
  }

  /**
   * Get backlinks summary
   */
  async getBacklinksSummary(domain: string): Promise<DataForSEOResponse> {
    return this.post('/v3/backlinks/summary/live', {
      target: domain,
    });
  }
}

// Singleton instance
let dataForSEOClient: DataForSEOClient | null = null;

export function getDataForSEOClient(): DataForSEOClient {
  if (!dataForSEOClient) {
    dataForSEOClient = new DataForSEOClient({
      username: 'info@fascinantedigital.com',
      password: '1dca310be03b7a87',
      baseURL: 'https://api.dataforseo.com',
      timeout: 30000,
    });
  }
  return dataForSEOClient;
}