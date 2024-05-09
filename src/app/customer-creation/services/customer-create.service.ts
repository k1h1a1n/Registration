import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, tap, throwError } from 'rxjs';
import { CreateLogin, CustomerData } from '../model/customer-create';
import { environment } from 'src/environments/environment';
import { PreLoadingService } from 'src/app/shared/services/pre-loading.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerCreateService {
  private http = inject(HttpClient);
  constructor(private loadingService: PreLoadingService) { }

  getOtp(input : any): Observable<any>{
    this.loadingService.setLoadingState(true);
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`${environment.baseURL}/api/CommonAPI/LandmarkOTP`, input, header)
    .pipe(
      tap(() => this.loadingService.setLoadingState(false)),
      catchError((error) => {
        this.loadingService.setLoadingState(false);
        return throwError(() => { 
          return error;
        });
      })
    )
  }
  verifyOtp(input : any): Observable<any>{
    this.loadingService.setLoadingState(true);
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`${environment.baseURL}/api/CommonAPI/LandmarkVerifyOTP`, input, header)
    .pipe(
      tap(() => this.loadingService.setLoadingState(false)),
      catchError((error) => {
        this.loadingService.setLoadingState(false);
        return throwError(() => { 
          return error;
        });
      })
    )
  }
  getCityDivBranch(input : any){
    this.loadingService.setLoadingState(true);
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`${environment.baseURL}/api/CommonAPI/GetCityDivBranch`, input, header)
    .pipe(
      tap(() => this.loadingService.setLoadingState(false)),
      catchError((error) => {
        this.loadingService.setLoadingState(false);
        return throwError(() => { 
          return error;
        });
      })
    )
  }
  savePosp(input : CustomerData){
    this.loadingService.setLoadingState(true);
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`${environment.baseURL}/api/CommonAPI/SavePOSPCustomer`, input, header).pipe(
      tap(() => this.loadingService.setLoadingState(false)),
      catchError((error) => {
        this.loadingService.setLoadingState(false);
        return throwError(() => {
          return error;
        });
      })
    )
  }
  craeteLogin(input : CreateLogin){
    this.loadingService.setLoadingState(true);
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`${environment.baseURL}/api/CommonAPI/CreateImagicLicProf`, input, header)
    .pipe(
      tap(() => this.loadingService.setLoadingState(false)),
      catchError((error) => {
        this.loadingService.setLoadingState(false);
        return throwError(() => { 
          return error;
        });
      })
    )
  }
}
