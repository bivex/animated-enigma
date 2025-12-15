@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()" novalidate>
      <div class="form-group">
        <label for="username" class="form-label">
          Username
          <span aria-label="required">*</span>
        </label>
        <input
          id="username"
          type="text"
          name="username"
          required
          aria-required="true"
          aria-describedby="username-error"
          [attr.aria-invalid]="submitted && form.get('username')?.invalid">
        <div
          id="username-error"
          role="alert"
          class="error-message"
          *ngIf="submitted && form.get('username')?.invalid">
          Username is required
        </div>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">
          Password
          <span aria-label="required">*</span>
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          aria-required="true"
          aria-describedby="password-error"
          [attr.aria-invalid]="submitted && form.get('password')?.invalid">
        <div
          id="password-error"
          role="alert"
          class="error-message"
          *ngIf="submitted && form.get('password')?.invalid">
          Password is required
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        [disabled]="form.invalid || isSubmitting()"
        [attr.aria-busy]="isSubmitting()">
        {{ isSubmitting() ? 'Signing in...' : 'Sign In' }}
      </button>

      <div
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        *ngIf="submitted && form.invalid">
        Please correct the errors above before submitting.
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    // Submit logic
  }
}