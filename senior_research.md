# Angular 18-21 Anti-Patterns: A Senior Engineer's Comprehensive Catalog

Angular's rapid evolution from version 18 through 21 introduced transformative features—Signals, zoneless change detection, incremental hydration, and built-in control flow—each bringing new categories of anti-patterns. This catalog documents **empirically validated** pitfalls with detection predicates, severity classifications, and quantitative thresholds derived from official Angular documentation, GitHub issues, and production case studies.

## Signals architecture: the reactive foundation's hidden traps

Angular Signals, stabilized in v17 and enhanced through v21, represent a paradigm shift in reactivity. However, **misuse patterns account for a significant portion of Signal-related GitHub issues**, with infinite loops and improper effect usage being the most critical.

### Signal write-in-effect infinite loops (Critical)

The most severe Signal anti-pattern involves writing to signals within effects that read those same signals, creating infinite execution cycles.

**Detection predicate:** Effect containing `.set()`, `.update()`, or `.mutate()` calls on signals that are also read within the same effect body. Angular now disallows this by default, requiring explicit `allowSignalWrites: true` to override.

```typescript
// ❌ ANTI-PATTERN: Causes NG0600 error, potential browser freeze
effect(() => {
  if (this.count() < 10) {
    this.count.update(c => c + 1); // Infinite loop!
  }
});

// ✅ CORRECT: Use computed for derived state
const isUnderLimit = computed(() => this.count() < 10);
incrementCount() {
  if (this.isUnderLimit()) this.count.update(c => c + 1);
}
```

**Quantitative threshold:** Any signal write within an effect reading that signal triggers this anti-pattern. Impact includes memory exhaustion and complete browser freeze within milliseconds.

### Effect for synchronous state derivation (High)

Using effects for state derivation rather than `computed()` causes timing issues and performance degradation. Effects run asynchronously, while computed signals provide synchronous, automatically-memoized values.

**Detection predicate:** Effect body only sets other signals based on reading source signals, with no DOM manipulation, logging, or external API calls.

```typescript
// ❌ ANTI-PATTERN: Effect for derivation
effect(() => {
  this.finalPrice.set(this.price() * (1 - this.discount()));
}, { allowSignalWrites: true });

// ✅ CORRECT: Computed for derived values
readonly finalPrice = computed(() => this.price() * (1 - this.discount()));
```

**Quantitative impact:** Computed signals provide approximately **40% better performance** than effect-based derivation according to community benchmarks, due to synchronous execution and automatic memoization.

### LinkedSignal overuse in Angular 19+ (Medium)

`linkedSignal()`, introduced in Angular 19, enables writable derived signals but is frequently misused when `computed()` would suffice.

**Detection predicate:** `linkedSignal()` usage where `.set()` is never called on the resulting signal.

```typescript
// ❌ ANTI-PATTERN: linkedSignal when never manually written
const doubled = linkedSignal(() => this.count() * 2); // Never calling .set()

// ✅ CORRECT: Use computed for read-only derivation
const doubled = computed(() => this.count() * 2);

// ✅ CORRECT: linkedSignal for resettable selection
const selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
  source: this.shippingOptions,
  computation: (options, previous) => 
    previous && options.includes(previous.value) ? previous.value : options[0]
});
```

### Resource API race conditions in Angular 19+ (High)

The experimental `resource()` API for async data fetching requires proper abort signal handling to prevent race conditions when parameters change rapidly.

**Detection predicate:** Resource loader function that ignores the `abortSignal` parameter.

```typescript
// ❌ ANTI-PATTERN: Ignoring abort signal causes race conditions
const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params }) => fetch(`/api/users/${params.id}`).then(r => r.json())
});

// ✅ CORRECT: Propagate abort signal
const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params, abortSignal }) => 
    fetch(`/api/users/${params.id}`, { signal: abortSignal }).then(r => r.json())
});
```

