import { ConfigurationPort } from '../../domain/ports/ConfigurationPort';

/**
 * Infrastructure adapter for environment-based configuration.
 * Implements the ConfigurationPort using environment variables and default values.
 */
export class EnvironmentConfigurationAdapter implements ConfigurationPort {
  private readonly config: Record<string, any>;

  constructor(env: Record<string, string | undefined> = process.env) {
    this.config = this.loadConfiguration(env);
  }

  get<T>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue as T;
      }
    }

    return value as T;
  }

  getObject<T>(key: string, defaultValue?: T): T {
    return this.get<T>(key, defaultValue);
  }

  has(key: string): boolean {
    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }

    return true;
  }

  private loadConfiguration(env: Record<string, string | undefined>): Record<string, any> {
    return {
      // Analysis configuration
      analysis: {
        minSeverity: env.ANGULAR_SMELLS_MIN_SEVERITY || 'LOW',
        maxFileSize: parseInt(env.ANGULAR_SMELLS_MAX_FILE_SIZE || '10485760'), // 10MB
        timeout: parseInt(env.ANGULAR_SMELLS_TIMEOUT || '300000'), // 5 minutes
        parallelProcessing: env.ANGULAR_SMELLS_PARALLEL === 'true'
      },

      // Output configuration
      output: {
        format: env.ANGULAR_SMELLS_FORMAT || 'console',
        includeDetails: env.ANGULAR_SMELLS_INCLUDE_DETAILS !== 'false',
        showProgress: env.ANGULAR_SMELLS_SHOW_PROGRESS !== 'false',
        colorize: env.ANGULAR_SMELLS_COLORIZE !== 'false'
      },

      // Application configuration
      application: {
        exitOnCritical: env.ANGULAR_SMELLS_EXIT_ON_CRITICAL !== 'false',
        logLevel: env.ANGULAR_SMELLS_LOG_LEVEL || 'info',
        verbose: env.ANGULAR_SMELLS_VERBOSE === 'true'
      },

      // File scanning configuration
      scanning: {
        excludePatterns: this.parseArray(env.ANGULAR_SMELLS_EXCLUDE_PATTERNS) || [
          '**/node_modules/**',
          '**/dist/**',
          '**/*.spec.ts',
          '**/*.d.ts',
          '**/.git/**',
          '**/coverage/**'
        ],
        includePatterns: this.parseArray(env.ANGULAR_SMELLS_INCLUDE_PATTERNS) || [
          '**/*.ts',
          '**/*.html',
          '**/angular.json'
        ]
      },

      // Detection rules configuration
      rules: {
        godComponent: {
          maxImports: parseInt(env.ANGULAR_SMELLS_MAX_IMPORTS || '25'),
          maxLines: parseInt(env.ANGULAR_SMELLS_MAX_LINES || '400')
        },
        subscriptionHell: {
          maxDepth: parseInt(env.ANGULAR_SMELLS_MAX_SUBSCRIPTION_DEPTH || '3')
        },
        bundleBudget: {
          minSize: parseInt(env.ANGULAR_SMELLS_MIN_BUNDLE_SIZE || '512000') // 512KB
        }
      },

      // Logging configuration
      logging: {
        level: env.ANGULAR_SMELLS_LOG_LEVEL || 'info',
        format: env.ANGULAR_SMELLS_LOG_FORMAT || 'json',
        output: env.ANGULAR_SMELLS_LOG_OUTPUT || 'console',
        file: env.ANGULAR_SMELLS_LOG_FILE
      },

      // Feature flags
      features: {
        parallelAnalysis: env.ANGULAR_SMELLS_PARALLEL_ANALYSIS === 'true',
        detailedReporting: env.ANGULAR_SMELLS_DETAILED_REPORTING !== 'false',
        experimentalRules: env.ANGULAR_SMELLS_EXPERIMENTAL_RULES === 'true'
      }
    };
  }

  private parseArray(value: string | undefined): string[] | undefined {
    if (!value) return undefined;

    try {
      return JSON.parse(value);
    } catch {
      // If not valid JSON, treat as comma-separated string
      return value.split(',').map(item => item.trim());
    }
  }
}