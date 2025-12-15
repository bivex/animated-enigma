import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * Infrastructure adapter for console-based logging.
 * Implements the LoggerPort interface using console methods.
 */
export class ConsoleLoggerAdapter implements LoggerPort {
  constructor(private readonly config?: any) {}

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const fullContext = error ? { ...context, error: error.message, stack: error.stack } : context;
      console.error(this.formatMessage('ERROR', message, fullContext));
    }
  }

  child(context: Record<string, any>): LoggerPort {
    return new ChildLoggerAdapter(this, context);
  }

  private shouldLog(level: string): boolean {
    const configuredLevel = this.config?.get?.('logging.level') || 'info';
    const levels = ['debug', 'info', 'warn', 'error'];
    const configuredIndex = levels.indexOf(configuredLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex >= configuredIndex;
  }

  private formatMessage(level: string, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }
}

/**
 * Child logger that adds context to all messages.
 */
class ChildLoggerAdapter implements LoggerPort {
  constructor(
    private readonly parent: ConsoleLoggerAdapter,
    private readonly childContext: Record<string, any>
  ) {}

  debug(message: string, context?: Record<string, any>): void {
    this.parent.debug(message, { ...this.childContext, ...context });
  }

  info(message: string, context?: Record<string, any>): void {
    this.parent.info(message, { ...this.childContext, ...context });
  }

  warn(message: string, context?: Record<string, any>): void {
    this.parent.warn(message, { ...this.childContext, ...context });
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.parent.error(message, error, { ...this.childContext, ...context });
  }

  child(additionalContext: Record<string, any>): LoggerPort {
    return new ChildLoggerAdapter(this.parent, { ...this.childContext, ...additionalContext });
  }
}