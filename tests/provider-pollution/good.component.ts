import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// GOOD: Root-provided service
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post('/api/login', credentials);
  }

  logout() {
    return this.http.post('/api/logout', {});
  }
}

// GOOD: Local service for component-specific logic
@Injectable()
export class UserPreferencesService {
  private preferences: any = {};

  setPreference(key: string, value: any) {
    this.preferences[key] = value;
  }

  getPreference(key: string) {
    return this.preferences[key];
  }
}

@Component({
  selector: 'app-provider-pollution-good',
  template: `
    <div>
      <p>Provider Pollution Fixed</p>
    </div>
  `,
  providers: [
    // GOOD: Only provide services that should be scoped to this component
    UserPreferencesService
  ]
})
export class ProviderPollutionGoodComponent {
  constructor(
    private authService: AuthService,        // Root singleton instance
    private userPrefs: UserPreferencesService // New instance for this component
  ) {
    // authService is the same instance used app-wide
    // userPrefs is unique to this component and its children
  }
}