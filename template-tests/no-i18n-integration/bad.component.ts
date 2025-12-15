@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <h1>Login</h1>
      <label>Username</label>
      <input [(ngModel)]="username" name="username">

      <label>Password</label>
      <input [(ngModel)]="password" name="password" type="password">

      <button type="submit">Sign In</button>
      <a href="/forgot">Forgot password?</a>
    </form>
  `
})
export class LoginComponent {}