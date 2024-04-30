import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class AppendCommonDetails implements HttpInterceptor {

  private ngxLoader = inject(NgxUiLoaderService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // console.log(req?.method);
    if( req?.method == 'GET' ){
      return next.handle(req);
    }

    var id = localStorage.getItem('Email');
    if(!id){
      alert('Session expired. Please log in again.');
      // Stop further code execution and return an error response
      // window.location.href = `${environment.menuRedirect}`
      return throwError(() => new Error('Session Expired'));
    }
    else if (req.headers.get('exception') == 'reportApi') {
      this.ngxLoader.startLoader('secondaryLoader');
      const newReq = req.clone({
        body: { ...req.body, UserId: id },
      });
      return next.handle(newReq).pipe(
        catchError((err) => {
          // console.log(err);
          this.ngxLoader.stopLoader('secondaryLoader');
          alert('Something went wrong at server while printing report.Contact Customer Care')
          return throwError(() => new Error(err));
        }),
        finalize(()=>{
          this.ngxLoader.stopLoader('secondaryLoader');
        })
      );
    }
    else if (req.headers.get('exception') == 'UserId') {
      const newReq = req.clone({
        body: { ...req.body, UserId: id },
      });
      return next.handle(newReq).pipe(
        catchError((err) => {
          // alert('Something went wrong at server while printing report .Contact Customer Care')
          // return throwError(() => new Error(err));
          return throwError(() => { 
            return err;
          });
        })
      );
    }
    else if (req.headers.get('exception') == 'pass') {
      return next.handle(req).pipe(
        catchError((err) => {
          // alert('Something went wrong at server while printing report .Contact Customer Care')
          return throwError(() => new Error(err));
        })
      );
    }
    else {
      const newReq = req.clone({
        body: { ...req.body, id: id },
      });
      return next.handle(newReq).pipe(
        catchError((err) => {
          // alert('Something went wrong at server'); 
          // return throwError(() => new Error(err));
          return throwError(() => { 
            return err;
          });
        })
      );
    }
  }
}
