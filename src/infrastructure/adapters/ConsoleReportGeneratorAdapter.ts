import { ReportGeneratorPort } from '../../domain/ports/ReportGeneratorPort';
import { AnalysisResult } from '../../domain/aggregates/AnalysisResult';
import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * Infrastructure adapter for console-based report generation.
 * Implements the ReportGeneratorPort interface for console output.
 */
export class ConsoleReportGeneratorAdapter implements ReportGeneratorPort {
  constructor(private readonly logger: LoggerPort) {}

  async generateReport(result: AnalysisResult, format?: string): Promise<string> {
    const childLogger = this.logger.child({
      format: format || 'console',
      totalSmells: result.totalSmells
    });

    childLogger.debug('Generating console report');

    if (result.isEmpty()) {
      return '✅ No anti-patterns detected! Your Angular code looks clean.';
    }

    const report = this.buildConsoleReport(result);

    childLogger.debug('Console report generated', { reportLength: report.length });

    return report;
  }

  private buildConsoleReport(result: AnalysisResult): string {
    let report = '🚨 Angular Anti-Pattern Detection Report\n';
    report += '='.repeat(50) + '\n\n';

    const severityCounts = result.getSeverityCounts();

    // Group by category
    const categoryGroups = this.groupByCategory(result);

    for (const [category, smells] of Object.entries(categoryGroups)) {
      report += `📂 ${category}\n`;
      report += '-'.repeat(30) + '\n';

      smells.forEach(smell => {
        const severityIcon = this.getSeverityIcon(smell.severity.toString());
        report += `${severityIcon} ${smell.smellType} (${smell.severity.toString()})\n`;
        report += `   📍 ${smell.location.toString()}\n`;
        report += `   💡 ${smell.message}\n`;
        report += `   🔧 ${smell.refactoring}\n\n`;
      });
    }

    // Summary
    report += '📊 Summary:\n';
    report += `   Total issues: ${result.totalSmells}\n`;
    report += `   Critical: ${severityCounts.CRITICAL || 0}\n`;
    report += `   High: ${severityCounts.HIGH || 0}\n`;
    report += `   Medium: ${severityCounts.MEDIUM || 0}\n`;
    report += `   Low: ${severityCounts.LOW || 0}\n\n`;

    // Footer
    report += '💡 Recommendations:\n';
    if (result.hasCriticalIssues) {
      report += '   🚨 Fix CRITICAL issues before merge\n';
    }
    if ((severityCounts.HIGH || 0) > 0) {
      report += '   ⚠️  Address HIGH priority issues in next sprint\n';
    }
    report += '   📚 Read: https://angular.dev/best-practices\n';

    return report;
  }

  private groupByCategory(result: AnalysisResult): Record<string, any[]> {
    return result.smells.reduce((groups, smell) => {
      const category = smell.category.toString();
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(smell);
      return groups;
    }, {} as Record<string, any[]>);
  }

  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return '🔴';
      case 'HIGH': return '🟠';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  }
}