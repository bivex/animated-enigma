// GOOD: Proper TypeScript typing without any
import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// GOOD: Proper interfaces and types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
  metadata: {
    timestamp: Date;
    version: string;
  };
}

interface Config {
  theme: 'light' | 'dark';
  language: string;
  features: string[];
}

// GOOD: Properly typed service
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: User[] = [];

  constructor(private http: HttpClient) {}

  // GOOD: Proper return type
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  // GOOD: Typed parameters and return
  saveUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }

  // GOOD: Typed response processing
  processUserResponse(response: ApiResponse<User>): User | null {
    if (response.success) {
      return response.data;
    }
    return null;
  }
}

// GOOD: Properly typed component
@Component({
  selector: 'app-data-display',
  template: `
    <div *ngFor="let user of users">
      {{ user.name }} ({{ user.role }}) - {{ user.email }}
    </div>
  `,
  standalone: true
})
export class DataDisplayComponent {
  // GOOD: Properly typed arrays
  users: User[] = [];

  // GOOD: Properly typed configuration
  config: Config = {
    theme: 'light',
    language: 'en',
    features: []
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // GOOD: Proper observable handling
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // GOOD: Properly typed event handler
  onUserClick(user: User) {
    console.log(user.id, user.name);
    this.dataService.saveUser(user).subscribe();
  }

  // GOOD: Properly typed utility methods
  transformUser(user: User): User & { lastModified: Date } {
    return {
      ...user,
      lastModified: new Date()
    };
  }
}

// GOOD: Properly typed generic class
export class Container<T extends { id: number }> {
  private items: T[] = [];

  // GOOD: Type-safe methods
  addItem(item: T): void {
    this.items.push(item);
  }

  // GOOD: Type-safe retrieval
  getItem(index: number): T | undefined {
    return this.items[index];
  }

  // GOOD: Type-safe finding
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
}

// GOOD: Properly typed utility functions
export function mergeUsers(target: User, source: Partial<User>): User {
  return { ...target, ...source };
}

// GOOD: Properly typed utility class
export class Utils {
  static clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  static isEmpty(value: string | null | undefined): boolean {
    return value == null || value.trim() === '';
  }

  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }
}

// GOOD: Properly typed event system
export class TypedEventHandler<T extends Record<string, any>> {
  private listeners: Array<{ event: keyof T; callback: (data: T[keyof T]) => void }> = [];

  addListener<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    this.listeners.push({ event, callback });
  }

  trigger<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }
}

// GOOD: Usage example
const eventHandler = new TypedEventHandler<{
  userCreated: User;
  configChanged: Config;
}>();

eventHandler.addListener('userCreated', (user) => {
  console.log('User created:', user.name);
});

eventHandler.addListener('configChanged', (config) => {
  console.log('Config changed:', config.theme);
});