**Impact:** Without abort signal handling, rapid parameter changes display stale data as earlier requests complete after later ones.

## Hydration anti-patterns: bridging server and client

Angular's hydration system, stable since v17 with incremental hydration added in v19, enables progressive enhancement of server-rendered content. However, **DOM mismatches between server and client remain the most common source of hydration failures**.

### Server/client DOM structure mismatches (Critical)

Any difference between server-rendered DOM and client expectations causes hydration errors (NG0500), potentially triggering destructive re-renders that eliminate SSR benefits.

**Detection predicate:** Platform-conditional rendering using `isPlatformServer()` or `isPlatformBrowser()` in templates that produces different DOM structures.

```typescript
// ❌ ANTI-PATTERN: Different content on server vs client
@if (isPlatformServer) {
  <div>Server content</div>
} @else {
  <div>Client content</div>  // Different structure triggers NG0500
}

// ✅ CORRECT: Same structure, dynamic content
<div>{{ dynamicContent }}</div>
constructor() {
  afterNextRender(() => this.dynamicContent = 'Updated after hydration');
}
```

**Quantitative impact:** Proper hydration delivers **32% better FCP** (from 2.2s to 1.5s) and **61% better LCP** (from 3.8s to 1.5s) according to Angular Architects benchmarks.

### Invalid HTML nesting causing destructive hydration (High)

Browser auto-correction of invalid HTML creates DOM differences between server serialization and client parsing. Common violations include `<div>` inside `<p>`, nested `<a>` tags, and tables without explicit `<tbody>`.

**Detection predicate:** HTML validation errors for nested anchors, block elements in inline elements, or tables missing `<tbody>`.

```html
<!-- ❌ ANTI-PATTERN: Browser auto-inserts <tbody> -->
<table>
  <tr><td>Data</td></tr>
</table>

<!-- ✅ CORRECT: Explicit tbody prevents mismatch -->
<table>
  <tbody>
    <tr><td>Data</td></tr>
  </tbody>
</table>
```

### Missing event replay in Angular 18+ (High)

Before event replay was introduced, user interactions during the "uncanny valley" between HTML visibility and full hydration were lost. Angular 18+ provides `withEventReplay()` to capture and replay these events.

**Detection predicate:** `provideClientHydration()` without `withEventReplay()` in Angular 18-19 applications.

```typescript
// ❌ ANTI-PATTERN: Lost user interactions during hydration
bootstrapApplication(App, { providers: [provideClientHydration()] });

// ✅ CORRECT: Enable event replay (auto-included with incremental hydration in v19+)
bootstrapApplication(App, { 
  providers: [provideClientHydration(withEventReplay())] 
});
```

### Incremental hydration trigger misconfiguration in Angular 19+ (Medium-High)

Incremental hydration with `@defer` blocks requires proper hydrate triggers. Using `hydrate on immediate` for below-fold content or `hydrate never` for interactive components creates poor user experiences.

```typescript
// ❌ ANTI-PATTERN: hydrate never blocks entire interactive subtree
@defer (hydrate never) {
  <static-content />
  <interactive-form />  // Will NEVER hydrate!
}

// ✅ CORRECT: Separate static and interactive content
@defer (hydrate never) { <static-content /> }
@defer (hydrate on interaction) { <interactive-form /> }
```

**Quantitative impact:** Incremental hydration shows **45% better LCP** in Angular team lab tests for real-world applications.

## Deferrable views: lazy loading's double-edged sword

The `@defer` block syntax in Angular 17+ enables fine-grained lazy loading, but improper usage can **negate performance benefits or create user experience problems**.

### Deferring above-the-fold content (Critical)

Deferring components visible without scrolling causes visible layout shift and degrades Core Web Vitals, particularly CLS.

**Detection predicate:** Component wrapped in `@defer` that is visible in the viewport on initial page load, especially with triggers like `on immediate`, `on timer`, or `on viewport`.

