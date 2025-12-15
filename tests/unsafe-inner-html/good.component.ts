import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-unsafe-inner-html-good',
  template: `
    <div>
      <!-- GOOD: Sanitized content -->
      <div [innerHTML]="safeContent"></div>

      <!-- GOOD: Use Angular interpolation for trusted content -->
      <div>{{ trustedContent }}</div>

      <!-- GOOD: Component-based approach -->
      <app-rich-text [content]="validatedContent"></app-rich-text>
    </div>
  `
})
export class UnsafeInnerHtmlGoodComponent {
  safeContent: SafeHtml;
  trustedContent = 'This is safe static content';
  validatedContent = 'Validated and sanitized content';

  constructor(private sanitizer: DomSanitizer) {
    // GOOD: Sanitize untrusted content
    const untrustedHtml = '<script>alert("XSS")</script><p>Safe content</p>';
    this.safeContent = this.sanitizer.sanitize(
      this.sanitizer.SECURITY_CONTEXT.HTML,
      untrustedHtml
    ) || '';

    // GOOD: Use bypassSecurityTrustHtml only for trusted content
    // const trustedHtml = '<strong>Trusted HTML</strong>';
    // this.safeContent = this.sanitizer.bypassSecurityTrustHtml(trustedHtml);
  }

  // GOOD: Validate content before using
  private validateContent(content: string): string {
    // Implement content validation logic
    // Remove scripts, validate HTML structure, etc.
    return content.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }
}