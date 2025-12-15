// GOOD: Proper null handling without non-null assertions

// GOOD: Service with proper null handling
export class UserService {
  private currentUser: User | null = null;

  // GOOD: Proper null checking
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // GOOD: Null-safe property access
  getUserName(): string | null {
    return this.currentUser?.name ?? null;
  }

  // GOOD: Safe array access with optional chaining
  getFirstItem(): Item | null {
    const items = this.getItems();
    return items?.[0] ?? null;
  }

  // GOOD: Proper null checking in function parameters
  processUser(user: User | null): void {
    if (user) {
      this.validateUser(user);
    } else {
      throw new Error('User is required');
    }
  }

  private validateUser(user: User): void {
    // Validation logic
  }

  private getItems(): Item[] | null {
    return null; // Simulate potential null return
  }
}

// GOOD: Component with proper null handling
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div>
      @if (user) {
        <div>{{ user.name }}</div>
      } @else {
        <div>Please log in</div>
      }
    </div>
  `,
  standalone: false
})
export class UserProfileComponent {
  @Input() user: User | null = null;

  // GOOD: Null-safe property access
  get displayName(): string {
    return this.user?.name ?? 'Unknown User';
  }

  // GOOD: Proper null checking in methods
  updateUser(): void {
    if (!this.user) {
      throw new Error('No user to update');
    }

    this.user.name = 'Updated';
    this.user.email = 'updated@email.com';
  }

  // GOOD: Safe event handlers
  onSave(): void {
    if (this.user?.isValid()) {
      this.saveUser(this.user);
    } else {
      console.error('Invalid user data');
    }
  }

  private saveUser(user: User): void {
    // Save logic
  }
}

// GOOD: Utility functions with proper null handling
export class ArrayUtils {
  // GOOD: Safe array access
  static first<T>(array: T[] | null | undefined): T | null {
    return array?.[0] ?? null;
  }

  // GOOD: Proper handling of nullable array elements
  static mapToString<T>(items: (T | null | undefined)[]): string[] {
    return items
      .filter((item): item is T => item != null)
      .map(item => item.toString());
  }

  // GOOD: Safe nested property access
  static getNestedValue(obj: any): string | null {
    return obj?.property?.nested?.value ?? null;
  }
}

// GOOD: API service with proper null handling
export class ApiService {
  // GOOD: Proper response handling
  getData(): Observable<Data | null> {
    return this.http.get('/api/data').pipe(
      map(response => response ?? null),
      catchError(error => {
        console.error('API Error:', error?.message ?? 'Unknown error');
        return of(null);
      })
    );
  }

  // GOOD: Safe URL construction
  buildUrl(params: Params | null | undefined): string | null {
    if (!params?.id) {
      return null;
    }

    const baseUrl = 'https://api.example.com';
    return `${baseUrl}/${params.id}`;
  }

  private http: any; // Mock
}

// GOOD: Configuration class with proper null handling
export class AppConfig {
  private config: Config | null = null;

  // GOOD: Safe configuration access
  get apiUrl(): string | null {
    return this.config?.apiUrl ?? null;
  }

  // GOOD: Safe nested config access
  get databaseConfig(): DatabaseConfig | null {
    return this.config?.database ?? null;
  }

  // GOOD: Safe array config access
  get featureFlags(): string[] {
    return this.config?.features ?? [];
  }

  loadConfig(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.config = {
          apiUrl: 'https://api.example.com',
          database: { host: 'localhost', port: 5432 },
          features: ['feature1', 'feature2']
        };
        resolve();
      }, 1000);
    });
  }
}

// GOOD: Form validation with proper null handling
export class FormValidator {
  // GOOD: Safe email validation
  validateEmail(email: string | null | undefined): boolean {
    return email ? email.includes('@') : false;
  }

  // GOOD: Safe form validation
  validateUserForm(form: UserForm | null | undefined): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [] };

    if (!form?.name) {
      result.errors.push('Name is required');
      result.isValid = false;
    }

    if (!this.validateEmail(form?.email)) {
      result.errors.push('Invalid email');
      result.isValid = false;
    }

    return result;
  }
}

// GOOD: Data transformation with proper null handling
export class DataTransformer {
  // GOOD: Safe data mapping
  transformUsers(apiUsers: ApiUser[] | null | undefined): User[] {
    if (!apiUsers) {
      return [];
    }

    return apiUsers
      .filter((apiUser): apiUser is Required<ApiUser> =>
        apiUser?.id != null && apiUser?.name != null && apiUser?.email != null
      )
      .map(apiUser => ({
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email
      }));
  }

  // GOOD: Safe object transformation
  transformToDto(entity: Entity | null | undefined): DTO | null {
    if (!entity?.id || !entity?.name || !entity?.createdAt) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt.toISOString()
    };
  }
}

// GOOD: Error handling with proper null checks
export class ErrorHandler {
  // GOOD: Safe error logging
  logError(error: Error | null | undefined): void {
    if (!error) {
      console.error('Unknown error occurred');
      return;
    }

    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }

  // GOOD: Safe error recovery
  recoverFromError(error: CustomError | null | undefined): void {
    if (!error?.code) {
      console.error('Invalid error object');
      return;
    }

    switch (error.code) {
      case 'NETWORK_ERROR':
        this.handleNetworkError(error);
        break;
      case 'VALIDATION_ERROR':
        this.handleValidationError(error);
        break;
      default:
        console.error('Unknown error code:', error.code);
    }
  }

  private handleNetworkError(error: CustomError): void {
    console.log('Handling network error:', error.message);
  }

  private handleValidationError(error: CustomError): void {
    console.log('Handling validation error:', error.message);
  }
}

// GOOD: Test utilities with proper null handling
export class TestUtils {
  // GOOD: Safe test user creation
  static createTestUser(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      ...overrides
    };
  }

  // GOOD: Safe mock setup
  static mockHttpResponse(): any {
    return {
      data: {
        users: [TestUtils.createTestUser()]
      }
    };
  }
}

// GOOD: Router guards with proper null handling
import { CanActivate } from '@angular/router';

export class AuthGuard implements CanActivate {
  // GOOD: Safe route guard
  canActivate(route: any): boolean {
    const user = this.getCurrentUser();
    return user?.isAuthenticated ?? false;
  }

  private getCurrentUser(): User | null {
    return null; // Simulate no user
  }
}

// GOOD: Environment-based configuration
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com'
};

// GOOD: Safe environment configuration
export class EnvironmentConfig {
  static get apiUrl(): string {
    return environment?.apiUrl ?? 'http://localhost:4200';
  }

  static get config(): any {
    return environment?.config ?? {};
  }
}

// GOOD: Type-safe null handling utilities
export class NullSafeUtils {
  // GOOD: Safe property access
  static getProperty<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | null {
    return obj?.[key] ?? null;
  }

  // GOOD: Safe method call
  static callMethod<T, R>(obj: T | null | undefined, method: (obj: T) => R): R | null {
    return obj ? method(obj) : null;
  }

  // GOOD: Safe array operations
  static filterNulls<T>(array: (T | null | undefined)[]): T[] {
    return array.filter((item): item is T => item != null);
  }
}

// GOOD: Reactive forms with null safety
import { FormGroup, FormControl } from '@angular/forms';

export class SafeFormHandler {
  private form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  });

  // GOOD: Safe form value access
  getFormData(): UserForm | null {
    const value = this.form.value;
    if (!value?.name || !value?.email) {
      return null;
    }
    return value as UserForm;
  }

  // GOOD: Safe form submission
  submitForm(): void {
    const data = this.getFormData();
    if (data) {
      this.processFormData(data);
    } else {
      console.error('Invalid form data');
    }
  }

  private processFormData(data: UserForm): void {
    console.log('Processing:', data);
  }
}

// Mock interfaces for examples
interface User {
  id: number;
  name: string;
  email: string;
  isValid(): boolean;
  isAuthenticated?: boolean;
}

interface Item {
  value: string;
}

interface Params {
  id?: string;
}

interface Data {
  items: Item[];
}

interface Config {
  apiUrl?: string;
  database?: DatabaseConfig;
  features?: string[];
}

interface DatabaseConfig {
  host: string;
  port: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface UserForm {
  name: string;
  email: string;
}

interface ApiUser {
  id?: number;
  name?: string;
  email?: string;
}

interface Entity {
  id?: number;
  name?: string;
  createdAt?: Date;
}

interface DTO {
  id: number;
  name: string;
  createdAt: string;
}

interface CustomError {
  code?: string;
  message: string;
}

// Mock Observable imports
declare const Observable: any;
declare const of: any;
declare const map: any;
declare const catchError: any;