```typescript
// ❌ ANTI-PATTERN: Hero section is above the fold
@defer (on viewport) {
  <app-hero-banner />
} @placeholder {
  <div class="placeholder">Loading...</div>
}

// ✅ CORRECT: Eagerly load above-fold, defer below-fold
<app-hero-banner />
@defer (on viewport) {
  <app-testimonials />
}
```

**Quantitative impact:** Can increase CLS by **0.1-0.5+** and degrade LCP by **100-500ms**. Google recommends CLS < 0.1 for good user experience.

### Non-standalone components in @defer blocks (Critical)

Components inside `@defer` must be standalone. Non-standalone components are **silently included in the main bundle**, completely defeating lazy loading.

**Detection predicate:** Component inside `@defer` without `standalone: true` in its decorator.

```typescript
// ❌ ANTI-PATTERN: Non-standalone component (still eagerly loaded!)
@Component({ selector: 'app-heavy-chart', template: `...` })
export class HeavyChartComponent {}

// ✅ CORRECT: Standalone enables deferral
@Component({ 
  selector: 'app-heavy-chart',
  standalone: true,
  imports: [ChartLibraryModule],
  template: `...`
})
export class HeavyChartComponent {}
```

**Quantitative impact:** Real-world case studies show main bundle reduction from **583KB to 450KB** when properly deferring standalone components.

### Over-deferring small components (Medium)

Deferring tiny components (< 5KB) adds HTTP request overhead that exceeds bundle size savings.

**Detection predicate:** Deferred component chunk size below 5KB; multiple micro-deferred components causing request waterfalls.

**Quantitative threshold:** Only defer components > **50KB**. Each HTTP request adds 50-200ms latency that may exceed savings from small component deferral.

### Missing @error blocks for network resilience (High)

Not handling loading failures leaves users with no feedback when network issues occur, triggering Angular error NG0750.

```typescript
// ❌ ANTI-PATTERN: No error handling
@defer (on viewport) { <app-third-party-map /> }

// ✅ CORRECT: Full state handling
@defer (on viewport) {
  <app-third-party-map />
} @loading (after 100ms; minimum 500ms) {
  <app-loading-spinner />
} @error {
  <div class="error-state">
    <p>Failed to load map. Check your connection.</p>
    <button (click)="reload()">Retry</button>
  </div>
}
```

## Modern routing and control flow pitfalls

Angular 17's built-in control flow syntax and functional guards represent significant API evolution with distinct anti-pattern categories.

### Missing track expression optimization in @for (Critical)

While `track` is mandatory in Angular 17+, using `$index` or object identity when stable identifiers exist causes **full DOM recreation on every change**.

**Detection predicate:** `@for` using `track $index` when items have unique IDs, or `track item` with immutable data patterns.

```typescript
// ❌ ANTI-PATTERN: track $index causes DOM recreation on reorder
@for (user of users; track $index) { <user-card [user]="user" /> }

// ❌ ANTI-PATTERN: Object identity fails with immutable updates
@for (todo of todos; track todo) { <li>{{ todo.task }}</li> }
toggleAllDone() {
  this.todos = this.todos.map(t => ({ ...t, done: true })); // Recreates entire DOM!
}

// ✅ CORRECT: Track by stable identifier
@for (user of users; track user.id) { <user-card [user]="user" /> }
```

**Quantitative impact:** Performance improvements of up to **90%** compared to `*ngFor` without `trackBy` according to Angular team benchmarks. Error NG0956 warns this causes "very expensive operations."

### Continued use of deprecated structural directives (High)

Using `*ngIf`, `*ngFor`, `*ngSwitch` instead of new control flow syntax (`@if`, `@for`, `@switch`). Deprecated in Angular 20, these consume additional bundle size and provide inferior performance.

**Detection predicate:** Templates containing `*ngIf`, `*ngFor`, or `*ngSwitch`.

**Quantitative impact:** `@if` is approximately **45% faster** than `*ngIf` according to Angular.love benchmarks. New syntax also eliminates CommonModule imports and enables better tree-shaking.

