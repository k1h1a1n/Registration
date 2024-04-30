import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateLogin, CustomerData } from '../model/customer-create';

@Injectable({
  providedIn: 'root'
})
export class CustomerCreateService {
  private http = inject(HttpClient)
  constructor() { }

  getOtp(input : any): Observable<any>{
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`http://mswebapi.magicsales.in/api/CommonAPI/LandmarkOTP`, input, header)
  }
  verifyOtp(input : any): Observable<any>{
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`http://mswebapi.magicsales.in/api/CommonAPI/LandmarkVerifyOTP`, input, header)
  }
  getCityDivBranch(input : any){
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`http://mswebapi.magicsales.in/api/CommonAPI/GetCityDivBranch`, input, header)
  }
  savePosp(input : CustomerData){
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`http://mswebapi.magicsales.in/api/CommonAPI/SavePOSPCustomer`, input, header)
  }

  craeteLogin(input : CreateLogin){
    const header = {
      headers: new HttpHeaders({'Content-Type': 'application/json' , 'exception' : 'pass'})
    }
    return this.http.post<any>(`http://mswebapi.magicsales.in/api/CommonAPI/CreateImagicLicProf`, input, header)
  }

}
