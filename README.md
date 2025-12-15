# Angular Smells Detector

**Angular Static Analysis Tool** | **Angular Anti-Patterns** | **Angular Code Quality** | **Angular Performance** | **Angular Security** | **TypeScript** | **SSR** | **Signals** | **NgRx** | **Dependency Injection** | **Template Anti-Patterns** | **Accessibility** | **i18n**

Angular application static analysis tool based on formal Z-notation specifications from the anti-patterns catalog. Detects over 73+ architectural issues, security vulnerabilities, and performance problems in Angular projects.

**Keywords**: angular smells, angular anti-patterns, angular static analysis, angular code quality, angular performance, angular security, typescript analysis, angular signals, angular hydration, angular ngrx, angular dependency injection, angular best practices, angular linting, angular code review, angular architecture, angular refactoring, angular optimization, angular developer tools, frontend code quality, angular enterprise, angular large scale applications

## 🚀 Quick Start

Get up and running in seconds—analyze your Angular project for anti-patterns and code smells right from the command line.

### 1️⃣ Install (global, preferred)

```bash
npm install -g .
```

### 2️⃣ Analyze your project

```bash
angular-smells /path/to/your/angular/project
```

### 3️⃣ (Alternatively) Run via npm script (local install)

```bash
npm install
npm run start /path/to/your/angular/project
```

### 4️⃣ (Advanced) Direct node execution

```bash
node dist/presentation/cli/cli.js ./path/to/project --format console --min-severity CRITICAL
```

---

Want help?
```bash
angular-smells --help
```

Check your version:
```bash
angular-smells --version
```

## ✨ Key Features

- **🔍 73+ anti-pattern detectors** - Complete coverage of Angular architectural issues including 16+ template anti-patterns
- **📊 Formal Z-notation specifications** - Mathematically precise detection
- **🎯 4 severity levels** - Fix prioritization (Critical/High/Medium/Low)
- **⚡ High performance** - Fast analysis of large codebases
- **🔧 Automated refactorings** - Fix suggestions
- **📈 Modern features support** - Angular 16+, Signals, SSR, NgRx, Zoneless

## 📊 Example Output

```
🔍 Scanning Angular project for anti-patterns...

🚨 Angular Anti-Pattern Detection Report
==================================================

📊 Summary:
   Total issues: 6
   Critical: 3
   High: 3

📂 Template & Rendering
------------------------------
🔴 UNSAFE_INNER_HTML (CRITICAL)
   📍 /path/to/component.html:1:1
   💡 Unsafe innerHTML binding - XSS vulnerability
   🔧 Use Angular sanitization or avoid dynamic HTML

📂 Reactivity & Signals
------------------------------
🟠 SIGNAL_WRITE_IN_EFFECT (HIGH)
   📍 /path/to/component.ts:26:17
   💡 Signal write detected inside effect - potential infinite loop
   🔧 Use computed() for derived state or untracked() for read-only access
```

## 📋 What it Detects

