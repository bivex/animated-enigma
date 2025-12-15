/**
 * Port interface for logging operations.
 * Defines the contract for structured logging throughout the application.
 */
export interface LoggerPort {
  /**
   * Logs a debug message.
   * @param message - Log message
   * @param context - Optional context data
   */
  debug(message: string, context?: Record<string, any>): void;

  /**
   * Logs an info message.
   * @param message - Log message
   * @param context - Optional context data
   */
  info(message: string, context?: Record<string, any>): void;

  /**
   * Logs a warning message.
   * @param message - Log message
   * @param context - Optional context data
   */
  warn(message: string, context?: Record<string, any>): void;

  /**
   * Logs an error message.
   * @param message - Log message
   * @param error - Optional error object
   * @param context - Optional context data
   */
  error(message: string, error?: Error, context?: Record<string, any>): void;

  /**
   * Creates a child logger with additional context.
   * @param context - Context to add to all log messages
   * @returns New logger instance with added context
   */
  child(context: Record<string, any>): LoggerPort;
}