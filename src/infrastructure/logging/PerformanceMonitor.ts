import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * Performance monitoring utility for measuring operation execution times.
 */
export class PerformanceMonitor {
  constructor(private readonly logger: LoggerPort) {}

  /**
   * Measures the execution time of an asynchronous operation.
   * @param operation - Name of the operation being measured
   * @param operationFn - The async function to measure
   * @param context - Optional context for logging
   * @returns Promise resolving to the operation result
   */
  async measureAsync<T>(
    operation: string,
    operationFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    const childLogger = this.logger.child({ operation, ...context });

    childLogger.debug('Starting operation');

    try {
      const result = await operationFn();
      const duration = Date.now() - startTime;

      childLogger.info('Operation completed', { duration });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      childLogger.error('Operation failed', error as Error, { duration });
      throw error;
    }
  }

  /**
   * Measures the execution time of a synchronous operation.
   * @param operation - Name of the operation being measured
   * @param operationFn - The sync function to measure
   * @param context - Optional context for logging
   * @returns The operation result
   */
  measureSync<T>(
    operation: string,
    operationFn: () => T,
    context?: Record<string, any>
  ): T {
    const startTime = Date.now();
    const childLogger = this.logger.child({ operation, ...context });

    childLogger.debug('Starting operation');

    try {
      const result = operationFn();
      const duration = Date.now() - startTime;

      childLogger.info('Operation completed', { duration });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      childLogger.error('Operation failed', error as Error, { duration });
      throw error;
    }
  }

  /**
   * Creates a performance monitoring wrapper for a method.
   * @param operation - Name of the operation
   * @param contextFn - Optional function to extract context from method arguments
   * @returns Method decorator
   */
  monitorMethod(
    operation: string,
    contextFn?: (...args: any[]) => Record<string, any>
  ) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;
      const logger = this.logger;

      descriptor.value = async function (...args: any[]) {
        const context = contextFn ? contextFn(...args) : {};
        const childLogger = logger.child({ operation, method: propertyName, ...context });

        const startTime = Date.now();
        childLogger.debug('Method execution started');

        try {
          const result = await method.apply(this, args);
          const duration = Date.now() - startTime;

          childLogger.info('Method execution completed', { duration });

          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          childLogger.error('Method execution failed', error as Error, { duration });
          throw error;
        }
      };

      return descriptor;
    };
  }
}