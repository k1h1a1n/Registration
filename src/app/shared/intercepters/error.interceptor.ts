import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private sharedSvc: SharedService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (error.status === 0) {
          errorMessage = 'No Internet Connection';
        } else if (error.status === 500) {
          errorMessage = 'System Exception 500';
        } else if (error.status >= 400 && error.status < 500) {
          errorMessage = 'Client Error';
        } else if (error.status >= 500) {
          errorMessage = 'Server Down';
        }

        this.sharedSvc.showError(`${errorMessage}`);
        return  throwError(() => new Error(`${errorMessage}`));
      })
    );
  }
}
