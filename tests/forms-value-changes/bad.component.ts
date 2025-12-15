// BAD: valueChanges leaks and missing debouncing - memory leaks and excessive API calls
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-form-bad',
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
export class SearchFormBadComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  results: any[] = [];

  // BAD: No proper subscription management
  private subscriptions = new Subscription();

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: [''],
      category: ['']
    });
  }

  ngOnInit() {
    // BAD: Direct subscription to valueChanges without debouncing
    // This fires on every keystroke, causing excessive API calls
    this.subscriptions.add(
      this.searchForm.valueChanges.subscribe(value => {
        console.log('Search value changed:', value);
        // BAD: Immediate API call on every change
        this.performSearch(value);
      })
    );

    // BAD: Another subscription for individual controls
    this.subscriptions.add(
      this.searchForm.get('query')!.valueChanges.subscribe(query => {
        console.log('Query changed:', query);
        // BAD: Duplicate search logic
        this.performSearch(this.searchForm.value);
      })
    );

    // BAD: Third subscription for category changes
    this.subscriptions.add(
      this.searchForm.get('category')!.valueChanges.subscribe(category => {
        console.log('Category changed:', category);
        // BAD: Yet another search call
        this.performSearch(this.searchForm.value);
      })
    );
  }

  ngOnDestroy() {
    // BAD: Manual cleanup - easy to forget
    this.subscriptions.unsubscribe();
  }

  // BAD: Expensive operation called on every change
  private performSearch(searchParams: any) {
    console.log('Performing search with:', searchParams);
    // Simulate expensive API call
    setTimeout(() => {
      this.results = [
        { id: 1, title: `Result for "${searchParams.query}"` }
      ];
    }, 100);
  }
}

// BAD: Component with multiple forms and subscription leaks
@Component({
  selector: 'app-multi-form-bad',
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
export class MultiFormBadComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  settingsForm: FormGroup;

  nameLength = 0;
  settingsValid = false;

  // BAD: Multiple subscription objects - error-prone
  private userSubscriptions = new Subscription();
  private settingsSubscriptions = new Subscription();

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
    // BAD: Multiple subscriptions without debouncing
    this.userSubscriptions.add(
      this.userForm.valueChanges.subscribe(value => {
        console.log('User form changed:', value);
        this.nameLength = value.name.length;
      })
    );

    // BAD: Individual control subscriptions
    this.userSubscriptions.add(
      this.userForm.get('name')!.valueChanges.subscribe(name => {
        console.log('Name changed:', name);
        this.nameLength = name.length; // Duplicate logic
      })
    );

    // BAD: Another form's subscriptions
    this.settingsSubscriptions.add(
      this.settingsForm.valueChanges.subscribe(value => {
        console.log('Settings form changed:', value);
        this.settingsValid = this.settingsForm.valid;
      })
    );

    // BAD: More individual control subscriptions
    this.settingsSubscriptions.add(
      this.settingsForm.get('theme')!.valueChanges.subscribe(theme => {
        console.log('Theme changed:', theme);
        // BAD: Expensive operation on every change
        this.applyTheme(theme);
      })
    );
  }

  ngOnDestroy() {
    // BAD: Multiple cleanup calls - easy to miss one
    this.userSubscriptions.unsubscribe();
    this.settingsSubscriptions.unsubscribe();
  }

  // BAD: Expensive operation called frequently
  private applyTheme(theme: string) {
    console.log('Applying theme:', theme);
    // Simulate expensive DOM manipulation
    document.body.className = `theme-${theme}`;
  }
}

