import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// BAD: This service should be provided in root
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

@Component({
  selector: 'app-provider-pollution-bad',
  template: `
    <div>
      <p>Provider Pollution Example</p>
    </div>
  `,
  providers: [
    // BAD: Providing a root-provided service creates a new instance
    // This breaks the singleton pattern expected for global services
    AuthService
  ]
})
export class ProviderPollutionBadComponent {
  constructor(private authService: AuthService) {
    // This authService is a different instance than the root one!
    // Other components expecting the singleton will not see changes
  }
}