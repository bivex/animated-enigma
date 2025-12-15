// BAD: Non-null assertion operator abuse anti-patterns

// BAD: Service with unsafe non-null assertions
export class UserService {
  private currentUser: User | null = null;

  // BAD: Non-null assertion without proper null checking
  getCurrentUser(): User {
    return this.currentUser!; // BAD: Will throw if null
  }

  // BAD: Chained non-null assertions
  getUserName(): string {
    return this.currentUser!.name!; // BAD: Double assertion, very unsafe
  }

  // BAD: Non-null assertion in array access
  getFirstItem(): Item {
    const items = this.getItems();
    return items![0]!; // BAD: Assuming array exists and has items
  }

  // BAD: Non-null assertion in function parameters
  processUser(user: User | null): void {
    this.validateUser(user!); // BAD: Forcing non-null when it could be null
  }

  private validateUser(user: User): void {
    // Validation logic
  }

  private getItems(): Item[] | null {
    return null; // Simulate potential null return
  }
}

// BAD: Component with non-null assertion abuse
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: '<div>{{ user!.name }}</div>', // BAD: Non-null assertion in template
  standalone: false
})
export class UserProfileComponent {
  @Input() user: User | null = null;

  // BAD: Non-null assertion in property access
  get displayName(): string {
    return this.user!.name; // BAD: Will throw if user is null
  }

  // BAD: Non-null assertion in method calls
  updateUser(): void {
    this.user!.name = 'Updated'; // BAD: Assuming user exists
    this.user!.email = 'updated@email.com'; // BAD: Multiple assertions
  }

  // BAD: Non-null assertion in event handlers
  onSave(): void {
    if (this.user!.isValid()) { // BAD: Assertion in condition
      this.saveUser(this.user!); // BAD: Another assertion
    }
  }

  private saveUser(user: User): void {
    // Save logic
  }
}

// BAD: Utility functions with non-null assertions
export class ArrayUtils {
  // BAD: Non-null assertion in utility function
  static first<T>(array: T[] | null): T {
    return array![0]; // BAD: Will throw if array is null or empty
  }

  // BAD: Non-null assertion with generic types
  static mapToString<T>(items: (T | null)[]): string[] {
    return items.map(item => item!.toString()); // BAD: Assuming all items are non-null
  }

  // BAD: Chained method calls with assertions
  static getNestedValue(obj: any): string {
    return obj!.property!.nested!.value; // BAD: Multiple unsafe assertions
  }
}

// BAD: API service with non-null assertions
export class ApiService {
  // BAD: Non-null assertion in HTTP response handling
  getData(): Observable<Data> {
    return this.http.get('/api/data').pipe(
      map(response => response!), // BAD: Assuming response is never null
      catchError(error => {
        // BAD: Non-null assertion in error handling
        throw new Error(error!.message);
      })
    );
  }

  // BAD: Non-null assertion in URL construction
  buildUrl(params: Params | null): string {
    const baseUrl = 'https://api.example.com';
    return `${baseUrl}/${params!.id}`; // BAD: Assuming params exists
  }

  private http: any; // Mock
}

// BAD: Configuration class with non-null assertions
export class AppConfig {
  private config: Config | null = null;

  // BAD: Non-null assertion in configuration access
  get apiUrl(): string {
    return this.config!.apiUrl; // BAD: Will throw if config not loaded
  }

  // BAD: Non-null assertion in nested config access
  get databaseConfig(): DatabaseConfig {
    return this.config!.database!; // BAD: Double assertion
  }

  // BAD: Non-null assertion in array config access
  get featureFlags(): string[] {
    return this.config!.features!; // BAD: Assuming features array exists
  }

  loadConfig(): void {
    // Simulate async config loading
    setTimeout(() => {
      this.config = { apiUrl: 'https://api.example.com', database: {}, features: [] };
    }, 1000);
  }
}

// BAD: Form validation with non-null assertions
export class FormValidator {
  // BAD: Non-null assertion in validation
  validateEmail(email: string | null): boolean {
    return email!.includes('@'); // BAD: Will throw if email is null
  }

  // BAD: Non-null assertion in complex validation
  validateUserForm(form: UserForm | null): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [] };

    if (!form!.name) { // BAD: Assertion in condition
      result.errors.push('Name is required');
      result.isValid = false;
    }

    if (!this.validateEmail(form!.email)) { // BAD: Multiple assertions
      result.errors.push('Invalid email');
      result.isValid = false;
    }

    return result;
  }
}

// BAD: Data transformation with non-null assertions
export class DataTransformer {
  // BAD: Non-null assertion in data mapping
  transformUsers(apiUsers: ApiUser[] | null): User[] {
    return apiUsers!.map(apiUser => ({
      id: apiUser!.id, // BAD: Assertion in map
      name: apiUser!.name!, // BAD: Double assertion
      email: apiUser!.email! // BAD: Another assertion
    }));
  }

  // BAD: Non-null assertion in object transformation
  transformToDto(entity: Entity | null): DTO {
    return {
      id: entity!.id,
      name: entity!.name,
      createdAt: entity!.createdAt!.toISOString() // BAD: Chained assertions
    };
  }
}

// BAD: Error handling with non-null assertions
export class ErrorHandler {
  // BAD: Non-null assertion in error logging
  logError(error: Error | null): void {
    console.error('Error:', error!.message); // BAD: Will throw if error is null
    console.error('Stack:', error!.stack); // BAD: Another assertion
  }

  // BAD: Non-null assertion in error recovery
  recoverFromError(error: CustomError | null): void {
    switch (error!.code) { // BAD: Assertion in switch
      case 'NETWORK_ERROR':
        this.handleNetworkError(error!); // BAD: Another assertion
        break;
      case 'VALIDATION_ERROR':
        this.handleValidationError(error!); // BAD: Another assertion
        break;
    }
  }

  private handleNetworkError(error: CustomError): void {}
  private handleValidationError(error: CustomError): void {}
}

// BAD: Test utilities with non-null assertions
export class TestUtils {
  // BAD: Non-null assertion in test helpers
  static createTestUser(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      ...overrides!
    } as User; // BAD: Type assertion with non-null
  }

  // BAD: Non-null assertion in mock setup
  static mockHttpResponse(): any {
    return {
      data: {
        users: [TestUtils.createTestUser()]!
      }
    };
  }
}

// BAD: Router guards with non-null assertions
import { CanActivate } from '@angular/router';

export class AuthGuard implements CanActivate {
  // BAD: Non-null assertion in route guard
  canActivate(route: any): boolean {
    const user = this.getCurrentUser();
    return user!.isAuthenticated; // BAD: Assuming user exists
  }

  private getCurrentUser(): User | null {
    return null; // Simulate no user
  }
}

// BAD: Module configuration with non-null assertions
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com'
};

// BAD: Environment-based configuration with assertions
export class EnvironmentConfig {
  static get apiUrl(): string {
    return environment!.apiUrl; // BAD: Unnecessary assertion on imported object
  }

  static get config(): any {
    return environment!.config!; // BAD: Double assertion for nested config
  }
}

// Mock interfaces for examples
interface User {
  id: number;
  name: string;
  email: string;
  isValid(): boolean;
}

interface Item {
  value: string;
}

interface Params {
  id: string;
}

interface Data {
  items: Item[];
}

interface Config {
  apiUrl: string;
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
  id: number;
  name: string;
  createdAt?: Date;
}

interface DTO {
  id: number;
  name: string;
  createdAt: string;
}

interface CustomError {
  code: string;
  message: string;
}

// Mock Observable import
declare const Observable: any;