**Migration command:** `ng generate @angular/core:control-flow`

### Missing withComponentInputBinding configuration (High)

Expecting route parameters to automatically bind to component inputs without enabling the feature.

```typescript
// ❌ ANTI-PATTERN: Feature not enabled
provideRouter(routes)  // Missing withComponentInputBinding()

// ✅ CORRECT: Enable route input binding
provideRouter(routes, withComponentInputBinding())
```

### Class-based guards instead of functional guards (High)

Continuing to use `CanActivate`, `Resolve`, and other deprecated class-based guard interfaces (deprecated since Angular 15.2).

```typescript
// ❌ ANTI-PATTERN: Deprecated class-based guard
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(route, state): Observable<boolean> { /*...*/ }
}

// ✅ CORRECT: Functional guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated$.pipe(
    map(isAuth => isAuth ? true : router.createUrlTree(['/login']))
  );
};
```

## Zoneless Angular: change detection reimagined

Angular 18 introduced experimental zoneless change detection, stable in v20, and **default for new Angular 21+ applications**. This fundamental shift requires explicit change notification through Signals, `AsyncPipe`, or manual `markForCheck()`.

### Observable subscriptions without notification mechanisms (Critical)

Subscribing to observables and assigning results to class properties without using `AsyncPipe`, Signals, or `markForCheck()` creates **100% UI update failure** in zoneless mode.

**Detection predicate:** Component contains `.subscribe()` assigning values to class properties that are referenced in templates without `| async`, Signal conversion, or explicit `markForCheck()`.

```typescript
// ❌ ANTI-PATTERN: View won't update in zoneless mode
@Component({ template: `<pre>{{ data | json }}</pre>` })
export class UserComponent {
  data: any;
  constructor(private http: HttpClient) {
    this.http.get('/api/posts').subscribe(d => this.data = d); // Won't update!
  }
}

// ✅ CORRECT: Using toSignal()
@Component({ template: `<pre>{{ data() | json }}</pre>` })
export class UserComponent {
  data = toSignal(inject(HttpClient).get('/api/posts'));
}
```

### setTimeout/setInterval without Signal updates (Critical)

Timer-based state updates fail silently in zoneless mode without Signal wrappers.

```typescript
// ❌ ANTI-PATTERN: Timer won't trigger UI updates
seconds = 0;
ngOnInit() { setInterval(() => this.seconds++, 1000); }

// ✅ CORRECT: Signal triggers change detection
seconds = signal(0);
ngOnInit() { setInterval(() => this.seconds.update(s => s + 1), 1000); }
```

### Relying on NgZone.onStable (High)

Using `NgZone.onStable`, `onMicrotaskEmpty`, or checking `isStable` for scheduling work. These observables **never emit** in zoneless applications.

**Detection predicate:** Subscription to `ngZone.onStable` or `ngZone.onMicrotaskEmpty`; conditional logic based on `ngZone.isStable`.

```typescript
// ❌ ANTI-PATTERN: onStable never emits in zoneless
this.ngZone.onStable.subscribe(() => this.saveFormData()); // Never called!

// ✅ CORRECT: Use afterNextRender for post-CD work
afterNextRender(() => this.saveFormData());
```

### Third-party library Zone.js dependencies (High)

Many third-party libraries internally depend on Zone.js for change detection triggering. Known problematic libraries include **AngularFire v18** (throws "Zone is not defined"), **Kendo UI for Angular** (officially unsupported until Zone.js-dependent versions deprecated), and various legacy modal/tooltip libraries.

**Workaround:** Wrap library callbacks with Signal updates or explicit `markForCheck()` calls.

**Quantitative impact:** Removing Zone.js reduces bundle size by approximately **30KB raw / 10KB gzipped** and improves startup time by **5-15%**.

## Performance and build configuration failures

