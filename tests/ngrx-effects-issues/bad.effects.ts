import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

// BAD: NgRx effects with improper error handling and infinite loops
@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  // BAD: catchError in wrong position - terminates effect on first error
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Load Users'),
      switchMap(() =>
        this.http.get('/api/users').pipe(
          // BAD: catchError here terminates the entire effect stream
          catchError(error => of({ type: '[User] Load Users Failure', error }))
        )
      ),
      map(users => ({ type: '[User] Load Users Success', users }))
    )
  );

  // BAD: Missing error handling - effect will die on error
  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Save User'),
      switchMap(action =>
        this.http.post('/api/users', action.user).pipe(
          // BAD: No catchError - effect stops working on first error
          map(response => ({ type: '[User] Save User Success', user: response }))
        )
      )
    )
  );

  // BAD: Infinite loop - effect dispatches action it listens to
  processUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Process User'),
      switchMap(action =>
        this.http.post('/api/process-user', action.user).pipe(
          map(response => ({
            type: '[User] Process User Success',
            user: response
          })),
          // BAD: This success action triggers another '[User] Process User' - INFINITE LOOP
          catchError(() => of({ type: '[User] Process User' }))
        )
      )
    )
  );

  // BAD: Complex effect with multiple issues
  complexUserOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Complex Operation'),
      switchMap(action => {
        // BAD: Multiple HTTP calls without proper error handling
        const userCall = this.http.get(`/api/users/${action.userId}`);
        const settingsCall = this.http.get(`/api/users/${action.userId}/settings`);

        return userCall.pipe(
          switchMap(user => settingsCall.pipe(
            switchMap(settings => this.http.post('/api/process', { user, settings })),
            // BAD: Nested catchError in wrong position
            catchError(() => of({ type: '[User] Settings Error' }))
          )),
          // BAD: Outer catchError terminates effect
          catchError(() => of({ type: '[User] User Error' }))
        );
      }),
      map(result => ({ type: '[User] Complex Operation Success', result }))
    )
  );

  // BAD: Effect that dispatches multiple actions sequentially (causes issues)
  cascadeActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Cascade Start'),
      switchMap(() =>
        this.http.get('/api/config').pipe(
          map(config => ({ type: '[User] Load Users' })), // BAD: Dispatches another action
          catchError(() => of({ type: '[User] Cascade Failure' }))
        )
      )
    )
  );

  // BAD: Effect with improper error recovery
  retryOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Retry Operation'),
      switchMap(action =>
        this.http.post('/api/retry', action.data).pipe(
          map(response => ({ type: '[User] Retry Success', response })),
          // BAD: catchError dispatches the same action - potential infinite loop
          catchError(() => of({ type: '[User] Retry Operation', data: action.data }))
        )
      )
    )
  );
}

// BAD: Additional effect class with circular dependencies
@Injectable()
export class CircularEffects {
  constructor(
    private actions$: Actions,
    private userEffects: UserEffects // BAD: Injecting other effects
  ) {}

  // BAD: Effects that depend on each other
  circularEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Start Circular'),
      tap(() => {
        // BAD: Manually calling other effects
        this.userEffects.loadUsers$.subscribe();
      }),
      map(() => ({ type: '[App] Circular Complete' }))
    )
  );
}