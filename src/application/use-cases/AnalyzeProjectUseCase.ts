import { AnalysisResult } from '../../domain/aggregates/AnalysisResult';
import { SmellDetectionService } from '../../domain/services/SmellDetectionService';
import { ReportService } from '../../domain/services/ReportService';
import { FileScannerPort } from '../../domain/ports/FileScannerPort';
import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * Application use case for analyzing an Angular project.
 * Orchestrates the complete analysis workflow from scanning to reporting.
 */
export class AnalyzeProjectUseCase {
  constructor(
    private readonly fileScanner: FileScannerPort,
    private readonly smellDetectionService: SmellDetectionService,
    private readonly reportService: ReportService,
    private readonly logger: LoggerPort
  ) {}

  /**
   * Executes the complete project analysis workflow.
   * @param projectPath - Path to the Angular project to analyze
   * @param options - Analysis options
   * @returns Promise resolving to analysis result and formatted report
   */
  async execute(projectPath: string, options: AnalyzeProjectOptions = {}): Promise<AnalysisExecutionResult> {
    const startTime = Date.now();
    const childLogger = this.logger.child({ projectPath, options });

    childLogger.info('Starting project analysis use case');

    try {
      // Step 1: Scan project files
      childLogger.debug('Scanning project files');
      const sourceFiles = await this.fileScanner.scanProject(projectPath);

      if (sourceFiles.length === 0) {
        childLogger.warn('No source files found in project');
        const emptyResult = new AnalysisResult(projectPath, [], new Date(), 0);
        return {
          result: emptyResult,
          report: await this.reportService.generateReport(emptyResult, options.format),
          executionTime: 0
        };
      }

      // Step 2: Analyze files for code smells
      childLogger.debug('Analyzing files for code smells', { fileCount: sourceFiles.length });
      const analysisResult = await this.smellDetectionService.analyzeProject(projectPath, sourceFiles);

      // Step 3: Apply filtering if requested
      let finalResult = analysisResult;
      if (options.minSeverity) {
        childLogger.debug('Applying severity filter', { minSeverity: options.minSeverity });
        finalResult = this.smellDetectionService.filterBySeverity(analysisResult, options.minSeverity);
      }

      // Step 4: Generate report
      childLogger.debug('Generating analysis report');
      const report = await this.reportService.generateReport(finalResult, options.format);

      const executionTime = Date.now() - startTime;

      childLogger.info('Project analysis use case completed', {
        executionTime,
        totalSmells: finalResult.totalSmells,
        hasCriticalIssues: finalResult.hasCriticalIssues
      });

      return {
        result: finalResult,
        report,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      childLogger.error('Project analysis use case failed', error as Error, { executionTime });
      throw error;
    }
  }
}

/**
 * Options for project analysis execution.
 */
export interface AnalyzeProjectOptions {
  /** Minimum severity level to include in results */
  minSeverity?: string;
  /** Report output format */
  format?: string;
  /** Whether to include detailed file information */
  includeDetails?: boolean;
}

/**
 * Result of executing the analyze project use case.
 */
export interface AnalysisExecutionResult {
  /** The complete analysis result */
  result: AnalysisResult;
  /** Formatted report string */
  report: string;
  /** Total execution time in milliseconds */
  executionTime: number;
}