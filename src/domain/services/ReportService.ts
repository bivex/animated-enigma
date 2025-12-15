import { AnalysisResult } from '../aggregates/AnalysisResult';
import { LoggerPort } from '../ports/LoggerPort';
import { ReportGeneratorPort } from '../ports/ReportGeneratorPort';

/**
 * Domain service responsible for report generation and formatting.
 * Handles different report formats and output destinations.
 */
export class ReportService {
  constructor(
    private readonly reportGenerator: ReportGeneratorPort,
    private readonly logger: LoggerPort
  ) {}

  /**
   * Generates a formatted report from analysis results.
   * @param result - Analysis result to report on
   * @param format - Report format (default: 'console')
   * @returns Promise resolving to formatted report
   */
  async generateReport(result: AnalysisResult, format: string = 'console'): Promise<string> {
    const childLogger = this.logger.child({
      format,
      totalSmells: result.totalSmells,
      hasCriticalIssues: result.hasCriticalIssues
    });

    childLogger.info('Generating analysis report');

    try {
      const report = await this.reportGenerator.generateReport(result, format);

      childLogger.info('Report generation completed', {
        reportLength: report.length,
        format
      });

      return report;
    } catch (error) {
      childLogger.error('Report generation failed', error as Error);
      throw error;
    }
  }

  /**
   * Validates analysis results before report generation.
   * @param result - Analysis result to validate
   * @returns True if result is valid for reporting
   */
  validateResult(result: AnalysisResult): boolean {
    // Domain logic for validating analysis results
    if (!result.projectPath || result.projectPath.trim() === '') {
      this.logger.warn('Analysis result missing valid project path');
      return false;
    }

    if (result.duration < 0) {
      this.logger.warn('Analysis result has invalid duration');
      return false;
    }

    // Additional validation logic could go here
    return true;
  }
}