// Simple logger compatible with Edge Runtime
const logLevel = process.env.LOG_LEVEL || 'info';

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  service: string;
  [key: string]: any;
}

class SimpleLogger {
  private isEnabled(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, meta?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: 'fascinante-dataforseo-gateway',
      ...meta,
    };
  }

  private log(level: string, message: string, meta?: any): void {
    if (!this.isEnabled(level)) return;

    const entry = this.formatMessage(level, message, meta);
    
    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }
}

export const logger = new SimpleLogger();