@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <h1 i18n="@@login.title">Login</h1>

      <label i18n="@@login.username.label">Username</label>
      <input [(ngModel)]="username" name="username">

      <label i18n="@@login.password.label">Password</label>
      <input [(ngModel)]="password" name="password" type="password">

      <button type="submit" i18n="@@login.signin.button">Sign In</button>
      <a href="/forgot" i18n="@@login.forgot.link">Forgot password?</a>
    </form>
  `
})
export class LoginComponent {}