Angular's build system evolution from webpack to esbuild (default in v17+) and the unified application builder introduce new configuration pitfalls.

### CommonJS dependencies preventing tree-shaking (High)

Using CommonJS modules prevents effective tree-shaking and minification, resulting in significantly larger bundles.

**Detection predicate:** Build warnings about "CommonJS or AMD dependencies can cause optimization bailouts."

```typescript
// ❌ ANTI-PATTERN: CommonJS import
import * as lodash from 'lodash';  // ~70KB

// ✅ CORRECT: ES module import
import last from 'lodash-es/last';  // ~2KB
```

**Quantitative impact:** CommonJS modules can add **30-50%** to bundle size compared to tree-shakable ES modules.

### Missing bundle size budgets (Medium)

Not configuring size budgets allows bundle bloat to go unnoticed until performance issues arise.

```json
// ✅ CORRECT: Budget configuration in angular.json
"budgets": [
  { "type": "initial", "maximumWarning": "250kb", "maximumError": "500kb" },
  { "type": "anyComponentStyle", "maximumWarning": "2kb", "maximumError": "4kb" }
]
```

### NgOptimizedImage missing priority on LCP images (High)

Not marking the Largest Contentful Paint image with `priority` delays critical resource loading.

**Detection predicate:** Console warning NG02955 about LCP element not marked as priority.

```html
<!-- ❌ ANTI-PATTERN: Missing priority -->
<img ngSrc="hero.jpg" width="800" height="600">

<!-- ✅ CORRECT: Priority for LCP image -->
<img ngSrc="hero.jpg" width="800" height="600" priority>
```

**Quantitative impact:** Proper configuration shows **65% improvement in LCP** (7.9s to 2.8s).

### SSR render mode misconfiguration (High)

Using default rendering without specifying per-route render modes wastes server resources.

```typescript
// ✅ CORRECT: Route-specific render modes (Angular 19+)
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },           // CSR for dynamic home
  { path: 'about', renderMode: RenderMode.Prerender },   // SSG for static content
  { path: 'profile', renderMode: RenderMode.Server },    // SSR for user-specific
];
```

**Quantitative impact:** SSG pages load **50-70% faster** than SSR; proper mode selection significantly reduces server load.

## Testing anti-patterns for new features

Angular's new features require updated testing approaches, with Signal and zoneless testing presenting the most significant changes.

### Missing TestBed.flushEffects() for effects testing (High)

Effects don't run automatically during tests. Unlike computed signals, effects require explicit triggering via `TestBed.flushEffects()`.

```typescript
// ❌ ANTI-PATTERN: Effect not being flushed
basketService.increase(1);
expect(spy).toHaveBeenCalledTimes(2); // Fails!

// ✅ CORRECT: Flush effects after changes
TestBed.flushEffects();
basketService.increase(1);
TestBed.flushEffects();
expect(spy).toHaveBeenCalledTimes(2);
```

### Direct signal input mutation (Critical)

Attempting to directly set signal input values instead of using `ComponentRef.setInput()`. Signal inputs are read-only and cannot be directly assigned.

```typescript
// ❌ ANTI-PATTERN: Direct property assignment throws error
fixture.componentInstance.holiday = someValue;

// ✅ CORRECT: Use setInput
fixture.componentRef.setInput('holiday', someValue);
```

### Using fakeAsync/tick in zoneless tests (Critical)

`fakeAsync()` and `tick()` are Zone.js utilities that don't work in zoneless applications.

```typescript
// ❌ ANTI-PATTERN: Zone.js utilities in zoneless test
it('should handle timer', fakeAsync(() => {
  tick(1000); // Won't work without Zone.js!
}));

// ✅ CORRECT: Use Jasmine/Jest mock clocks
it('should handle timer', () => {
  jasmine.clock().install();
  jasmine.clock().tick(1000);
  jasmine.clock().uninstall();
});
```

### Missing DeferBlockBehavior configuration (High)

