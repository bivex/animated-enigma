import { AnalyzeProjectUseCase, AnalyzeProjectOptions, AnalysisExecutionResult } from '../use-cases/AnalyzeProjectUseCase';
import { ConfigurationPort } from '../../domain/ports/ConfigurationPort';
import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * Application service that provides high-level analysis operations.
 * Handles application-level concerns like configuration, validation, and workflow management.
 */
export class AnalysisApplicationService {
  constructor(
    private readonly analyzeProjectUseCase: AnalyzeProjectUseCase,
    private readonly config: ConfigurationPort,
    private readonly logger: LoggerPort
  ) {}

  /**
   * Analyzes an Angular project with default configuration.
   * @param projectPath - Path to the project to analyze
   * @returns Promise resolving to analysis execution result
   */
  async analyzeProject(projectPath: string): Promise<AnalysisExecutionResult> {
    const options = this.getDefaultAnalysisOptions();
    return this.analyzeProjectWithOptions(projectPath, options);
  }

  /**
   * Analyzes an Angular project with custom options.
   * @param projectPath - Path to the project to analyze
   * @param customOptions - Custom analysis options
   * @returns Promise resolving to analysis execution result
   */
  async analyzeProjectWithOptions(
    projectPath: string,
    customOptions: Partial<AnalyzeProjectOptions>
  ): Promise<AnalysisExecutionResult> {
    const childLogger = this.logger.child({ projectPath, customOptions });

    try {
      // Validate project path
      this.validateProjectPath(projectPath);

      // Merge with default options
      const options = { ...this.getDefaultAnalysisOptions(), ...customOptions };

      childLogger.info('Executing project analysis with merged options', { options });

      // Execute the analysis
      const result = await this.analyzeProjectUseCase.execute(projectPath, options);

      // Handle exit codes based on configuration
      this.handleExitCodes(result.result);

      return result;

    } catch (error) {
      childLogger.error('Analysis application service failed', error as Error);
      throw error;
    }
  }

  /**
   * Gets analysis statistics for reporting purposes.
   * @param result - Analysis execution result
   * @returns Statistics object
   */
  getAnalysisStatistics(result: AnalysisExecutionResult): AnalysisStatistics {
    const severityCounts = result.result.getSeverityCounts();
    const categoryCounts = result.result.getCategoryCounts();

    return {
      totalFiles: 0, // Would need to track this in the use case
      totalSmells: result.result.totalSmells,
      severityBreakdown: severityCounts,
      categoryBreakdown: categoryCounts,
      executionTime: result.executionTime,
      hasCriticalIssues: result.result.hasCriticalIssues,
      highestSeverity: result.result.getHighestSeverity()?.toString() || 'NONE'
    };
  }

  private getDefaultAnalysisOptions(): AnalyzeProjectOptions {
    return {
      minSeverity: this.config.get('analysis.minSeverity', 'LOW'),
      format: this.config.get('output.format', 'console'),
      includeDetails: this.config.get('output.includeDetails', true)
    };
  }

  private validateProjectPath(projectPath: string): void {
    if (!projectPath || projectPath.trim() === '') {
      throw new Error('Project path cannot be empty');
    }

    // Additional validation could be added here
    // (e.g., check if path exists, is readable, etc.)
  }

  private handleExitCodes(result: any): void {
    // Application-level logic for handling exit codes
    // This could be extended to handle different exit scenarios
    const exitOnCritical = this.config.get('application.exitOnCritical', true);

    if (exitOnCritical && result.hasCriticalIssues) {
      // This would typically be handled by the CLI layer
      // but the logic is defined here for separation of concerns
      this.logger.warn('Analysis found critical issues - consider failing CI/CD pipeline');
    }
  }
}

/**
 * Statistics from an analysis execution.
 */
export interface AnalysisStatistics {
  /** Total number of files analyzed */
  totalFiles: number;
  /** Total number of code smells detected */
  totalSmells: number;
  /** Breakdown of smells by severity */
  severityBreakdown: Record<string, number>;
  /** Breakdown of smells by category */
  categoryBreakdown: Record<string, number>;
  /** Total execution time in milliseconds */
  executionTime: number;
  /** Whether critical issues were found */
  hasCriticalIssues: boolean;
  /** Highest severity level found */
  highestSeverity: string;
}