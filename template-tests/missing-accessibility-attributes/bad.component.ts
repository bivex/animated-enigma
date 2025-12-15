@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <div>Username</div>
      <input type="text" name="username">

      <div>Password</div>
      <input type="password" name="password">

      <div @click="submit()" class="submit-button">
        Sign In
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>
    </form>
  `
})
export class LoginComponent {}