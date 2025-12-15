// BAD: Resource API race conditions - ignoring abortSignal
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

  // BAD: Ignoring abortSignal causes race conditions
  userResource = resource({
    params: () => ({ query: this.searchQuery() }),
    loader: ({ params }) => {
      // BAD: No abortSignal parameter used - race conditions possible
      return fetch(`/api/users/search?q=${params.query}`)
        .then(response => response.json());
    }
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }
}

// BAD: Multiple resources without abort signal handling
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div>User: {{ userResource.value()?.name }}</div>
      <div>Posts: {{ postsResource.value()?.length }}</div>
      <div>Settings: {{ settingsResource.value()?.theme }}</div>
    </div>
  `,
  standalone: true
})
export class DashboardComponent {
  userId = signal(1);

  // BAD: Multiple resources ignoring abort signals
  userResource = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params }) => {
      // BAD: No abortSignal - old requests complete after new ones
      return fetch(`/api/users/${params.id}`).then(r => r.json());
    }
  });

  postsResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params }) => {
      // BAD: Race condition - wrong posts may display
      return fetch(`/api/users/${params.userId}/posts`).then(r => r.json());
    }
  });

  settingsResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params }) => {
      // BAD: Stale settings may override current ones
      return fetch(`/api/users/${params.userId}/settings`).then(r => r.json());
    }
  });
}

// BAD: Complex resource with nested API calls
@Component({
  selector: 'app-project-details',
  template: `
    <div class="project-details">
      <h1>{{ projectResource.value()?.name }}</h1>
      <div>Members: {{ membersResource.value()?.length }}</div>
      <div>Tasks: {{ tasksResource.value()?.length }}</div>
    </div>
  `,
  standalone: true
})
export class ProjectDetailsComponent {
  projectId = signal(1);

  // BAD: Complex resource without abort signal
  projectResource = resource({
    params: () => ({ id: this.projectId() }),
    loader: async ({ params }) => {
      // BAD: No abort signal handling
      const project = await fetch(`/api/projects/${params.id}`).then(r => r.json());

      // BAD: Nested calls also ignore abort signal
      const [members, tasks] = await Promise.all([
        fetch(`/api/projects/${params.id}/members`).then(r => r.json()),
        fetch(`/api/projects/${params.id}/tasks`).then(r => r.json())
      ]);

      return { ...project, members, tasks };
    }
  });

  // BAD: Separate resources without coordination
  membersResource = resource({
    params: () => ({ projectId: this.projectId() }),
    loader: ({ params }) => {
      // BAD: May complete after project changed
      return fetch(`/api/projects/${params.projectId}/members`).then(r => r.json());
    }
  });

  tasksResource = resource({
    params: () => ({ projectId: this.projectId() }),
    loader: ({ params }) => {
      // BAD: Race condition with members request
      return fetch(`/api/projects/${params.projectId}/tasks`).then(r => r.json());
    }
  });
}

// BAD: Search with debounce but no abort signal
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

  // BAD: Debounced but still has race conditions
  searchResource = resource({
    params: () => ({ q: this.query() }),
    loader: ({ params }) => {
      if (!params.q || params.q.length < 2) {
        return Promise.resolve([]);
      }

      // BAD: No abort signal - slow responses can overwrite fast ones
      return new Promise(resolve => {
        setTimeout(() => {
          fetch(`/api/search?q=${params.q}`)
            .then(r => r.json())
            .then(resolve);
        }, 300); // Debounce simulation
      });
    }
  });

  updateQuery(value: string) {
    this.query.set(value);
  }
}