/**
 * Value Object representing the category of a code smell.
 * Immutable and follows value object semantics.
 */
export class Category {
  private constructor(private readonly _value: string) {}

  static TEMPLATE_RENDERING = new Category('Template & Rendering');
  static ARCHITECTURE_DEPENDENCY_INJECTION = new Category('Architecture & Dependency Injection');
  static REACTIVITY_SIGNALS = new Category('Reactivity & Signals');
  static STATE_MANAGEMENT = new Category('State Management');
  static PERFORMANCE_BUNDLE_METRICS = new Category('Performance & Bundle Metrics');
  static FORMS_VALIDATION = new Category('Forms & Validation');
  static TYPESCRIPT = new Category('TypeScript');
  static ROUTING_NAVIGATION = new Category('Routing & Navigation');
  static TESTING = new Category('Testing');

  static fromString(value: string): Category {
    switch (value) {
      case 'Template & Rendering': return Category.TEMPLATE_RENDERING;
      case 'Architecture & Dependency Injection': return Category.ARCHITECTURE_DEPENDENCY_INJECTION;
      case 'Reactivity & Signals': return Category.REACTIVITY_SIGNALS;
      case 'State Management': return Category.STATE_MANAGEMENT;
      case 'Performance & Bundle Metrics': return Category.PERFORMANCE_BUNDLE_METRICS;
      case 'Forms & Validation': return Category.FORMS_VALIDATION;
      case 'TypeScript': return Category.TYPESCRIPT;
      case 'Routing & Navigation': return Category.ROUTING_NAVIGATION;
      case 'Testing': return Category.TESTING;
      default: throw new Error(`Invalid category: ${value}`);
    }
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Category): boolean {
    return this._value === other._value;
  }
}