@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="formData.name" name="name">
      <input [(ngModel)]="formData.email" name="email">
      <button type="submit">Create User</button>
    </form>
  `
})
export class UserFormComponent {
  formData = {
    name: '',
    email: ''
  };

  onSubmit(): void {
    if (!this.formData.name || !this.formData.email) return;
    this.userService.createUser(this.formData).subscribe(() => {
      console.log('User created');
      // Form still contains old data—ready for next submission
    });
  }
}