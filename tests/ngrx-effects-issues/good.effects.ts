import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap, mergeMap, concatMap } from 'rxjs/operators';

// GOOD: NgRx effects with proper error handling and no infinite loops
@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  // GOOD: catchError in correct position - inside flattening operator
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Load Users'),
      switchMap(() =>
        this.http.get('/api/users').pipe(
          map((users: any) => ({ type: '[User] Load Users Success', users })),
          // GOOD: catchError inside switchMap - effect continues working
          catchError(error => of({ type: '[User] Load Users Failure', error }))
        )
      )
    )
  );

  // GOOD: Proper error handling for save operations
  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Save User'),
      switchMap(action =>
        this.http.post('/api/users', action.user).pipe(
          map((response: any) => ({ type: '[User] Save User Success', user: response })),
          // GOOD: Error handling allows effect to continue processing
          catchError(error => of({ type: '[User] Save User Failure', error }))
        )
      )
    )
  );

  // GOOD: No infinite loops - proper action naming
  processUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Process User'),
      switchMap(action =>
        this.http.post('/api/process-user', action.user).pipe(
          map((response: any) => ({
            type: '[User] Process User Completed', // GOOD: Different action type
            user: response
          })),
          // GOOD: Error action doesn't trigger the original action
          catchError(error => of({
            type: '[User] Process User Failed',
            error,
            userId: action.user.id
          }))
        )
      )
    )
  );

  // GOOD: Complex operations with proper error handling
  complexUserOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Complex Operation'),
      switchMap(action =>
        this.http.get(`/api/users/${action.userId}`).pipe(
          mergeMap(user =>
            this.http.get(`/api/users/${action.userId}/settings`).pipe(
              mergeMap(settings =>
                this.http.post('/api/process', { user, settings }).pipe(
                  map((result: any) => ({
                    type: '[User] Complex Operation Success',
                    result
                  })),
                  // GOOD: Error handling at each level
                  catchError(processError => of({
                    type: '[User] Complex Operation Process Failed',
                    error: processError
                  }))
                )
              ),
              // GOOD: Settings error doesn't stop user loading
              catchError(settingsError => of({
                type: '[User] Complex Operation Settings Failed',
                error: settingsError
              }))
            )
          ),
          // GOOD: User error handling
          catchError(userError => of({
            type: '[User] Complex Operation User Failed',
            error: userError
          }))
        )
      )
    )
  );

  // GOOD: Sequential action dispatching with proper error handling
  cascadeActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Cascade Start'),
      switchMap(() =>
        this.http.get('/api/config').pipe(
          map((config: any) => ({ type: '[User] Config Loaded', config })),
          catchError(error => of({ type: '[User] Cascade Failed', error }))
        )
      )
    )
  );

  // GOOD: Proper retry logic without infinite loops
  retryOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Retry Operation'),
      switchMap(action =>
        this.http.post('/api/retry', action.data).pipe(
          map((response: any) => ({ type: '[User] Retry Success', response })),
          // GOOD: Error action is different and includes retry count
          catchError(error => {
            const retryCount = (action.retryCount || 0) + 1;
            return retryCount < 3
              ? of({
                  type: '[User] Retry Operation',
                  data: action.data,
                  retryCount
                })
              : of({
                  type: '[User] Retry Failed',
                  error,
                  finalAttempt: true
                });
          })
        )
      )
    )
  );

  // GOOD: Effect that handles failures gracefully
  handleErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Load Users Failure', '[User] Save User Failure'),
      tap(action => {
        // GOOD: Side effects for error handling (logging, notifications)
        console.error('User operation failed:', action.error);
        // Could dispatch notification actions here
      })
    ),
    { dispatch: false } // GOOD: Non-dispatching effect
  );
}

// GOOD: Separate effects classes for different concerns
@Injectable()
export class NotificationEffects {
  constructor(private actions$: Actions) {}

  // GOOD: Effects focused on notifications
  notifySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Save User Success'),
      map(action => ({
        type: '[Notification] Show Success',
        message: 'User saved successfully'
      }))
    )
  );
}