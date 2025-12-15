import { Component } from '@angular/core';

@Component({
  selector: 'app-unsafe-inner-html-bad',
  template: `
    <div>
      <!-- BAD: Unsafe innerHTML with user input -->
      <div [innerHTML]="userComment"></div>

      <!-- BAD: No sanitization -->
      <div [innerHTML]="articleContent"></div>

      <!-- BAD: Dynamic content from external source -->
      <div [innerHTML]="apiResponse"></div>
    </div>
  `
})
export class UnsafeInnerHtmlBadComponent {
  // BAD: User input directly inserted
  userComment = '<script>alert("XSS Attack!")</script><p>User comment</p>';

  // BAD: Untrusted content
  articleContent = '<img src="x" onerror="alert(\'XSS\')"><p>Article</p>';

  // BAD: API response without validation
  apiResponse = '<div onclick="maliciousFunction()">Click me</div>';
}