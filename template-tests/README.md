# Angular Template Anti-Pattern Tests

This directory contains test examples demonstrating Angular template anti-patterns and their correct implementations. Each subfolder represents a specific anti-pattern category and contains `bad.*` and `good.*` files showing the problematic approach and the recommended solution.

## Structure

Each anti-pattern folder follows the same structure:
- `bad.component.ts` - Example of the anti-pattern
- `good.component.ts` - Correct implementation following best practices

## Anti-Pattern Categories

### 1. STRUCTURAL DIRECTIVES
- **nested-ngif** - Deeply nested `*ngIf` for null checks
- **ngif-ngfor-same-element** - Combining `*ngIf` and `*ngFor` on same element
- **missing-trackby** - `*ngFor` without `trackBy` function

### 2. DATA BINDING & EXPRESSIONS
- **complex-template-logic** - Complex calculations in templates
- **two-way-object-binding** - `[(ngModel)]` with nested object properties
- **null-safety** - Missing null checks with `strictTemplates: false`

### 3. FORMS
- **template-driven-complex-forms** - Template-driven forms for complex scenarios
- **form-state-not-cleared** - Forms not reset after successful submission

### 4. PIPES
- **heavy-computation-pipes** - Impure pipes with expensive computations
- **async-pipe-multiple-subscriptions** - Multiple async pipe subscriptions to same observable

### 5. LISTS & RENDERING PERFORMANCE
- **large-lists-no-virtual-scroll** - Rendering all items without virtual scrolling
- **no-onpush-strategy** - Missing `ChangeDetectionStrategy.OnPush`

### 6. COMPONENT INTERACTION
- **two-way-binding-heavy-use** - Excessive two-way binding between components
- **no-component-encapsulation** - Missing `ViewEncapsulation` settings

### 7. INTERNATIONALIZATION & ACCESSIBILITY
- **no-i18n-integration** - Hardcoded strings without i18n
- **missing-accessibility-attributes** - Missing ARIA attributes and semantic HTML

### 8. SECURITY
- **no-domsanitizer-innerhtml** - User HTML bound without sanitization
- **trusting-external-urls** - External URLs bound without validation

## Usage

These examples are designed to:
1. **Demonstrate anti-patterns** - Show common mistakes developers make
2. **Provide correct solutions** - Illustrate best practices and modern Angular patterns
3. **Support code reviews** - Help identify and fix template issues
4. **Enable testing** - Test both anti-patterns and correct implementations

## Modern Angular Best Practices Covered

- **Signals and computed properties** (v17+)
- **Control flow syntax** (`@if`, `@for`)
- **ChangeDetectionStrategy.OnPush**
- **Strict templates and type safety**
- **Reactive Forms**
- **Virtual scrolling**
- **Accessibility (a11y) compliance**
- **Security best practices**

## Related Documentation

See `docs/templates/angular-template-antipatterns.md` for detailed explanations of each anti-pattern, consequences, and migration guides.