import { SourceFile } from '../entities/SourceFile';
import { CodeSmell } from '../entities/CodeSmell';
import { AnalysisResult } from '../aggregates/AnalysisResult';
import { LoggerPort } from '../ports/LoggerPort';
import { SmellDetectorPort } from '../ports/SmellDetectorPort';

/**
 * Domain service responsible for orchestrating the smell detection process.
 * Coordinates file analysis and aggregates results into a complete analysis.
 */
export class SmellDetectionService {
  constructor(
    private readonly detector: SmellDetectorPort,
    private readonly logger: LoggerPort
  ) {}

  /**
   * Analyzes a collection of source files and produces a complete analysis result.
   * @param projectPath - Path to the analyzed project
   * @param files - Source files to analyze
   * @returns Promise resolving to complete analysis result
   */
  async analyzeProject(projectPath: string, files: SourceFile[]): Promise<AnalysisResult> {
    const startTime = Date.now();
    const childLogger = this.logger.child({ projectPath, fileCount: files.length });

    childLogger.info('Starting project analysis');

    try {
      const smells = await this.detector.analyzeFiles(files);
      const duration = Date.now() - startTime;

      const result = new AnalysisResult(projectPath, smells, new Date(), duration);

      childLogger.info('Project analysis completed', {
        duration,
        totalSmells: result.totalSmells,
        severityCounts: result.getSeverityCounts(),
        hasCriticalIssues: result.hasCriticalIssues
      });

      return result;
    } catch (error) {
      childLogger.error('Project analysis failed', error as Error, { duration: Date.now() - startTime });
      throw error;
    }
  }

  /**
   * Filters analysis results by severity level.
   * @param result - Analysis result to filter
   * @param minSeverity - Minimum severity to include (inclusive)
   * @returns Filtered analysis result
   */
  filterBySeverity(result: AnalysisResult, minSeverity: string): AnalysisResult {
    // This is a domain operation that could be moved to AnalysisResult
    // but kept here for demonstration of domain service usage
    const filteredSmells = result.smells.filter(smell =>
      smell.severity.priority >= this.getSeverityPriority(minSeverity)
    );

    return new AnalysisResult(
      result.projectPath,
      filteredSmells,
      result.analysisTimestamp,
      result.duration
    );
  }

  private getSeverityPriority(severity: string): number {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }
}