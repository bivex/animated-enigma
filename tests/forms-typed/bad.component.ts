// BAD: Missing typed forms in Angular 14+ - using UntypedFormGroup instead of FormGroup
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

interface User {
  name: string;
  email: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// BAD: Using UntypedFormBuilder instead of FormBuilder
@Component({
  selector: 'app-user-form-bad',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <input formControlName="age" type="number" placeholder="Age" />

      <!-- BAD: No type safety - runtime errors instead of compile-time errors -->
      <div formGroupName="preferences">
        <select formControlName="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <input formControlName="notifications" type="checkbox" />
      </div>

      <button type="submit">Submit</button>
    </form>
  `,
  standalone: true
})
export class UserFormBadComponent {
  // BAD: UntypedFormGroup - no compile-time type checking
  userForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    // BAD: No type safety in form creation
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [18, [Validators.min(18), Validators.max(120)]],
      preferences: this.fb.group({
        theme: ['light'],
        notifications: [true]
      })
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // BAD: No type safety - runtime casting needed
      const userData = this.userForm.value as User;

      // BAD: Runtime errors possible due to lack of type checking
      console.log('User age:', userData.age.toFixed()); // Could fail if age is string
      console.log('Theme:', userData.preferences.theme.toUpperCase()); // Could fail
    }
  }

  // BAD: Methods that manipulate form without type safety
  updateUser(user: User) {
    // BAD: No compile-time checking of form structure
    this.userForm.patchValue(user);
  }

  getUserData(): User {
    // BAD: Manual casting required
    return this.userForm.value as User;
  }
}

// BAD: Complex nested forms without typing
interface Company {
  name: string;
  employees: Array<{
    name: string;
    role: string;
    salary: number;
  }>;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

@Component({
  selector: 'app-company-form-bad',
  template: `
    <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Company Name" />

      <!-- BAD: Nested forms without type safety -->
      <div formArrayName="employees">
        <div *ngFor="let emp of employees.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" placeholder="Employee Name" />
          <input formControlName="role" placeholder="Role" />
          <input formControlName="salary" type="number" placeholder="Salary" />
        </div>
      </div>

      <!-- BAD: Deeply nested object without typing -->
      <div formGroupName="address">
        <input formControlName="street" placeholder="Street" />
        <input formControlName="city" placeholder="City" />
        <input formControlName="country" placeholder="Country" />
      </div>

      <button type="submit">Save Company</button>
    </form>
  `,
  standalone: true
})
export class CompanyFormBadComponent {
  // BAD: UntypedFormGroup for complex nested structure
  companyForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      employees: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          role: ['', Validators.required],
          salary: [0, [Validators.min(0)]]
        })
      ]),
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  get employees() {
    // BAD: Untyped array access
    return this.companyForm.get('employees');
  }

  onSubmit() {
    if (this.companyForm.valid) {
      // BAD: Manual casting and potential runtime errors
      const company = this.companyForm.value as Company;

      // BAD: No type safety - these could fail at runtime
      company.employees.forEach(emp => {
        console.log(`${emp.name} earns $${emp.salary.toLocaleString()}`);
      });

      // BAD: Deep property access without type checking
      const address = `${company.address.street}, ${company.address.city}`;
      console.log('Address:', address);
    }
  }

  // BAD: Adding employees without type safety
  addEmployee() {
    const employeeGroup = this.fb.group({
      name: '',
      role: '',
      salary: 0
    });

    // BAD: Untyped array push
    this.employees.push(employeeGroup);
  }
}

// BAD: Form with async validators without typing
@Component({
  selector: 'app-registration-form-bad',
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <input formControlName="username" placeholder="Username" />
      <div *ngIf="registrationForm.get('username')?.errors?.['usernameTaken']">
        Username already taken
      </div>

      <input formControlName="email" placeholder="Email" />
      <div *ngIf="registrationForm.get('email')?.errors?.['emailTaken']">
        Email already registered
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">Register</button>
    </form>
  `,
  standalone: true
})
export class RegistrationFormBadComponent {
  // BAD: Untyped form with async validators
  registrationForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    this.registrationForm = this.fb.group({
      username: ['', {
        validators: [Validators.required],
        asyncValidators: [this.usernameValidator.bind(this)]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailValidator.bind(this)]
      }]
    });
  }

  // BAD: Async validator without proper typing
  private usernameValidator(control: any) {
    // BAD: No type safety for control parameter
    return new Promise(resolve => {
      setTimeout(() => {
        // BAD: Manual error object creation without typing
        const isTaken = control.value === 'admin';
        resolve(isTaken ? { usernameTaken: true } : null);
      }, 1000);
    });
  }

  // BAD: Another async validator without typing
  private emailValidator(control: any) {
    return new Promise(resolve => {
      setTimeout(() => {
        const isTaken = control.value === 'admin@example.com';
        resolve(isTaken ? { emailTaken: true } : null);
      }, 1000);
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // BAD: Manual casting required
      const formData = this.registrationForm.value as { username: string; email: string };
      console.log('Registration data:', formData);
    }
  }
}