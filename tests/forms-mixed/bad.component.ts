import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// BAD: Mixing template-driven and reactive forms
@Component({
  selector: 'app-user-form',
  template: `
    <form>
      <!-- BAD: Mixing ngModel and formControlName on same element -->
      <input
        type="text"
        name="firstName"
        [(ngModel)]="user.firstName"
        formControlName="firstName"
        required>

      <!-- BAD: Using both FormsModule and ReactiveFormsModule -->
      <input
        type="email"
        name="email"
        [(ngModel)]="user.email"
        [formControl]="emailControl"
        required>

      <!-- BAD: Inconsistent form directive usage -->
      <div formGroupName="address">
        <input
          type="text"
          name="street"
          [(ngModel)]="user.address.street"
          formControlName="street">
      </div>

      <button type="submit">Submit</button>
    </form>
  `,
  standalone: true
})
export class UserFormComponent {
  user = {
    firstName: '',
    email: '',
    address: { street: '' }
  };

  // BAD: Creating reactive form controls
  emailControl = this.fb.control('', [Validators.email]);

  // BAD: Also creating form group
  userForm: FormGroup = this.fb.group({
    firstName: [''],
    address: this.fb.group({
      street: ['']
    })
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // BAD: Confusing initialization mixing both approaches
    this.userForm.patchValue(this.user);
  }

  onSubmit() {
    // BAD: Inconsistent data handling
    const formValue = this.userForm.value;
    const templateValue = this.user;
    // Which one to use? Both are modified but inconsistently
  }
}

// BAD: Module mixing both form modules
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,        // BAD: Template-driven forms
    ReactiveFormsModule // BAD: Reactive forms - mixing both
  ],
  declarations: [UserFormComponent]
})
export class UserModule { }