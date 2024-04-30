import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MemberDetailsInput,
  MemberDetailsOutputs,
} from 'src/app/data-entry/models/lic-policy-entries.model';
import {
  PolicyNumberInput,
  PolicyNumberOutput,
} from 'src/app/data-entry/models/prem-depo-entry';
import { GetPolicyList } from 'src/app/reports/models/commission-ledger';
import { FilterInput } from 'src/app/reports/models/premium-reports';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SortingfilterService {
  constructor(private http: HttpClient) {}

  GetGroupFilter(input: FilterInput): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      `${environment.baseUrl}/GetGroupFilter`,
      input,
      httpOptions
    );
  }
  GetCustomerFilter(input: FilterInput): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      `${environment.baseUrl}/GetCustomerFilter`,
      input,
      httpOptions
    );
  }
  MemberDetails(searchStr: string): Observable<MemberDetailsOutputs> {
    const memberInput: MemberDetailsInput = new MemberDetailsInput();
    memberInput.isGroup = 5;
    memberInput.searchStr = searchStr;
    memberInput.groupId = 0;
    memberInput.isGroupCode = 0;
    memberInput.isFolio = 0;
    memberInput.id = 'deepalig@datacomp.co.in';
    const httpOptions = {
      Headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<MemberDetailsOutputs>(
      `${environment.baseUrl}/GetMembersDetails`,
      memberInput
    );
  }
  PolicyNumber(input: PolicyNumberInput): Observable<PolicyNumberOutput> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<PolicyNumberOutput>(
      `${environment.baseUrl}/PolicyNumber`,
      input,
      httpOptions
    );
  }
  GetAreaWise() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.reportsApi}/api/Servicing/OfficeReports/GetAreaWiseData`,null,
      httpOptions
    );
  }
  GetSubAreaWise() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.reportsApi}/api/Servicing/OfficeReports/GetSubAreaWiseData`,null,
      httpOptions
    );
  }
  GetPolicyStatus(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.reportsApi}/api/Servicing/OfficeReports/GetPolicyStatus`,null,
      httpOptions
    );
  }
  GetGroupRating(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.reportsApi}/api/Servicing/OfficeReports/GetGroupRating`,null,
      httpOptions
    );
  }
  GetGroupCategory(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.reportsApi}/api/Servicing/OfficeReports/GetGroupCategory`,null,
      httpOptions
    );
  }
  GetExcludePlan(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.vmProBl}/api/Lookup/ExclPlans`,null,
      httpOptions
    );
  }

  getPoliciesCommissionLedger(input : GetPolicyList){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'exception': 'UserId' }),
    };
    return this.http.post<any>(
      `${environment.vmProLoan}/GetPolicyDetailsCommLed`,input,
      httpOptions
    );
  }
}
