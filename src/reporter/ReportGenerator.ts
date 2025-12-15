import { DetectionResult } from '../detector/AngularSmellDetector';

export class ReportGenerator {
  generate(results: DetectionResult[]): string {
    if (results.length === 0) {
      return '✅ No anti-patterns detected! Your Angular code looks clean.';
    }

    const grouped = this.groupByCategory(results);
    const severityCounts = this.countBySeverity(results);

    let report = '🚨 Angular Anti-Pattern Detection Report\n';
    report += '='.repeat(50) + '\n\n';

    // Detailed results by category
    for (const [category, categoryResults] of Object.entries(grouped)) {
      report += `📂 ${category}\n`;
      report += '-'.repeat(30) + '\n';

      categoryResults.forEach(result => {
        const severityIcon = this.getSeverityIcon(result.severity);
        report += `${severityIcon} ${result.smell} (${result.severity})\n`;
        report += `   📍 ${result.file}:${result.line}:${result.column}\n`;
        report += `   💡 ${result.message}\n`;
        report += `   🔧 ${result.refactoring}\n\n`;
      });
    }

    // Summary
    report += '📊 Summary:\n';
    report += `   Total issues: ${results.length}\n`;
    report += `   Critical: ${severityCounts.CRITICAL}\n`;
    report += `   High: ${severityCounts.HIGH}\n`;
    report += `   Medium: ${severityCounts.MEDIUM}\n`;
    report += `   Low: ${severityCounts.LOW}\n\n`;

    // Footer with recommendations
    report += '💡 Recommendations:\n';
    if (severityCounts.CRITICAL > 0) {
      report += '   🚨 Fix CRITICAL issues before merge\n';
    }
    if (severityCounts.HIGH > 0) {
      report += '   ⚠️  Address HIGH priority issues in next sprint\n';
    }
    report += '   📚 Read: https://angular.dev/best-practices\n';

    return report;
  }

  private groupByCategory(results: DetectionResult[]): Record<string, DetectionResult[]> {
    return results.reduce((groups, result) => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
      return groups;
    }, {} as Record<string, DetectionResult[]>);
  }

  private countBySeverity(results: DetectionResult[]): Record<string, number> {
    return results.reduce((counts, result) => {
      counts[result.severity] = (counts[result.severity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
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