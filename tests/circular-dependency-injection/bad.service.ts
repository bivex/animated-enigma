import { Injectable } from '@angular/core';

// BAD: Circular dependency between services
@Injectable({
  providedIn: 'root'
})
export class ServiceA {
  constructor(private serviceB: ServiceB) {}

  doSomething() {
    return this.serviceB.getData();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceB {
  constructor(private serviceA: ServiceA) {} // Circular dependency!

  getData() {
    return this.serviceA.doSomething(); // This creates infinite loop
  }
}