// BAD: Excessive any type usage
import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// BAD: Function parameters with any type
function processData(data: any): any {
  // BAD: Any allows any operation without type checking
  return data.processed ? data.result : data;
}

// BAD: Class properties with any type
@Injectable({
  providedIn: 'root'
})
export class DataService {
  // BAD: Any type for service data
  private data: any;

  constructor(private http: HttpClient) {}

  // BAD: Any return type
  getData(): any {
    return this.http.get('/api/data');
  }

  // BAD: Any parameters
  saveData(data: any): any {
    return this.http.post('/api/data', data);
  }

  // BAD: Any in method signatures
  processResponse(response: any): any {
    // BAD: No type safety
    if (response.success) {
      return response.data;
    }
    return null;
  }
}

// BAD: Component with any types
@Component({
  selector: 'app-data-display',
  template: `
    <div *ngFor="let item of items">
      {{ item.name }} - {{ item.value }}
    </div>
  `,
  standalone: true
})
export class DataDisplayComponent {
  // BAD: Any array type
  items: any[] = [];

  // BAD: Any object type
  config: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // BAD: Any return type from service
    const data: any = this.dataService.getData();
    this.items = data.items;
    this.config = data.config;
  }

  // BAD: Any parameter in event handler
  onItemClick(item: any) {
    // BAD: No type safety for item operations
    console.log(item.id, item.name);
    this.dataService.saveData(item);
  }

  // BAD: Any in utility methods
  transformData(data: any): any {
    // BAD: Any transformation without type checking
    return {
      ...data,
      transformed: true,
      timestamp: new Date()
    };
  }
}

// BAD: Interface with any properties
export interface ApiResponse {
  success: boolean;
  data: any;        // BAD: Any for response data
  errors: any[];    // BAD: Any array for errors
  metadata: any;    // BAD: Any for metadata
}

// BAD: Generic class with any constraints
export class GenericContainer<T = any> {  // BAD: Default any type
  private items: T[] = [];

  // BAD: Any in generic methods
  addItem(item: any): void {
    this.items.push(item);
  }

  // BAD: Any return type in generic class
  getItem(index: any): T {
    return this.items[index];
  }
}

// BAD: Function with multiple any parameters
export function mergeObjects(target: any, source: any): any {
  // BAD: No type safety in merge operation
  return { ...target, ...source };
}

// BAD: Utility functions with any
export class Utils {
  static clone(obj: any): any {
    // BAD: Any type for cloning
    return JSON.parse(JSON.stringify(obj));
  }

  static isEmpty(value: any): boolean {
    // BAD: Any type checking
    return value == null || value === '';
  }

  static format(value: any, format: any): string {
    // BAD: Any formatting
    return `${format.prefix || ''}${value}${format.suffix || ''}`;
  }
}

// BAD: Event handling with any
export class EventHandler {
  private listeners: any[] = [];

  // BAD: Any event type
  addListener(event: any, callback: any): void {
    this.listeners.push({ event, callback });
  }

  // BAD: Any event triggering
  trigger(event: any, data: any): void {
    this.listeners
      .filter((l: any) => l.event === event)
      .forEach((l: any) => l.callback(data));
  }
}