// BAD: Invalid HTML nesting causing hydration mismatches
import { Component } from '@angular/core';

@Component({
  selector: 'app-invalid-html',
  template: `
    <!-- BAD: Block element inside inline element -->
    <p>This is a paragraph with
      <div>a div inside it</div>
      which is invalid HTML.
    </p>

    <!-- BAD: Nested anchor tags -->
    <a href="/page1">Link 1
      <a href="/page2">Link 2</a>
    </a>

    <!-- BAD: Missing tbody in table -->
    <table>
      <tr><td>Data 1</td></tr>
      <tr><td>Data 2</td></tr>
    </table>

    <!-- BAD: Inline elements with block content -->
    <span>Span with
      <h1>heading</h1>
      inside it.
    </span>

    <!-- BAD: Form elements nesting issues -->
    <form>
      <form>
        <input type="text" name="nested" />
      </form>
    </form>
  `,
  standalone: true
})
export class InvalidHtmlComponent {}

// BAD: Dynamic content causing invalid nesting
@Component({
  selector: 'app-dynamic-invalid',
  template: `
    <div>
      <!-- BAD: Conditional rendering creates invalid nesting -->
      <p *ngIf="showContent">
        Paragraph content
        <div *ngIf="showNested">Nested div in paragraph</div>
      </p>

      <!-- BAD: Loop creating invalid structure -->
      <ul *ngFor="let item of items">
        <div>{{ item.name }}</div> <!-- BAD: div directly in ul -->
      </ul>
    </div>
  `,
  standalone: true
})
export class DynamicInvalidComponent {
  showContent = true;
  showNested = true;
  items = [{ name: 'Item 1' }, { name: 'Item 2' }];
}

// BAD: Component with SSR/client differences
@Component({
  selector: 'app-ssr-mismatch',
  template: `
    <div>
      <!-- BAD: Different structure on server vs client -->
      <div *ngIf="isPlatformServer()">
        <p>Server content</p>
      </div>
      <div *ngIf="isPlatformBrowser()">
        <span>Client content</span> <!-- Different element type -->
      </div>

      <!-- BAD: Conditional table structure -->
      <table *ngIf="useTable">
        <tr *ngFor="let row of data">
          <td>{{ row.value }}</td>
        </tr>
      </table>
      <div *ngIf="!useTable">
        <div *ngFor="let row of data">{{ row.value }}</div> <!-- No tbody issues -->
      </div>
    </div>
  `,
  standalone: true
})
export class SsrMismatchComponent {
  useTable = true;
  data = [{ value: 'Data 1' }, { value: 'Data 2' }];

  // These functions would be imported from @angular/common
  isPlatformServer(): boolean { return false; }
  isPlatformBrowser(): boolean { return true; }
}

// BAD: Template with multiple nesting violations
@Component({
  selector: 'app-complex-invalid',
  template: `
    <article>
      <!-- BAD: Multiple violations in one template -->
      <h1>Article Title</h1>

      <!-- BAD: p with div inside -->
      <p>This paragraph contains
        <div class="highlight">highlighted text</div>
        which is invalid.
      </p>

      <!-- BAD: Nested links -->
      <a href="/article">Read more
        <a href="/comments">(comments)</a>
      </a>

      <!-- BAD: Form in form -->
      <form action="/submit">
        <div>
          <form action="/nested-submit">
            <input type="text" name="nested-input" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </form>

      <!-- BAD: Table without proper structure -->
      <table class="data-table">
        <caption>Data Table</caption>
        <!-- Missing tbody - browser will auto-insert -->
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Data 1</td><td>Data 2</td></tr>
      </table>

      <!-- BAD: Span with block elements -->
      <span class="inline-text">
        This span contains
        <h2>a heading</h2>
        <p>and a paragraph</p>
        which is completely invalid.
      </span>
    </article>
  `,
  standalone: true
})
export class ComplexInvalidComponent {}