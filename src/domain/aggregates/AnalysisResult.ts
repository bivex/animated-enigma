import { CodeSmell } from '../entities/CodeSmell';
import { Severity } from '../value-objects/Severity';
import { Category } from '../value-objects/Category';

/**
 * Aggregate representing the complete result of analyzing an Angular project.
 * Encapsulates all detected code smells and provides aggregate operations.
 */
export class AnalysisResult {
  constructor(
    private readonly _projectPath: string,
    private readonly _smells: CodeSmell[],
    private readonly _analysisTimestamp: Date,
    private readonly _duration: number
  ) {}

  get projectPath(): string {
    return this._projectPath;
  }

  get smells(): CodeSmell[] {
    return [...this._smells]; // Return defensive copy
  }

  get analysisTimestamp(): Date {
    return new Date(this._analysisTimestamp); // Return defensive copy
  }

  get duration(): number {
    return this._duration;
  }

  get totalSmells(): number {
    return this.smells.length;
  }

  get hasCriticalIssues(): boolean {
    return this.smells.some(smell => smell.isCritical());
  }

  getSmellsBySeverity(severity: Severity): CodeSmell[] {
    return this._smells.filter(smell => smell.severity.equals(severity));
  }

  getSmellsByCategory(category: Category): CodeSmell[] {
    return this._smells.filter(smell => smell.category.equals(category));
  }

  getSeverityCounts(): Record<string, number> {
    return this._smells.reduce((counts, smell) => {
      const severity = smell.severity.toString();
      counts[severity] = (counts[severity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  getCategoryCounts(): Record<string, number> {
    return this._smells.reduce((counts, smell) => {
      const category = smell.category.toString();
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  getHighestSeverity(): Severity | null {
    if (this._smells.length === 0) return null;

    return this._smells.reduce((highest, smell) => {
      return smell.severity.isHigherThan(highest) ? smell.severity : highest;
    }, this._smells[0].severity);
  }

  isEmpty(): boolean {
    return this._smells.length === 0;
  }
}