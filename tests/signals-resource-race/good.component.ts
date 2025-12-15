// GOOD: Resource API with proper abortSignal handling
import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-user-search',
  template: `
    <div class="user-search">
      <input
        type="text"
        [value]="searchQuery()"
        (input)="updateSearch($any($event.target).value)"
        placeholder="Search users..."
      />
      <div *ngIf="userResource.isLoading()">Loading...</div>
      <div *ngIf="userResource.error()">Error: {{ userResource.error() }}</div>
      <ul *ngIf="userResource.value()">
        <li *ngFor="let user of userResource.value()">
          {{ user.name }} ({{ user.email }})
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class UserSearchComponent {
  searchQuery = signal('');

  // GOOD: Proper abortSignal handling prevents race conditions
  userResource = resource({
    params: () => ({ query: this.searchQuery() }),
    loader: ({ params, abortSignal }) => {
      // GOOD: Pass abortSignal to fetch
      return fetch(`/api/users/search?q=${params.query}`, {
        signal: abortSignal // GOOD: Cancels old requests
      }).then(response => response.json());
    }
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }
}

// GOOD: Coordinated resources with abort signals
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div *ngIf="userResource.value() as user">
        <h2>{{ user.name }}</h2>
        <div>Posts: {{ postsResource.value()?.length || 0 }}</div>
        <div>Settings: {{ settingsResource.value()?.theme }}</div>
      </div>
    </div>
  `,
  standalone: true
})
export class DashboardComponent {
  userId = signal(1);

  // GOOD: All resources use abortSignal
  userResource = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) => {
      return fetch(`/api/users/${params.id}`, { signal: abortSignal })
        .then(r => r.json());
    }
  });

  postsResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params, abortSignal }) => {
      return fetch(`/api/users/${params.userId}/posts`, { signal: abortSignal })
        .then(r => r.json());
    }
  });

  settingsResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params, abortSignal }) => {
      return fetch(`/api/users/${params.userId}/settings`, { signal: abortSignal })
        .then(r => r.json());
    }
  });
}

// GOOD: Single coordinated resource for complex data
@Component({
  selector: 'app-project-details',
  template: `
    <div class="project-details">
      <div *ngIf="projectResource.value() as project">
        <h1>{{ project.name }}</h1>
        <div>Members: {{ project.members?.length || 0 }}</div>
        <div>Tasks: {{ project.tasks?.length || 0 }}</div>
      </div>
    </div>
  `,
  standalone: true
})
export class ProjectDetailsComponent {
  projectId = signal(1);

  // GOOD: Single resource coordinates all related data
  projectResource = resource({
    params: () => ({ id: this.projectId() }),
    loader: async ({ params, abortSignal }) => {
      // GOOD: Abort signal passed to all requests
      const projectResponse = fetch(`/api/projects/${params.id}`, { signal: abortSignal });
      const membersResponse = fetch(`/api/projects/${params.id}/members`, { signal: abortSignal });
      const tasksResponse = fetch(`/api/projects/${params.id}/tasks`, { signal: abortSignal });

      // GOOD: All requests abort together
      const [project, members, tasks] = await Promise.all([
        projectResponse.then(r => r.json()),
        membersResponse.then(r => r.json()),
        tasksResponse.then(r => r.json())
      ]);

      return { ...project, members, tasks };
    }
  });
}

// GOOD: Typeahead with proper abort signal and debouncing
@Component({
  selector: 'app-typeahead-search',
  template: `
    <div class="typeahead">
      <input
        type="text"
        [value]="query()"
        (input)="updateQuery($any($event.target).value)"
        placeholder="Type to search..."
      />
      <div *ngIf="searchResource.isLoading()">Searching...</div>
      <ul *ngIf="searchResource.value()">
        <li *ngFor="let result of searchResource.value()">
          {{ result.title }}
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class TypeaheadSearchComponent {
  query = signal('');

  // GOOD: Abort signal prevents race conditions even with debouncing
  searchResource = resource({
    params: () => ({ q: this.query() }),
    loader: ({ params, abortSignal }) => {
      if (!params.q || params.q.length < 2) {
        return Promise.resolve([]);
      }

      // GOOD: Abort signal cancels previous requests
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          fetch(`/api/search?q=${params.q}`, { signal: abortSignal })
            .then(r => r.json())
            .then(resolve)
            .catch(reject);
        }, 300);

        // GOOD: Cleanup timeout if aborted
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error('Aborted'));
        });
      });
    }
  });

  updateQuery(value: string) {
    this.query.set(value);
  }
}

// GOOD: Resource with retry logic and abort handling
@Component({
  selector: 'app-retry-resource',
  template: `
    <div class="retry-resource">
      <div *ngIf="dataResource.isLoading()">Loading...</div>
      <div *ngIf="dataResource.error()">{{ dataResource.error() }}</div>
      <div *ngIf="dataResource.value()">
        Data: {{ dataResource.value() }}
      </div>
      <button (click)="retry()">Retry</button>
    </div>
  `,
  standalone: true
})
export class RetryResourceComponent {
  dataId = signal(1);
  retryCount = signal(0);

  // GOOD: Resource with retry logic and abort signal
  dataResource = resource({
    params: () => ({
      id: this.dataId(),
      retry: this.retryCount()
    }),
    loader: async ({ params, abortSignal }) => {
      let attempt = 0;
      const maxAttempts = 3;

      while (attempt < maxAttempts) {
        try {
          // GOOD: Each attempt respects abort signal
          const response = await fetch(`/api/data/${params.id}?attempt=${attempt}`, {
            signal: abortSignal
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          attempt++;

          // GOOD: Don't retry if aborted
          if (abortSignal.aborted) {
            throw error;
          }

          if (attempt >= maxAttempts) {
            throw error;
          }

          // GOOD: Wait before retry (also abortable)
          await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(resolve, 1000 * attempt);

            abortSignal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new Error('Aborted during retry delay'));
            });
          });
        }
      }
    }
  });

  retry() {
    // GOOD: Trigger retry by updating retry count
    this.retryCount.update(c => c + 1);
  }
}