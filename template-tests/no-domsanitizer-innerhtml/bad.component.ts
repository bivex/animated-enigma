@Component({
  selector: 'app-comment',
  template: `
    <div class="comment-body">
      <!-- User-generated HTML bound directly; allows XSS -->
      <p [innerHTML]="comment.body"></p>
    </div>
  `
})
export class CommentComponent {
  @Input() comment!: Comment;
}