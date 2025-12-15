import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// GOOD: Pure reactive forms approach
@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <!-- GOOD: Consistent reactive forms approach -->
      <input
        type="text"
        formControlName="firstName"
        placeholder="First Name"
        required>

      <!-- GOOD: Proper reactive form binding -->
      <input
        type="email"
        formControlName="email"
        placeholder="Email"
        required>

      <!-- GOOD: Nested form groups -->
      <div formGroupName="address">
        <input
          type="text"
          formControlName="street"
          placeholder="Street Address">
      </div>

      <!-- GOOD: Form validation display -->
      <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
        Invalid email
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
  standalone: true
})
export class UserFormComponent {
  // GOOD: Single form group with all controls
  userForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      street: ['']
    })
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // GOOD: Proper reactive forms initialization
    this.userForm.patchValue({
      firstName: 'John',
      email: 'john@example.com',
      address: { street: '123 Main St' }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      console.log('Submitting:', formValue);
      // GOOD: Single source of truth
    }
  }

  // GOOD: Reactive forms methods
  resetForm() {
    this.userForm.reset();
  }

  get isFormValid(): boolean {
    return this.userForm.valid;
  }
}

// GOOD: Template-driven forms alternative (separate component)
@Component({
  selector: 'app-user-template-form',
  template: `
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <!-- GOOD: Pure template-driven approach -->
      <input
        type="text"
        name="firstName"
        [(ngModel)]="user.firstName"
        required>

      <input
        type="email"
        name="email"
        [(ngModel)]="user.email"
        required>

      <button type="submit" [disabled]="!userForm.valid">Submit</button>
    </form>
  `,
  standalone: true
})
export class UserTemplateFormComponent {
  user = {
    firstName: '',
    email: ''
  };

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Template form submitted:', this.user);
    }
  }
}

// GOOD: Module with single form approach
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule // GOOD: Only reactive forms
  ],
  declarations: [UserFormComponent]
})
export class UserModule { }