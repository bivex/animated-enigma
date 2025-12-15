// GOOD: Proper valueChanges handling with debouncing and no leaks
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, combineLatest } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';

@Component({
  selector: 'app-search-form-good',
  template: `
    <form [formGroup]="searchForm">
      <input formControlName="query" placeholder="Search..." />
      <select formControlName="category">
        <option value="">All</option>
        <option value="users">Users</option>
        <option value="posts">Posts</option>
      </select>
      <div>Results: {{ results.length }}</div>
    </form>
  `,
  standalone: true
})
export class SearchFormGoodComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  results: any[] = [];

  // GOOD: Single destroy subject for all subscriptions
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: [''],
      category: ['']
    });
  }

  ngOnInit() {
    // GOOD: Single debounced subscription for form changes
    this.searchForm.valueChanges.pipe(
      debounceTime(300), // GOOD: Debouncing prevents excessive API calls
      distinctUntilChanged(), // GOOD: Only emit when values actually change
      takeUntil(this.destroy$) // GOOD: Automatic cleanup
    ).subscribe(searchParams => {
      console.log('Performing debounced search:', searchParams);
      this.performSearch(searchParams);
    });
  }

  ngOnDestroy() {
    // GOOD: Single cleanup call
    this.destroy$.next();
    this.destroy$.complete();
  }

  private performSearch(searchParams: any) {
    console.log('Performing search with:', searchParams);
    // Simulate API call with debouncing
    setTimeout(() => {
      this.results = [
        { id: 1, title: `Result for "${searchParams.query}" in ${searchParams.category || 'all'}` }
      ];
    }, 100);
  }
}

// GOOD: Component with proper subscription management
@Component({
  selector: 'app-multi-form-good',
  template: `
    <div>
      <form [formGroup]="userForm">
        <input formControlName="name" placeholder="Name" />
        <input formControlName="email" placeholder="Email" />
        <div>Name length: {{ nameLength }}</div>
      </form>

      <form [formGroup]="settingsForm">
        <input formControlName="theme" placeholder="Theme" />
        <input formControlName="language" placeholder="Language" />
        <div>Settings valid: {{ settingsValid }}</div>
      </form>
    </div>
  `,
  standalone: true
})
export class MultiFormGoodComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  settingsForm: FormGroup;

  nameLength = 0;
  settingsValid = false;

  // GOOD: Single destroy subject
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [''],
      email: ['']
    });

    this.settingsForm = this.fb.group({
      theme: [''],
      language: ['']
    });
  }

  ngOnInit() {
    // GOOD: Combined subscription with proper cleanup
    const userChanges$ = this.userForm.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    );

    const settingsChanges$ = this.settingsForm.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    );

    // GOOD: Single subscription handling both forms
    merge(userChanges$, settingsChanges$).pipe(
      takeUntil(this.destroy$)
    ).subscribe(source => {
      if (source === this.userForm.value) {
        this.nameLength = source.name.length;
      } else if (source === this.settingsForm.value) {
        this.settingsValid = this.settingsForm.valid;
      }
    });

    // GOOD: Separate subscription for expensive operations
    this.settingsForm.get('theme')!.valueChanges.pipe(
      debounceTime(500), // GOOD: Longer debounce for expensive operations
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(theme => {
      this.applyTheme(theme);
    });
  }

  ngOnDestroy() {
    // GOOD: Clean single cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyTheme(theme: string) {
    console.log('Applying theme:', theme);
    // Simulate expensive DOM manipulation
    document.body.className = `theme-${theme}`;
  }
}

// GOOD: Async validation with proper debouncing
@Component({
  selector: 'app-async-validation-good',
  template: `
    <form [formGroup]="registrationForm">
      <input formControlName="username" placeholder="Username" />
      <div *ngIf="registrationForm.get('username')?.pending">Checking...</div>
      <div *ngIf="registrationForm.get('username')?.errors?.['taken']">Username taken</div>

      <input formControlName="email" placeholder="Email" />
      <div *ngIf="registrationForm.get('email')?.pending">Validating...</div>
      <div *ngIf="registrationForm.get('email')?.errors?.['taken']">Email taken</div>

      <button type="submit" [disabled]="registrationForm.invalid">Register</button>
    </form>
  `,
  standalone: true
})
export class AsyncValidationGoodComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      username: ['', {
        validators: [Validators.required],
        asyncValidators: [this.checkUsername.bind(this)]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.checkEmail.bind(this)]
      }]
    });
  }

  ngOnInit() {
    // GOOD: Minimal status change monitoring with debouncing
    this.registrationForm.statusChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(status => {
      console.log('Form status changed to:', status);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // GOOD: Debounced async validator
  private checkUsername(control: any) {
    // GOOD: Debouncing prevents excessive API calls
    return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        console.log('Checking username:', control.value);
        const isTaken = control.value === 'admin';
        resolve(isTaken ? { taken: true } : null);
      }, 300); // Debounced

      // GOOD: Cleanup on abort
      control.registerOnValidatorChange?.(() => clearTimeout(timeoutId));
    });
  }

  // GOOD: Another debounced async validator
  private checkEmail(control: any) {
    return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        console.log('Checking email:', control.value);
        const isTaken = control.value === 'admin@example.com';
        resolve(isTaken ? { taken: true } : null);
      }, 300); // Debounced

      control.registerOnValidatorChange?.(() => clearTimeout(timeoutId));
    });
  }
}

// GOOD: Complex form with reactive calculations
@Component({
  selector: 'app-complex-form-good',
  template: `
    <form [formGroup]="complexForm">
      <div formArrayName="items">
        <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" [placeholder]="'Item ' + (i + 1)" />
          <input formControlName="quantity" type="number" placeholder="Quantity" />
          <input formControlName="price" type="number" placeholder="Price" />
          <div>Total: {{ itemTotals()[i] || 0 }}</div>
        </div>
      </div>
      <div>Grand Total: {{ grandTotal() }}</div>
      <button type="button" (click)="addItem()">Add Item</button>
    </form>
  `,
  standalone: true
})
export class ComplexFormGoodComponent implements OnInit, OnDestroy {
  complexForm: FormGroup;

  // GOOD: Reactive calculations instead of template method calls
  itemTotals = signal<number[]>([]);
  grandTotal = computed(() => this.itemTotals().reduce((sum, total) => sum + total, 0));

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.complexForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  get items() {
    return this.complexForm.get('items') as FormArray;
  }

  ngOnInit() {
    // GOOD: Reactive calculation of item totals
    this.items.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateItemTotals();
    });

    // GOOD: Initial item
    this.addItem();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem() {
    const itemGroup = this.fb.group({
      name: [''],
      quantity: [1],
      price: [0]
    });

    this.items.push(itemGroup);
    this.updateItemTotals();
  }

  // GOOD: Reactive calculation instead of template method
  private updateItemTotals() {
    const totals: number[] = [];
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items.at(i);
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      totals[i] = quantity * price;
    }
    this.itemTotals.set(totals);
  }
}