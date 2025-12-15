@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <a [href]="sanitizedWebsite" target="_blank" rel="noopener noreferrer">
        Visit website
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  @Input() user!: User;
  sanitizedWebsite!: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitizes URL; removes javascript: protocol
    this.sanitizedWebsite = this.sanitizer.sanitize(
      SecurityContext.URL,
      this.user.website
    );
  }
}