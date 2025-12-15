@Component({
  selector: 'app-comment',
  template: `
    <div class="comment-body">
      <!-- Sanitized HTML; safe to render -->
      <p [innerHTML]="sanitizedBody"></p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  sanitizedBody!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitizes HTML; removes dangerous elements/attributes
    this.sanitizedBody = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.comment.body
    ) || '';
  }
}