// BAD: Async validators without debouncing
@Component({
  selector: 'app-async-validation-bad',
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
export class AsyncValidationBadComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;

  // BAD: No subscription management for async validators
  private validationSubscriptions = new Subscription();

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
    // BAD: Subscribing to status changes without proper cleanup
    this.validationSubscriptions.add(
      this.registrationForm.statusChanges.subscribe(status => {
        console.log('Form status:', status);
        // BAD: Expensive logging on every status change
      })
    );

    // BAD: Subscribing to individual control status changes
    this.validationSubscriptions.add(
      this.registrationForm.get('username')!.statusChanges.subscribe(status => {
        console.log('Username status:', status);
      })
    );

    // BAD: More subscriptions for email
    this.validationSubscriptions.add(
      this.registrationForm.get('email')!.statusChanges.subscribe(status => {
        console.log('Email status:', status);
      })
    );
  }

  ngOnDestroy() {
    // BAD: Manual cleanup required
    this.validationSubscriptions.unsubscribe();
  }

  // BAD: Async validator without debouncing - called on every keystroke
  private checkUsername(control: any) {
    console.log('Checking username:', control.value);
    return new Promise(resolve => {
      setTimeout(() => {
        // BAD: Expensive API call on every change
        const isTaken = control.value === 'admin';
        resolve(isTaken ? { taken: true } : null);
      }, 500); // No debouncing
    });
  }

  // BAD: Another async validator without debouncing
  private checkEmail(control: any) {
    console.log('Checking email:', control.value);
    return new Promise(resolve => {
      setTimeout(() => {
        const isTaken = control.value === 'admin@example.com';
        resolve(isTaken ? { taken: true } : null);
      }, 500); // No debouncing
    });
  }
}

// BAD: Form with nested subscriptions and complex logic
@Component({
  selector: 'app-complex-form-bad',
  template: `
    <form [formGroup]="complexForm">
      <div formArrayName="items">
        <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" [placeholder]="'Item ' + (i + 1)" />
          <input formControlName="quantity" type="number" placeholder="Quantity" />
          <input formControlName="price" type="number" placeholder="Price" />
          <div>Total: {{ getItemTotal(i) }}</div>
        </div>
      </div>
      <div>Grand Total: {{ grandTotal }}</div>
      <button type="button" (click)="addItem()">Add Item</button>
    </form>
  `,
  standalone: true
})
export class ComplexFormBadComponent implements OnInit, OnDestroy {
  complexForm: FormGroup;
  grandTotal = 0;

  // BAD: Complex subscription management
  private formSubscriptions = new Subscription();
  private itemSubscriptions = new Map<number, Subscription>();

  constructor(private fb: FormBuilder) {
    this.complexForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  get items() {
    return this.complexForm.get('items') as FormArray;
  }

  ngOnInit() {
    // BAD: Main form subscription
    this.formSubscriptions.add(
      this.complexForm.valueChanges.subscribe(() => {
        this.calculateGrandTotal();
      })
    );

    // BAD: Initial item
    this.addItem();
  }

  ngOnDestroy() {
    // BAD: Complex cleanup logic
    this.formSubscriptions.unsubscribe();
    this.itemSubscriptions.forEach(sub => sub.unsubscribe());
    this.itemSubscriptions.clear();
  }

  // BAD: Method called from template - expensive and called frequently
  getItemTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    return quantity * price;
  }

  addItem() {
    const itemGroup = this.fb.group({
      name: [''],
      quantity: [1],
      price: [0]
    });

    this.items.push(itemGroup);

    // BAD: Individual subscriptions for each item - memory leak prone
    const itemIndex = this.items.length - 1;
    const itemSub = new Subscription();

    itemSub.add(
      itemGroup.valueChanges.subscribe(() => {
        console.log(`Item ${itemIndex} changed`);
        this.calculateGrandTotal();
      })
    );

    // BAD: More subscriptions for individual controls
    itemSub.add(
      itemGroup.get('quantity')!.valueChanges.subscribe(() => {
        this.calculateGrandTotal();
      })
    );

    itemSub.add(
      itemGroup.get('price')!.valueChanges.subscribe(() => {
        this.calculateGrandTotal();
      })
    );

    this.itemSubscriptions.set(itemIndex, itemSub);
  }

  // BAD: Expensive calculation called frequently
  private calculateGrandTotal() {
    console.log('Calculating grand total...');
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.getItemTotal(i);
    }
    this.grandTotal = total;
  }
}