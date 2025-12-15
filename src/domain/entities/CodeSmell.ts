import { Severity } from '../value-objects/Severity';
import { Location } from '../value-objects/Location';
import { Category } from '../value-objects/Category';

/**
 * Entity representing a detected code smell in Angular code.
 * Contains all the information about a specific anti-pattern violation.
 */
export class CodeSmell {
  constructor(
    private readonly _id: string,
    private readonly _smellType: string,
    private readonly _severity: Severity,
    private readonly _location: Location,
    private readonly _message: string,
    private readonly _refactoring: string,
    private readonly _category: Category,
    private readonly _metadata?: Record<string, any>
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id.trim()) {
      throw new Error('Code smell ID cannot be empty');
    }
    if (!this.smellType.trim()) {
      throw new Error('Smell type cannot be empty');
    }
    if (!this.message.trim()) {
      throw new Error('Message cannot be empty');
    }
    if (!this.refactoring.trim()) {
      throw new Error('Refactoring advice cannot be empty');
    }
  }

  get id(): string {
    return this._id;
  }

  get smellType(): string {
    return this._smellType;
  }

  get severity(): Severity {
    return this._severity;
  }

  get location(): Location {
    return this._location;
  }

  get message(): string {
    return this._message;
  }

  get refactoring(): string {
    return this._refactoring;
  }

  get category(): Category {
    return this._category;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  isCritical(): boolean {
    return this.severity.isCritical();
  }

  hasHigherSeverityThan(other: CodeSmell): boolean {
    return this.severity.isHigherThan(other.severity);
  }

  equals(other: CodeSmell): boolean {
    return this.id === other.id;
  }

  toString(): string {
    return `${this.severity.toString()} ${this.smellType} at ${this.location.toString()}`;
  }
}