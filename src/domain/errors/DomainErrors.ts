/**
 * Base class for all domain-specific errors.
 * Provides structured error handling with context.
 */
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when analysis of a source file fails.
 */
export class AnalysisError extends DomainError {
  constructor(
    filePath: string,
    originalError: Error,
    context?: Record<string, any>
  ) {
    super(
      `Failed to analyze file: ${filePath}`,
      'ANALYSIS_ERROR',
      { filePath, originalError: originalError.message, ...context }
    );
  }
}

/**
 * Error thrown when parsing source code fails.
 */
export class ParsingError extends DomainError {
  constructor(
    filePath: string,
    parsingError: string,
    context?: Record<string, any>
  ) {
    super(
      `Failed to parse file: ${filePath}`,
      'PARSING_ERROR',
      { filePath, parsingError, ...context }
    );
  }
}

/**
 * Error thrown when file system operations fail.
 */
export class FileSystemError extends DomainError {
  constructor(
    operation: string,
    filePath: string,
    originalError: Error,
    context?: Record<string, any>
  ) {
    super(
      `File system operation failed: ${operation} on ${filePath}`,
      'FILE_SYSTEM_ERROR',
      { operation, filePath, originalError: originalError.message, ...context }
    );
  }
}

/**
 * Error thrown when configuration is invalid.
 */
export class ConfigurationError extends DomainError {
  constructor(
    message: string,
    context?: Record<string, any>
  ) {
    super(message, 'CONFIGURATION_ERROR', context);
  }
}

/**
 * Error thrown when a required dependency is missing.
 */
export class DependencyError extends DomainError {
  constructor(
    dependency: string,
    context?: Record<string, any>
  ) {
    super(
      `Required dependency not available: ${dependency}`,
      'DEPENDENCY_ERROR',
      { dependency, ...context }
    );
  }
}