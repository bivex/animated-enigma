/**
 * Value Object representing the severity level of a code smell.
 * Immutable and follows value object semantics.
 */
export class Severity {
  private constructor(private readonly _value: string) {}

  static CRITICAL = new Severity('CRITICAL');
  static HIGH = new Severity('HIGH');
  static MEDIUM = new Severity('MEDIUM');
  static LOW = new Severity('LOW');

  static fromString(value: string): Severity {
    switch (value.toUpperCase()) {
      case 'CRITICAL': return Severity.CRITICAL;
      case 'HIGH': return Severity.HIGH;
      case 'MEDIUM': return Severity.MEDIUM;
      case 'LOW': return Severity.LOW;
      default: throw new Error(`Invalid severity: ${value}`);
    }
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  get priority(): number {
    switch (this._value) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }

  isHigherThan(other: Severity): boolean {
    return this.priority > other.priority;
  }

  isCritical(): boolean {
    return this === Severity.CRITICAL;
  }

  equals(other: Severity): boolean {
    return this._value === other._value;
  }
}