import { AnalysisResult } from '../aggregates/AnalysisResult';

/**
 * Port interface for generating analysis reports.
 * Defines the contract for creating human-readable and machine-readable reports.
 */
export interface ReportGeneratorPort {
  /**
   * Generates a formatted report from analysis results.
   * @param result - The complete analysis result
   * @param format - Optional output format specification
   * @returns Promise resolving to formatted report string
   */
  generateReport(result: AnalysisResult, format?: string): Promise<string>;
}