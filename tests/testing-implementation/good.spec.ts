// GOOD: Behavior testing instead of implementation testing
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// GOOD: Testing behavior, not implementation
describe('UserService (GOOD - Behavior Testing)', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return users when getUsers is called (GOOD: testing behavior)', () => {
    // GOOD: Testing WHAT the service does, not HOW
    const mockUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    // GOOD: Mock the HTTP response
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle error responses gracefully (GOOD: testing error behavior)', () => {
    // GOOD: Testing error handling behavior
    service.getUsers().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error).toBeDefined();
      }
    });

    const req = httpMock.expectOne('/api/users');
    req.error(new ErrorEvent('Network error'));
  });

  it('should emit users to subscribers (GOOD: testing observable behavior)', () => {
    // GOOD: Testing observable contract
    let emittedUsers: any[] | undefined;

    service.getUsers().subscribe(users => {
      emittedUsers = users;
    });

    const req = httpMock.expectOne('/api/users');
    req.flush([{ id: 1, name: 'Test User' }]);

    expect(emittedUsers).toEqual([{ id: 1, name: 'Test User' }]);
  });
});

// GOOD: Component testing focused on behavior
import { ComponentFixture } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';

describe('UserListComponent (GOOD - Behavior Testing)', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should display user names in the list (GOOD: testing user-visible behavior)', () => {
    // GOOD: Testing what the user sees
    component.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    fixture.detectChanges();

    // GOOD: Testing rendered output
    const userElements = fixture.nativeElement.querySelectorAll('.user-name');
    expect(userElements.length).toBe(2);
    expect(userElements[0].textContent).toContain('John Doe');
    expect(userElements[1].textContent).toContain('Jane Smith');
  });

  it('should emit selectUser event when user is clicked (GOOD: testing interaction behavior)', () => {
    // GOOD: Testing component interaction contract
    spyOn(component.selectUser, 'emit');

    component.users = [{ id: 1, name: 'John', email: 'john@example.com' }];
    fixture.detectChanges();

    // GOOD: Testing user interaction
    const userElement = fixture.nativeElement.querySelector('.user-item');
    userElement.click();

    expect(component.selectUser.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 1, name: 'John' })
    );
  });

  it('should show loading indicator while loading (GOOD: testing loading behavior)', () => {
    // GOOD: Testing loading state behavior
    component.isLoading = true;
    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('.loading');
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.textContent).toContain('Loading');

    // GOOD: Test loading completion
    component.isLoading = false;
    fixture.detectChanges();

    const loadingElementAfter = fixture.nativeElement.querySelector('.loading');
    expect(loadingElementAfter).toBeFalsy();
  });

  it('should filter users based on search term (GOOD: testing filtering behavior)', () => {
    // GOOD: Testing business logic behavior
    component.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    component.searchTerm = 'John';
    component.ngOnInit(); // Trigger filtering logic
    fixture.detectChanges();

    // GOOD: Testing that filtering works as expected
    const visibleUsers = fixture.nativeElement.querySelectorAll('.user-item');
    expect(visibleUsers.length).toBe(2); // John Doe and Bob Johnson
  });
});

// GOOD: Service testing with proper mocking
describe('UserService with Mock (GOOD - Testing Integration Behavior)', () => {
  let service: UserService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });

    service = TestBed.inject(UserService);
    mockHttpClient = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should call API and transform response (GOOD: testing integration behavior)', () => {
    // GOOD: Testing the service's behavior with mocked dependencies
    const mockResponse = { users: [{ id: 1, name: 'John' }] };
    mockHttpClient.get.and.returnValue(of(mockResponse));

    service.getUsers().subscribe(users => {
      expect(users).toEqual([{ id: 1, name: 'John' }]);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/users');
  });
});

// Helper function for mocking
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';