### Template & Rendering Anti-Patterns
- **ASYNC_PIPE_MULTIPLE_SUBSCRIPTIONS**: Multiple async pipe subscriptions to same observable
- **COMPLEX_TEMPLATE_LOGIC**: Complex calculations and method calls in template expressions
- **CONTROL_FLOW_DEPRECATED**: Deprecated *ngIf/*ngFor directives
- **DEFER_ABOVE_FOLD**: @defer used on above-the-fold content
- **DEFER_ERROR_BLOCKS**: @defer without @error blocks
- **DEFER_NON_STANDALONE**: @defer in non-standalone components
- **FORM_STATE_NOT_CLEARED**: Forms not reset after successful submission
- **HEAVY_COMPUTATION_PIPES**: Expensive computations in pipe transforms
- **HYDRATION_INVALID_HTML**: DOM manipulation during hydration
- **HYDRATION_MISMATCH**: DOM mismatches during SSR hydration
- **HYDRATION_MISSING_EVENT_REPLAY**: HostListener without event replay
- **HYDRATION_INCREMENTAL_TRIGGER**: Incremental hydration without triggers
- **IMPURE_TEMPLATE_CALL**: Function calls in template expressions
- **LARGE_LIST_WITHOUT_VIRTUALIZATION**: Large lists without virtualization
- **MISSING_ACCESSIBILITY_ATTRIBUTES**: Form inputs without proper labels/ARIA
- **MISSING_TRACKBY**: Missing trackBy functions in ngFor
- **NESTED_NGIF**: Deeply nested *ngIf for null checks
- **NGIF_NGFOR_SAME_ELEMENT**: *ngIf and *ngFor on same element
- **NO_COMPONENT_ENCAPSULATION**: Missing ViewEncapsulation settings
- **NO_I18N_INTEGRATION**: Hardcoded user-facing text without i18n
- **NO_ONPUSH_STRATEGY**: Components not using OnPush change detection
- **NULL_SAFETY**: Unsafe property access without safe navigation
- **TEMPLATE_DRIVEN_COMPLEX_FORMS**: Complex forms using template-driven approach
- **TEMPLATE_METHOD_CALL**: Method calls in template bindings
- **TRUSTING_EXTERNAL_URLS**: External URL bindings without validation
- **TWO_WAY_BINDING_HEAVY_USE**: Excessive use of two-way binding
- **TWO_WAY_OBJECT_BINDING**: Two-way binding on nested object properties
- **UNSAFE_INNER_HTML**: XSS vulnerabilities through innerHTML

### Reactivity & Signals Anti-Patterns
- **MEMORY_LEAK_SUBSCRIPTION**: Memory leaks from uncleaned subscriptions
- **MISSING_ASYNC_PIPE**: Manual subscriptions instead of async pipe
- **NESTED_SUBSCRIPTION_HELL**: Nested subscriptions with memory leaks
- **SIGNAL_WRITE_IN_EFFECT**: Signal writes inside effects - infinite loops
- **SIGNALS_EFFECT_DERIVATION**: Effects used for derivation
- **SIGNALS_LINKEDSIGNAL_OVERUSE**: Excessive linkedSignal usage
- **SIGNALS_RESOURCE_RACE**: Resource without abort signal
- **SUBJECT_MISUSE**: Public Subject exposure
- **SWITCHMAP_DATA_LOSS**: switchMap causing data loss
- **UNTRACKED_SIGNAL_READ**: Signal reads without untracked() in effects

### Forms & Validation Anti-Patterns
- **FORMS_MIXED**: Mixing template-driven and reactive forms
- **FORMS_TYPED**: Untyped FormControl usage
- **FORMS_VALUE_CHANGES**: Form subscriptions without cleanup

### Architecture & Dependency Injection
- **CIRCULAR_DEPENDENCY_INJECTION**: Circular dependencies between services
- **GOD_STANDALONE_COMPONENT**: Components with excessive imports/LOC
- **PROVIDER_POLLUTION**: Root services in component providers
- **SMART_DUMB_VIOLATION**: Components mixing data access and presentation

### State Management Anti-Patterns
- **BROAD_SELECTORS**: NgRx selectors returning excessive data
- **ENTITY_DUPLICATION**: Entity duplication in NgRx state
- **NGRX_EFFECTS_ISSUES**: Effect dispatch configuration issues
- **NGRX_MISSING_MEMOIZATION**: Selectors without memoization
- **NGRX_NON_NORMALIZED_STATE**: Non-normalized state structure
- **NGRX_OVER_SELECTING**: Excessive selector usage
- **NGRX_STATE_MUTATION**: Direct state mutation in reducers

### Performance & Bundle Metrics
- **INITIAL_BUNDLE_BUDGET_EXCEEDED**: Bundle size budget exceeded
- **ONPUSH_MISUSE**: Array mutation in OnPush components
- **ROUTING_LAZY_LOADING**: Feature routes without lazy loading
- **ZONE_POLLUTION**: Libraries triggering Change Detection
- **ZONLESS_NGZONE_STABLE**: NgZone usage in zoneless apps
- **ZONLESS_OBSERVABLE_SUBSCRIPTIONS**: Observable subscriptions in zoneless apps
- **ZONLESS_TIMER_UPDATES**: Timers without change detection in zoneless

### Routing & Navigation Anti-Patterns
- **ROUTING_FUNCTIONAL_GUARDS**: Class-based instead of functional guards
- **ROUTING_GUARDS**: Guards with constructor injection
- **ROUTING_INPUT_BINDING**: Manual route params subscription
- **ROUTING_ORDER**: Routes defined after wildcard route

### Testing Anti-Patterns
- **TESTING_ASYNC**: Deprecated async() wrapper in tests
- **TESTING_DEFER_BEHAVIOR**: Defer blocks without proper test setup
- **TESTING_FAKEASYNC_ZONLESS**: fakeAsync with zoneless change detection
- **TESTING_FLUSH_EFFECTS**: Signal effects without flushEffects in tests
- **TESTING_IMPLEMENTATION**: Testing implementation details
- **TESTING_SIGNAL_INPUT_MUTATION**: Signal input mutation in tests
- **TESTING_TESTBED**: Manual service instantiation in tests
- **TESTING_ZONLESS_OBSERVABLE_SUBSCRIPTIONS**: Observable subscriptions in zoneless tests

### TypeScript Anti-Patterns
- **TYPESCRIPT_ANY**: Usage of any type
- **TYPESCRIPT_NON_NULL**: Non-null assertion operator usage

## 🏗️ Architecture

```
src/
├── index.ts                 # Entry point
├── scanner/
│   └── FileScanner.ts       # File scanning and classification
├── parser/
│   └── TemplateParser.ts    # AST parsing of Angular templates
├── detector/
│   └── AngularSmellDetector.ts  # Anti-pattern detection
├── reporter/
│   └── ReportGenerator.ts   # Report generation with severity
└── template-tests/          # Test cases for template anti-patterns
    ├── bad.component.ts     # Anti-pattern examples
    ├── good.component.ts    # Correct implementation examples
    └── README.md           # Test documentation
```

## 🧪 Template Tests

The `template-tests/` directory contains comprehensive test cases for all template anti-patterns:

```
template-tests/
├── README.md                    # Test documentation
├── nested-ngif/                # Nested *ngIf anti-patterns
│   ├── bad.component.ts        # Anti-pattern example
│   └── good.component.ts       # Correct implementation
├── trusting-external-urls/     # Security vulnerabilities
├── complex-template-logic/     # Performance issues
└── [16 more test folders]      # Complete coverage
```

Each test folder contains:
- **`bad.component.ts`**: Demonstrates the anti-pattern with inline template
- **`good.component.ts`**: Shows the correct, modern Angular implementation
- **Detection validation**: All examples are automatically tested by the detector

Run tests: `npm run start template-tests`

## 🔧 Technical Stack

- **TypeScript Compiler API** - parsing components and services
- **Angular Compiler** - template and directive analysis
- **@angular-eslint** - ESLint rules integration
- **Fast-glob** - efficient file scanning
- **Formal Methods** - Z-notation predicates for precise detection

## 🎯 Supported Technologies

- **Angular 16+** - Standalone Components, Signals, Control Flow, Defer, Zoneless
- **TypeScript 4.9+** - Advanced type analysis, strict mode patterns
- **NgRx Store** - State management patterns, effects, selectors
- **RxJS** - Reactive programming patterns, operators misuse
- **SSR/Hydration** - Server-side rendering, hydration patterns
- **Angular Forms** - Template-driven vs Reactive forms validation
- **Angular Router** - Routing patterns, guards, lazy loading
- **Testing** - Angular testing utilities, best practices
- **SCAM Architecture** - Single Component Angular Modules

## 📋 Full List of Detectable Anti-Patterns

| Anti-Pattern | Category | Severity | Description |
|-------------|-----------|----------|----------|
| `ASYNC_PIPE_MULTIPLE_SUBSCRIPTIONS` | Template & Rendering | 🟠 HIGH | Multiple async pipe subscriptions to same observable |
| `CIRCULAR_DEPENDENCY_INJECTION` | Architecture & Dependency Injection | 🔴 CRITICAL | Circular dependencies between services |
| `ENTITY_DUPLICATION` | State Management | 🔴 CRITICAL | Entity duplication in NgRx state |
| `FORMS_MIXED` | Forms & Validation | 🔴 CRITICAL | Mixing template-driven and reactive forms |
| `HYDRATION_INVALID_HTML` | Template & Rendering | 🔴 CRITICAL | DOM manipulation during hydration |
| `HYDRATION_MISMATCH` | Template & Rendering | 🔴 CRITICAL | DOM mismatches during SSR hydration |
| `MEMORY_LEAK_SUBSCRIPTION` | Reactivity & Signals | 🔴 CRITICAL | Memory leaks from uncleaned subscriptions |
| `NESTED_SUBSCRIPTION_HELL` | Reactivity & Signals | 🔴 CRITICAL | Nested subscriptions with memory leaks |
| `NGRX_STATE_MUTATION` | State Management | 🔴 CRITICAL | Direct state mutation in reducers |
| `PROVIDER_POLLUTION` | Architecture & Dependency Injection | 🔴 CRITICAL | Root services in component providers |
| `ROUTING_ORDER` | Routing & Navigation | 🔴 CRITICAL | Routes defined after wildcard route |
| `UNSAFE_INNER_HTML` | Template & Rendering | 🔴 CRITICAL | XSS vulnerabilities through innerHTML |
| `TRUSTING_EXTERNAL_URLS` | Template & Rendering | 🟠 HIGH | External URL bindings without validation |
| `DEFER_ABOVE_FOLD` | Performance & Bundle Metrics | 🟠 HIGH | @defer used on above-the-fold content |
| `DEFER_NON_STANDALONE` | Architecture & Dependency Injection | 🟠 HIGH | @defer in non-standalone components |
| `FORMS_VALUE_CHANGES` | Forms & Validation | 🟠 HIGH | Form subscriptions without cleanup |
| `IMPURE_TEMPLATE_CALL` | Template & Rendering | 🟠 HIGH | Function calls in template expressions |
| `INITIAL_BUNDLE_BUDGET_EXCEEDED` | Performance & Bundle Metrics | 🟠 HIGH | Bundle size budget exceeded |
| `NGRX_EFFECTS_ISSUES` | State Management | 🟠 HIGH | Effect dispatch configuration issues |
| `NGRX_NON_NORMALIZED_STATE` | State Management | 🟠 HIGH | Non-normalized state structure |
| `ONPUSH_MISUSE` | Performance & Bundle Metrics | 🟠 HIGH | Array mutation in OnPush components |
| `ROUTING_GUARDS` | Routing & Navigation | 🟠 HIGH | Guards with constructor injection |
| `SIGNAL_WRITE_IN_EFFECT` | Reactivity & Signals | 🟠 HIGH | Signal writes inside effects - infinite loops |
| `SIGNALS_EFFECT_DERIVATION` | Reactivity & Signals | 🟠 HIGH | Effects used for derivation |
| `TEMPLATE_METHOD_CALL` | Template & Rendering | 🟠 HIGH | Method calls in template bindings |
| `TESTING_FAKEASYNC_ZONLESS` | Testing | 🟠 HIGH | fakeAsync with zoneless change detection |
| `TESTING_SIGNAL_INPUT_MUTATION` | Testing | 🟠 HIGH | Signal input mutation in tests |
| `UNTRACKED_SIGNAL_READ` | Reactivity & Signals | 🟠 HIGH | Signal reads without untracked() in effects |
| `ZONE_POLLUTION` | Performance & Bundle Metrics | 🟠 HIGH | Libraries triggering Change Detection |
| `ZONLESS_NGZONE_STABLE` | Performance & Bundle Metrics | 🟠 HIGH | NgZone usage in zoneless apps |
| `ZONLESS_TIMER_UPDATES` | Performance & Bundle Metrics | 🟠 HIGH | Timers without change detection in zoneless |
| `COMPLEX_TEMPLATE_LOGIC` | Template & Rendering | 🟠 HIGH | Complex calculations in template expressions |
| `TWO_WAY_OBJECT_BINDING` | Template & Rendering | 🟠 HIGH | Two-way binding on nested object properties |
| `BROAD_SELECTORS` | State Management | 🟡 MEDIUM | NgRx selectors returning excessive data |
| `CONTROL_FLOW_DEPRECATED` | Template & Rendering | 🟡 MEDIUM | Deprecated *ngIf/*ngFor directives |
| `DEFER_ERROR_BLOCKS` | Template & Rendering | 🟡 MEDIUM | @defer without @error blocks |
| `FORM_STATE_NOT_CLEARED` | Template & Rendering | 🟡 MEDIUM | Forms not reset after successful submission |
| `HEAVY_COMPUTATION_PIPES` | Template & Rendering | 🟡 MEDIUM | Expensive computations in pipe transforms |
| `MISSING_ACCESSIBILITY_ATTRIBUTES` | Template & Rendering | 🟡 MEDIUM | Form inputs without proper labels/ARIA |
| `NESTED_NGIF` | Template & Rendering | 🟡 MEDIUM | Deeply nested *ngIf for null checks |
| `NGIF_NGFOR_SAME_ELEMENT` | Template & Rendering | 🟡 MEDIUM | *ngIf and *ngFor on same element |
| `NO_COMPONENT_ENCAPSULATION` | Template & Rendering | 🟡 MEDIUM | Missing ViewEncapsulation settings |
| `NO_I18N_INTEGRATION` | Template & Rendering | 🟡 MEDIUM | Hardcoded user-facing text without i18n |
| `NO_ONPUSH_STRATEGY` | Template & Rendering | 🟡 MEDIUM | Components not using OnPush change detection |
| `NULL_SAFETY` | Template & Rendering | 🟡 MEDIUM | Unsafe property access without safe navigation |
| `TEMPLATE_DRIVEN_COMPLEX_FORMS` | Template & Rendering | 🟡 MEDIUM | Complex forms using template-driven approach |
| `TWO_WAY_BINDING_HEAVY_USE` | Template & Rendering | 🟡 MEDIUM | Excessive use of two-way binding |
| `FORMS_TYPED` | Forms & Validation | 🟡 MEDIUM | Untyped FormControl usage |
| `HYDRATION_INCREMENTAL_TRIGGER` | Performance & Bundle Metrics | 🟡 MEDIUM | Incremental hydration without triggers |
| `HYDRATION_MISSING_EVENT_REPLAY` | Template & Rendering | 🟡 MEDIUM | HostListener without event replay |
| `MISSING_ASYNC_PIPE` | Reactivity & Signals | 🟡 MEDIUM | Manual subscriptions instead of async pipe |
| `NGRX_MISSING_MEMOIZATION` | State Management | 🟡 MEDIUM | Selectors without memoization |
| `NGRX_OVER_SELECTING` | State Management | 🟡 MEDIUM | Excessive selector usage |
| `ROUTING_FUNCTIONAL_GUARDS` | Routing & Navigation | 🟡 MEDIUM | Class-based instead of functional guards |
| `ROUTING_INPUT_BINDING` | Routing & Navigation | 🟡 MEDIUM | Manual route params subscription |
| `ROUTING_LAZY_LOADING` | Performance & Bundle Metrics | 🟡 MEDIUM | Feature routes without lazy loading |
| `SIGNALS_LINKEDSIGNAL_OVERUSE` | Reactivity & Signals | 🟡 MEDIUM | Excessive linkedSignal usage |
| `SIGNALS_RESOURCE_RACE` | Reactivity & Signals | 🟡 MEDIUM | Resource without abort signal |
| `SMART_DUMB_VIOLATION` | Architecture & Dependency Injection | 🟡 MEDIUM | Components mixing data access and presentation |
| `SUBJECT_MISUSE` | Reactivity & Signals | 🟡 MEDIUM | Public Subject exposure |
| `SWITCHMAP_DATA_LOSS` | Reactivity & Signals | 🟡 MEDIUM | switchMap causing data loss |
| `TESTING_DEFER_BEHAVIOR` | Testing | 🟡 MEDIUM | Defer blocks without proper test setup |
| `TESTING_FLUSH_EFFECTS` | Testing | 🟡 MEDIUM | Signal effects without flushEffects in tests |
| `TESTING_TESTBED` | Testing | 🟡 MEDIUM | Manual service instantiation in tests |
| `TESTING_ZONLESS_OBSERVABLE_SUBSCRIPTIONS` | Testing | 🟡 MEDIUM | Observable subscriptions in zoneless tests |
| `TYPESCRIPT_ANY` | TypeScript | 🟡 MEDIUM | Usage of any type |
| `TYPESCRIPT_NON_NULL` | TypeScript | 🟡 MEDIUM | Non-null assertion operator usage |
| `ZONLESS_OBSERVABLE_SUBSCRIPTIONS` | Performance & Bundle Metrics | 🟡 MEDIUM | Observable subscriptions in zoneless apps |
| `TESTING_ASYNC` | Testing | 🟢 LOW | Deprecated async() wrapper in tests |
| `TESTING_IMPLEMENTATION` | Testing | 🟢 LOW | Testing implementation details |

## 🔧 API

### FileScanner
```typescript
const scanner = new FileScanner();
const files = await scanner.scanProject('/path/to/project');
```

### AngularSmellDetector
```typescript
const detector = new AngularSmellDetector();
const results = await detector.analyzeFiles(files);
```

### ReportGenerator
```typescript
const reporter = new ReportGenerator();
const report = reporter.generate(results);
```

## 📊 Formal Predicates

The tool implements predicates from the formal catalog:

```typescript
// Example: IMPURE_TEMPLATE_CALL
IMPURE_TEMPLATE_CALL(e) ≜ e ∈ Bindings ∧ isCallExpression(e) ∧ ¬isSignal(e) ∧ ¬isPurePipe(e)
```

## 🎯 Severity Levels

- **CRITICAL**: Fix before merge (security, performance)
- **HIGH**: Fix in the next sprint
- **MEDIUM**: Plan in refactoring
- **LOW**: Optional improvements

## 🔮 Future Improvements

- [x] Full Angular template parsing
- [x] **16+ Template anti-pattern detectors** (security, performance, accessibility)
- [x] Template test suite with bad/good examples
- [x] NgRx store analysis (Entity Duplication, Broad Selectors)
- [x] Component complexity metrics (Cyclomatic Complexity, LOC)
- [x] Extended memory leak detection
- [x] Angular Signals analysis (effects, computed, linkedSignal)
- [x] Control Flow syntax migration detection
- [x] Defer blocks analysis
- [x] Forms validation patterns
- [x] Hydration and SSR analysis
- [x] Routing patterns and guards
- [x] TypeScript strict type checking
- [x] Testing best practices
- [x] Zoneless change detection patterns
- [ ] ESLint integration
- [ ] CI/CD integration
- [ ] IDE plugin
- [ ] Bundle analyzer integration

## 📚 References

- [Angular Style Guide](https://angular.dev/best-practices) - Official Angular recommendations
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint) - Linting rules for Angular
- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) - TypeScript code analysis
- [Angular Signals](https://angular.dev/guide/signals) - Next-generation reactivity
- [NgRx Best Practices](https://ngrx.io/guide/store) - State management patterns
- [Angular Performance](https://angular.dev/best-practices/runtime-performance) - Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests
4. Create a Pull Request

## 📄 License

MIT License