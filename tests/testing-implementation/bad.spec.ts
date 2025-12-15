// BAD: Implementation testing instead of behavior testing
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// BAD: Testing implementation details instead of behavior
describe('UserService (BAD - Implementation Testing)', () => {
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

  it('should call http.get with correct URL (BAD: testing implementation)', () => {
    // BAD: Testing HOW the service works, not WHAT it does
    service.getUsers().subscribe();

    // BAD: Testing internal HTTP call details
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should have private property initialized (BAD: testing private members)', () => {
    // BAD: Accessing private properties via type assertion
    const privateProperty = (service as any).usersCache;
    expect(privateProperty).toBeDefined();
  });

  it('should call internal method (BAD: testing private methods)', () => {
    // BAD: Testing private method implementation
    const result = (service as any).validateUser({ name: 'John' });
    expect(result).toBe(true);
  });

  it('should set loading flag during request (BAD: testing internal state)', () => {
    // BAD: Testing internal loading state
    service.getUsers().subscribe();

    // BAD: Accessing internal state
    expect((service as any).isLoading).toBe(true);

    const req = httpMock.expectOne('/api/users');
    req.flush([]);
  });

  it('should use specific caching strategy (BAD: testing implementation details)', () => {
    // BAD: Testing internal caching mechanism
    service.getUsers().subscribe();
    const req1 = httpMock.expectOne('/api/users');
    req1.flush([{ id: 1, name: 'John' }]);

    // BAD: Testing that it doesn't make second request (caching behavior)
    service.getUsers().subscribe();
    httpMock.expectNone('/api/users'); // This could break if caching is removed
  });
});

// BAD: Component testing with implementation details
import { ComponentFixture } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';

describe('UserListComponent (BAD - Implementation Testing)', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should have specific method called (BAD: testing method calls)', () => {
    // BAD: Spying on private methods
    spyOn<any>(component, 'formatUserName');

    component.ngOnInit();
    fixture.detectChanges();

    // BAD: Testing that internal method was called
    expect((component as any).formatUserName).toHaveBeenCalled();
  });

  it('should update DOM directly (BAD: testing DOM manipulation)', () => {
    component.users = [{ id: 1, name: 'John' }];
    fixture.detectChanges();

    // BAD: Testing exact DOM structure
    const userElement = fixture.nativeElement.querySelector('.user-item');
    expect(userElement.textContent).toContain('John');
    expect(userElement.classList.contains('user-item')).toBe(true);
  });

  it('should have correct internal state (BAD: testing component state)', () => {
    component.ngOnInit();

    // BAD: Testing internal component state
    expect((component as any).filteredUsers).toEqual([]);
    expect((component as any).isLoading).toBe(false);
  });
});