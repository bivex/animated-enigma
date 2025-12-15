@Component({
  selector: 'app-registration',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="formData.firstName" name="firstName">
      <input [(ngModel)]="formData.lastName" name="lastName">
      <input [(ngModel)]="formData.email" name="email">
      <input [(ngModel)]="formData.password" name="password">
      <input [(ngModel)]="formData.confirmPassword" name="confirmPassword">
      <span *ngIf="submitted && !formData.firstName">Required</span>
      <button type="submit">Register</button>
    </form>
  `
})
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
    return this.formData.firstName.length > 0 &&
           this.formData.email.includes('@') &&
           this.formData.password === this.formData.confirmPassword;
  }

  submit(): void {
    // Submit logic
  }
}