import { Injectable, Injector } from '@angular/core';

// GOOD: Break circular dependencies using Injector
@Injectable({
  providedIn: 'root'
})
export class ServiceA {
  constructor(private injector: Injector) {}

  doSomething() {
    // GOOD: Lazy injection to break circular dependency
    const serviceB = this.injector.get(ServiceB);
    return serviceB.getData();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceB {
  constructor() {} // No circular dependency

  getData() {
    // Return data without calling ServiceA
    return 'Data from ServiceB';
  }
}

// Alternative GOOD approach: Extract shared state to a third service
@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private data = 'Shared data';

  getData() {
    return this.data;
  }

  setData(data: string) {
    this.data = data;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceAAlternative {
  constructor(private sharedState: SharedStateService) {}

  doSomething() {
    return this.sharedState.getData();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceBAlternative {
  constructor(private sharedState: SharedStateService) {}

  getData() {
    return this.sharedState.getData();
  }
}