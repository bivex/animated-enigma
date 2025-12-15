// GOOD: Valid HTML nesting preventing hydration mismatches
import { Component } from '@angular/core';

@Component({
  selector: 'app-valid-html',
  template: `
    <!-- GOOD: Proper block element nesting -->
    <div>
      <p>This is a proper paragraph.</p>
      <div>This is a proper div.</div>
    </div>

    <!-- GOOD: Separate anchor tags -->
    <nav>
      <a href="/page1">Link 1</a> |
      <a href="/page2">Link 2</a>
    </nav>

    <!-- GOOD: Properly structured table -->
    <table>
      <thead>
        <tr><th>Header 1</th><th>Header 2</th></tr>
      </thead>
      <tbody>
        <tr><td>Data 1</td><td>Data 2</td></tr>
        <tr><td>Data 3</td><td>Data 4</td></tr>
      </tbody>
    </table>

    <!-- GOOD: Inline elements contain only text/inline elements -->
    <span>Span with <strong>bold</strong> and <em>italic</em> text.</span>
  `,
  standalone: true
})
export class ValidHtmlComponent {}

// GOOD: Dynamic content with consistent structure
@Component({
  selector: 'app-dynamic-valid',
  template: `
    <div>
      <!-- GOOD: Same structure regardless of condition -->
      <div class="content-wrapper">
        <p *ngIf="showContent">
          Paragraph content
          <span *ngIf="showNested" class="nested">nested span</span>
        </p>
      </div>

      <!-- GOOD: Proper list structure -->
      <ul>
        <li *ngFor="let item of items">
          <div class="item-content">{{ item.name }}</div>
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class DynamicValidComponent {
  showContent = true;
  showNested = true;
  items = [{ name: 'Item 1' }, { name: 'Item 2' }];
}

// GOOD: Consistent SSR/client structure
@Component({
  selector: 'app-ssr-consistent',
  template: `
    <div>
      <!-- GOOD: Same element type on both server and client -->
      <div class="content">
        {{ content }}
      </div>

      <!-- GOOD: Conditional classes instead of different structures -->
      <div [class.table-view]="useTable" [class.list-view]="!useTable">
        <div *ngFor="let row of data" class="data-item">
          {{ row.value }}
        </div>
      </div>

      <!-- GOOD: Use afterNextRender for client-specific content -->
    </div>
  `,
  standalone: true
})
export class SsrConsistentComponent {
  content = 'Content that renders the same on server and client';
  useTable = true;
  data = [{ value: 'Data 1' }, { value: 'Data 2' }];
}

// GOOD: Complex valid HTML structure
@Component({
  selector: 'app-complex-valid',
  template: `
    <article>
      <header>
        <h1>Article Title</h1>
      </header>

      <section>
        <!-- GOOD: Proper paragraph structure -->
        <p>This paragraph contains
          <strong>important</strong> text
          <em>with emphasis</em>.
        </p>

        <!-- GOOD: Separate links with proper spacing -->
        <nav aria-label="Article navigation">
          <a href="/article">Read full article</a>
          <span aria-hidden="true"> | </span>
          <a href="/comments">View comments (5)</a>
        </nav>

        <!-- GOOD: Single form -->
        <form action="/submit" method="post">
          <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" />
          </div>
          <button type="submit">Submit</button>
        </form>

        <!-- GOOD: Properly structured table -->
        <table class="data-table">
          <caption>Data Table with Proper Structure</caption>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
            <tr>
              <td>Data 3</td>
              <td>Data 4</td>
            </tr>
          </tbody>
        </table>

        <!-- GOOD: Proper semantic structure -->
        <aside class="additional-info">
          <h2>Additional Information</h2>
          <p>This is supplementary content.</p>
        </aside>
      </section>
    </article>
  `,
  standalone: true
})
export class ComplexValidComponent {}

// GOOD: Using afterNextRender for client-only content
import { afterNextRender } from '@angular/core';

@Component({
  selector: 'app-after-render',
  template: `
    <div>
      <!-- GOOD: Server-safe content -->
      <div>{{ serverSafeContent }}</div>

      <!-- GOOD: Client-specific content added after hydration -->
      <div #clientContent></div>
    </div>
  `,
  standalone: true
})
export class AfterRenderComponent {
  serverSafeContent = 'This renders on server and client';

  constructor() {
    // GOOD: Use afterNextRender for client-only modifications
    afterNextRender(() => {
      // Safe to manipulate DOM or add client-only content
      const clientDiv = document.querySelector('#clientContent');
      if (clientDiv) {
        clientDiv.textContent = 'This was added after hydration';
      }
    });
  }
}