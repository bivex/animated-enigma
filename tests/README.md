# Angular Smells Test Cases

This directory contains test cases for each anti-pattern detected by the Angular Smells Detector.

## Structure

Each anti-pattern has its own folder containing:
- `bad.*` - Examples demonstrating the anti-pattern
- `good.*` - Examples showing the correct implementation

## Anti-Patterns Covered

### 1. IMPURE_TEMPLATE_CALL
**Problem**: Function calls in templates cause re-execution on every change detection cycle.
```typescript
// BAD
<div>{{ getUserName() }}</div>

// GOOD
<div>{{ userName() }}</div> // Signal
```

### 2. GOD_STANDALONE_COMPONENT
**Problem**: Components with too many imports and responsibilities.
```typescript
// BAD: 30+ imports, 500+ lines
@Component({ imports: [/* huge list */] })

// GOOD: Split into focused components
@Component({ imports: [UserListComponent] })
```

### 3. SIGNAL_WRITE_IN_EFFECT
**Problem**: Writing to signals inside effects creates infinite loops.
```typescript
// BAD
effect(() => {
  this.counter.set(this.counter() + 1); // Infinite loop!
});

// GOOD
doubled = computed(() => this.counter() * 2);
```

### 4. NESTED_SUBSCRIPTION_HELL
**Problem**: Nested subscriptions create memory leaks and race conditions.
```typescript
// BAD
this.http.get('/api/users').subscribe(users => {
  this.http.get('/api/details').subscribe(details => {
    // Nested subscription
  });
});

// GOOD
users$ = this.http.get('/api/users').pipe(
  switchMap(users => forkJoin(/* parallel requests */))
);
```

### 5. PROVIDER_POLLUTION
**Problem**: Providing root services in component providers breaks singleton pattern.
```typescript
// BAD
@Component({
  providers: [AuthService] // AuthService is @Injectable({providedIn: 'root'})
})

// GOOD
@Component({
  providers: [LocalService] // Only local services
})
```

### 6. LARGE_LIST_WITHOUT_VIRTUALIZATION
**Problem**: Large lists without virtualization cause performance issues.
```html
<!-- BAD -->
<div *ngFor="let item of items5000">

<!-- GOOD -->
<cdk-virtual-scroll-viewport>
  <div *cdkVirtualFor="let item of items">
```

### 7. HYDRATION_MISMATCH
**Problem**: Server/client DOM differences break SSR hydration.
```html
<!-- BAD -->
<a href="/parent">
  <a href="/child">Nested</a> <!-- Invalid HTML -->
</a>

<!-- GOOD -->
<div class="links">
  <a href="/parent">Parent</a>
  <a href="/child">Child</a>
</div>
```

### 8. UNSAFE_INNER_HTML
**Problem**: Untrusted content in innerHTML creates XSS vulnerabilities.
```typescript
// BAD
userContent = '<script>alert("XSS")</script>';

// GOOD
safeContent = this.sanitizer.sanitize(userContent);
```

### 9. CIRCULAR_DEPENDENCY_INJECTION
**Problem**: Services depending on each other create circular dependencies.
```typescript
// BAD
@Injectable()
export class A { constructor(private b: B) {} }

@Injectable()
export class B { constructor(private a: A) {} } // Circular!

// GOOD
@Injectable()
export class A { constructor(private injector: Injector) {} }
```

## Running Tests

```bash
# Test all examples
npm run start tests/

# Test specific anti-pattern
npm run start tests/impure-template-call/

# Test good examples only
npm run start tests/*/good.*
```

## Contribution

When adding new test cases:
1. Create folder for new anti-pattern
2. Add `bad.*` file with anti-pattern example
3. Add `good.*` file with correct implementation
4. Update this README
5. Ensure detector catches the bad example and passes the good one