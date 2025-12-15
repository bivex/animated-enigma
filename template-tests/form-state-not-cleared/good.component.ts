@Component({
  selector: 'app-user-form',
  template: `
    <div *ngIf="successMessage">{{ successMessage }}</div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name">
      <input formControlName="email">
      <button type="submit" [disabled]="form.invalid || isSubmitting">
        {{ isSubmitting ? 'Creating...' : 'Create User' }}
      </button>
      <button type="button" (click)="resetForm()">Clear Form</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.userService.createUser(this.form.value).subscribe({
      next: (newUser) => {
        this.successMessage.set(`User ${newUser.name} created successfully`);
        this.form.reset();
        this.isSubmitting.set(false);

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  resetForm(): void {
    this.form.reset();
    this.successMessage.set(null);
  }
}