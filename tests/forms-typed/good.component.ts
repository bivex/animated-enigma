// GOOD: Typed forms in Angular 14+ - using FormGroup with proper typing
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

interface User {
  name: string;
  email: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// GOOD: Typed form interfaces for better type safety
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
  preferences: FormGroup<{
    theme: FormControl<'light' | 'dark'>;
    notifications: FormControl<boolean>;
  }>;
}

@Component({
  selector: 'app-user-form-good',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <input formControlName="age" type="number" placeholder="Age" />

      <!-- GOOD: Type-safe form controls -->
      <div formGroupName="preferences">
        <select formControlName="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <input formControlName="notifications" type="checkbox" />
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
  standalone: true
})
export class UserFormGoodComponent {
  // GOOD: Properly typed FormGroup
  userForm: FormGroup<UserForm>;

  constructor(private fb: FormBuilder) {
    // GOOD: Type-safe form creation with proper typing
    this.userForm = this.fb.group({
      name: this.fb.control('', { validators: Validators.required }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email]
      }),
      age: this.fb.control(18, {
        validators: [Validators.min(18), Validators.max(120)]
      }),
      preferences: this.fb.group({
        theme: this.fb.control<'light' | 'dark'>('light'),
        notifications: this.fb.control(true)
      })
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // GOOD: Type-safe access to form values
      const userData: User = this.userForm.value;

      // GOOD: Compile-time type checking prevents runtime errors
      console.log('User age:', userData.age.toFixed()); // TypeScript knows age is number
      console.log('Theme:', userData.preferences.theme.toUpperCase()); // TypeScript knows theme is string

      // GOOD: IntelliSense and type checking for nested properties
      if (userData.preferences.notifications) {
        console.log('User wants notifications');
      }
    }
  }

  // GOOD: Type-safe methods
  updateUser(user: Partial<User>) {
    // GOOD: Type checking ensures only valid properties can be updated
    this.userForm.patchValue(user);
  }

  getUserData(): User {
    // GOOD: No manual casting needed - TypeScript knows the type
    return this.userForm.value;
  }

  // GOOD: Type-safe form control access
  get nameControl() {
    return this.userForm.controls.name;
  }

  get emailControl() {
    return this.userForm.controls.email;
  }

  get preferencesGroup() {
    return this.userForm.controls.preferences;
  }
}

// GOOD: Complex nested forms with proper typing
interface Employee {
  name: string;
  role: string;
  salary: number;
}

interface Company {
  name: string;
  employees: Employee[];
  address: {
    street: string;
    city: string;
    country: string;
  };
}

interface CompanyForm {
  name: FormControl<string>;
  employees: FormArray<FormGroup<{
    name: FormControl<string>;
    role: FormControl<string>;
    salary: FormControl<number>;
  }>>;
  address: FormGroup<{
    street: FormControl<string>;
    city: FormControl<string>;
    country: FormControl<string>;
  }>;
}

@Component({
  selector: 'app-company-form-good',
  template: `
    <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Company Name" />

      <!-- GOOD: Type-safe FormArray -->
      <div formArrayName="employees">
        <div *ngFor="let emp of employees.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" placeholder="Employee Name" />
          <input formControlName="role" placeholder="Role" />
          <input formControlName="salary" type="number" placeholder="Salary" />
          <button type="button" (click)="removeEmployee(i)">Remove</button>
        </div>
        <button type="button" (click)="addEmployee()">Add Employee</button>
      </div>

      <!-- GOOD: Type-safe nested FormGroup -->
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
export class CompanyFormGoodComponent {
  // GOOD: Properly typed FormGroup with nested types
  companyForm: FormGroup<CompanyForm>;

  constructor(private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      name: this.fb.control('', { validators: Validators.required }),
      employees: this.fb.array<FormGroup<{
        name: FormControl<string>;
        role: FormControl<string>;
        salary: FormControl<number>;
      }>>([
        this.createEmployeeGroup()
      ]),
      address: this.fb.group({
        street: this.fb.control('', { validators: Validators.required }),
        city: this.fb.control('', { validators: Validators.required }),
        country: this.fb.control('', { validators: Validators.required })
      })
    });
  }

  get employees() {
    // GOOD: Type-safe FormArray access
    return this.companyForm.controls.employees;
  }

  // GOOD: Type-safe helper method
  private createEmployeeGroup(): FormGroup<{
    name: FormControl<string>;
    role: FormControl<string>;
    salary: FormControl<number>;
  }> {
    return this.fb.group({
      name: this.fb.control('', { validators: Validators.required }),
      role: this.fb.control('', { validators: Validators.required }),
      salary: this.fb.control(0, { validators: [Validators.min(0)] })
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      // GOOD: Type-safe form value access
      const company: Company = this.companyForm.value;

      // GOOD: Compile-time type checking prevents runtime errors
      company.employees.forEach(emp => {
        console.log(`${emp.name} earns $${emp.salary.toLocaleString()}`);
      });

      // GOOD: Type-safe deep property access
      const address = `${company.address.street}, ${company.address.city}, ${company.address.country}`;
      console.log('Full address:', address);
    }
  }

  // GOOD: Type-safe array manipulation
  addEmployee() {
    this.employees.push(this.createEmployeeGroup());
  }

  removeEmployee(index: number) {
    this.employees.removeAt(index);
  }
}

// GOOD: Registration form with typed async validators
interface RegistrationData {
  username: string;
  email: string;
}

interface RegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
}

@Component({
  selector: 'app-registration-form-good',
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <input formControlName="username" placeholder="Username" />
      <div *ngIf="usernameControl.errors?.['usernameTaken']">
        Username already taken
      </div>

      <input formControlName="email" placeholder="Email" />
      <div *ngIf="emailControl.errors?.['emailTaken']">
        Email already registered
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">Register</button>
    </form>
  `,
  standalone: true
})
export class RegistrationFormGoodComponent {
  // GOOD: Properly typed form
  registrationForm: FormGroup<RegistrationForm>;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      username: this.fb.control('', {
        validators: [Validators.required],
        asyncValidators: [this.usernameValidator.bind(this)]
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailValidator.bind(this)]
      })
    });
  }

  // GOOD: Type-safe form control access
  get usernameControl() {
    return this.registrationForm.controls.username;
  }

  get emailControl() {
    return this.registrationForm.controls.email;
  }

  // GOOD: Properly typed async validator
  private usernameValidator(control: AbstractControl<string>): Promise<{ usernameTaken: boolean } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        // GOOD: Type-safe control access
        const isTaken = control.value === 'admin';
        resolve(isTaken ? { usernameTaken: true } : null);
      }, 1000);
    });
  }

  // GOOD: Another properly typed async validator
  private emailValidator(control: AbstractControl<string>): Promise<{ emailTaken: boolean } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const isTaken = control.value === 'admin@example.com';
        resolve(isTaken ? { emailTaken: true } : null);
      }, 1000);
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // GOOD: Type-safe form data access
      const formData: RegistrationData = this.registrationForm.value;
      console.log('Registration data:', formData);
    }
  }
}