By default, `@defer` blocks use `DeferBlockBehavior.Manual`, meaning deferred content won't render without explicit configuration.

```typescript
// ✅ CORRECT: Configure defer behavior for tests
TestBed.configureTestingModule({
  deferBlockBehavior: DeferBlockBehavior.Playthrough,
});
```

## TypeScript and tooling configuration

### ESLint v9 flat config requirement (Medium)

Using legacy `.eslintrc.json` with ESLint v9+, which defaults to flat config format.

```javascript
// ✅ CORRECT: ESLint v9+ flat config (eslint.config.js)
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/prefer-signals": ["error", {
        "preferReadonlySignalProperties": true,
        "preferInputSignals": true,
        "preferQuerySignals": true
      }],
      "@angular-eslint/template/prefer-control-flow": "error"
    }
  }
);
```

### Critical breaking changes by version

**Angular 20 removals:**
- `InjectFlags` enum (use options object: `inject(Service, { optional: true })`)
- `TestBed.get()` (use `TestBed.inject()`)
- `*ngIf`, `*ngFor`, `*ngSwitch` deprecated (migrate to control flow)
- Karma deprecated (migrate to Vitest)

**Angular 21 removals:**
- Karma test runner (use `ng g @angular/core:karma-to-vitest`)
- `NgModuleFactory` (use `NgModule` directly)
- Zoneless default for new applications
- HttpClient auto-provided (remove explicit `provideHttpClient()` unless configuring)

**TypeScript requirements:**
| Angular | TypeScript |
|---------|------------|
| 18 | 5.4-5.5 |
| 19 | 5.5-5.6 |
| 20 | 5.8+ |
| 21 | 5.9+ |

## Severity classification summary

| Category | Anti-Pattern | Severity | Detection |
|----------|-------------|----------|-----------|
| Signals | Write-in-effect infinite loop | Critical | effect() with signal write |
| Signals | Effect for derivation | High | Effect only setting signals |
| Signals | Resource without abort | High | Missing abortSignal |
| Hydration | DOM mismatch | Critical | NG0500 error |
| Hydration | Invalid HTML nesting | High | HTML validation |
| Hydration | Missing event replay | High | Lost interactions |
| @defer | Above-fold deferral | Critical | CLS > 0.1 |
| @defer | Non-standalone in defer | Critical | No separate chunk |
| @defer | Over-deferring | Medium | Chunk < 5KB |
| Control Flow | track $index misuse | Critical | NG0956 warning |
| Control Flow | Structural directives | High | *ngIf/*ngFor usage |
| Zoneless | Observable subscribe | Critical | No CD trigger |
| Zoneless | NgZone.onStable | High | Never emits |
| Build | CommonJS deps | High | Build warnings |
| Build | Missing budgets | Medium | Bundle > 500KB |
| Testing | Missing flushEffects | High | Effect tests fail |
| Testing | fakeAsync in zoneless | Critical | Test errors |

## Conclusion: embracing Angular's reactive future

Angular 18-21 represents a fundamental shift toward **explicit reactivity through Signals, zoneless change detection, and fine-grained lazy loading**. The anti-patterns documented here emerge from this transition—developers accustomed to Zone.js's implicit change detection and NgModule-based architecture encounter new categories of failure when patterns that "just worked" no longer apply.

The most critical patterns to address immediately are **signal write-in-effect loops** (which can freeze browsers), **zoneless change detection failures** (which silently break UI updates), and **non-standalone @defer content** (which silently defeats lazy loading). Teams migrating to Angular 21's zoneless-by-default model should prioritize converting Observable subscriptions to `toSignal()` calls and ensuring all timer-based updates use Signal wrappers.

For ongoing detection, enable `@angular-eslint/prefer-signals`, `@angular-eslint/template/prefer-control-flow`, and configure strict template type checking. In development, use `provideCheckNoChangesConfig({ exhaustive: true })` to surface bindings updated without proper notification—these will fail silently in production zoneless applications.