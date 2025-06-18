import { CanActivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  return of(true);
};
