import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SharedService } from './shared.service';
import { IndexedDBService } from './indexeddb.service';
import { MenuItemsInput, MenuItemsOutput, NEW_MENUS } from '../models/i-magic-menu.model';
import { FilterInput } from 'src/app/reports/models/premium-reports';

@Injectable({
    providedIn: 'root'
})
export class CacheDataService {

    private ServicingAPI: string;
    private DataContainers$: any = {};

    constructor(private http: HttpClient, private shareSvc: SharedService, private idbSvc: IndexedDBService) {
        this.ServicingAPI = `${environment.reportsApi}/api/Servicing/OfficeReports`;
    }

    getData(key): Observable<any> {

        let _dataObservable = this.DataContainers$[key];
        if( !_dataObservable ){
            _dataObservable = new BehaviorSubject(null);
            this.DataContainers$[key] = _dataObservable;
        }
        console.log(`getData ${key} : `, _dataObservable);
        return _dataObservable.asObservable();
    }

    

    setData(key: string, data: any) {
        let _dataObservable = this.DataContainers$[key];
        if( !_dataObservable ){
            _dataObservable = new BehaviorSubject(null);
        }
        _dataObservable.next(data);
        this.DataContainers$[key] = _dataObservable;
    }

    resetData(key) {
        this.DataContainers$[key] = null;
    }

    // Get Group Code wise Data API
    getGroupCodeWiseData(): Observable<any> {

        let url = `${this.ServicingAPI}/GetGroupMembData`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [`GetGroupMembData`, 'getMemberDetails', 'NoCache', 'DD:7']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.getMemberDetails ){
                        let responseData = response.getMemberDetails;
                        let _groupCodeWiseData = this.shareSvc.groupBy(responseData, 'groupCode', ['groupCode', 'groupHeadName']);
                        console.log('SLIM: put in IndexedDB Cache');
                        return this.idbSvc.setData('GetGroupMembData', _groupCodeWiseData, 'DD:7')
                            .pipe( map(() => _groupCodeWiseData) )
                    }
                    return of(response);
                })
            );
    }

     // Get Group Code wise Data without grouping 
     getGroupCodeWiseDataWOGrouping(): Observable<any> {
        
        let url = `${this.ServicingAPI}/GetGroupMembData`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [`GetGroupMembDataWOGrouping`, 'getMemberDetails', 'NoCache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.getMemberDetails ){
                        let responseData = response.getMemberDetails;
                        return this.idbSvc.setData('GetGroupMembDataWOGrouping', responseData, 'HH:24')
                            .pipe( map(() => responseData) )
                    }
                    return of(response);
                })
            );
    }
    

    // Get Group Code data for Reports Module
    getReportsModuleGroupCodeData(): Observable<any> {
        let url = `${this.ServicingAPI}/GetGroupCodeData`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [`ReportsModuleGroupCodeData`, 'getGroupCodeDetails', 'NoCache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.getGroupCodeDetails ){
                        let responseData = response.getGroupCodeDetails;
                        return this.idbSvc.setData('ReportsModuleGroupCodeData', responseData, 'HH:24')
                            .pipe( map(() => responseData))
                    }
                    return of(response);
                })
            );
    }

    // Get CRM Group Data API
    getCRMGroupsData(input : FilterInput): Observable<any> {
        let url = `${environment.baseUrl}/CRMGroupFilter`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'INDEXED_DB_CAHCE': [`CRMGroupData`, 'cRMfilterInfos', 'NoCache', 'DD:7']
            })
        }
        return this.http.post<any>(url, input, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.cRMfilterInfos ){
                        let responseData = response.cRMfilterInfos;
                        return this.idbSvc.setData('CRMGroupData', responseData, 'DD:7')
                            .pipe( map(() => responseData) )
                    }
                    return of(response);
                })
            );
    }

    // Get CRM Group Data API
    getAgencyData(input : FilterInput): Observable<any> {
        let url = `${environment.baseUrl}/AgencyFilter`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'INDEXED_DB_CAHCE': [`AgencyData`, 'agenciesFilterInfos', 'NoCache', 'DD:7']
            })
        }
        return this.http.post<any>(url, input, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.agenciesFilterInfos ){
                        let responseData = response.agenciesFilterInfos;
                        return this.idbSvc.setData('AgencyData', responseData, 'DD:7')
                            .pipe( map(() => responseData) )
                    }
                    return of(response);
                })
            );
    }

    // Get Branch Wise data for Reports Module
    getBranchWiseData(): Observable<any> {
        let url = `${this.ServicingAPI}/GetBranchWiseData`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [`BranchWiseData`, 'getBranchWiseDetails', 'NoCache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.getBranchWiseDetails ){
                        let responseData = response.getBranchWiseDetails;
                        return this.idbSvc.setData('BranchWiseData', responseData, 'HH:24')
                            .pipe( map(() => responseData))
                    }
                    return of(response);
                })
            );
    }

    // Get POLICY No wise data for Reports Module
    getPolicyNoWiseData(): Observable<any> {
        let url = `${this.ServicingAPI}/PolicyGetData`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [`PolicyNoWiseData`, 'getPolicyData', 'NoCache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((response: any) => {                
                    if( response?.getPolicyData ){
                        let responseData = response.getPolicyData;
                        return this.idbSvc.setData('PolicyNoWiseData', responseData, 'HH:24')
                            .pipe( map(() => responseData))
                    }
                    return of(response);
                })
            );
    }

    // Get Relation Dropdown Data API
    getRelations(): Observable<any> {

        let relationsData = this.shareSvc.GetJsonItem('relations', 'AS_ARRAY');
        if( relationsData?.length > 0 ){
            return of(relationsData);
        }
        else{
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'exception': 'UserId'
                })
            }
            return this.http.post<any>(`${this.ServicingAPI}/GetRelations`, null, httpOptions)
                .pipe(
                    map((resp: any) => {
                        let relations = resp.getRelations;
                        this.shareSvc.SetJsonItem('relations', relations);
                        return relations;
                    })
                );
        }

    }

    //Get Policy Numbers GetPolicyNumbers~getPolicyNumbers | 
    getPolicyNumbers(storageAPIKey: string): Observable<any> {

        let arr = storageAPIKey.split('~');
        let storageKey = arr[0], 
        storageAPI = arr[0], 
        accessKey = arr[1];

        let url = `${this.ServicingAPI}/${storageAPI}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [storageKey, accessKey, 'Cache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((resp: any) => {
                    return of(resp);
                })
            );

    }
    
    getMenus(roleID : any): Observable<any>{

        const input: MenuItemsInput = new MenuItemsInput();
        input.RoleID = roleID;

        let url = `${environment.baseUrl}/GetMenuList`;
        const httpOptions = {
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json',
                'LOCAL_CAHCE_TTL': [`GetMenuList_local`, 'HH:06']
            })
        };
        return this.http.post<any>( url, input, httpOptions )
            .pipe(
                switchMap( (resp: MenuItemsOutput) => {
                    let menus = resp.menuLists;
                    return of([...menus, ...NEW_MENUS]);
                })
            );
    }

    //Get Policy Numbers GetGroupHead~getGroupHead | 
    GetGroupHead(storageAPIKey: string): Observable<any> {

        let arr = storageAPIKey.split('~');
        let storageKey = arr[0], 
        storageAPI = arr[0], 
        accessKey = arr[1];

        let url = `${this.ServicingAPI}/${storageAPI}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [storageKey, accessKey, 'Cache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((resp: any) => {
                    return of(resp);
                })
            );
    }

    //Get AllAgentName 'GetAllAgentName~getAllAgentName'| 
    getAllAgentName(storageAPIKey: string): Observable<any> {
        let arr = storageAPIKey.split('~');
        let storageKey = arr[0], 
        storageAPI = arr[0], 
        accessKey = arr[1];

        let url = `${this.ServicingAPI}/${storageAPI}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [storageKey, accessKey, 'Cache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((resp: any) => {
                    return of(resp);
                })
            );
    }

    //Get AllAdvanceType 'GetAllAdvanceType~getAllAdvanceType'| 
    GetAllAdvanceType(storageAPIKey: string): Observable<any> {
        let arr = storageAPIKey.split('~');
        let storageKey = arr[0], 
        storageAPI = arr[0], 
        accessKey = arr[1];

        let url = `${this.ServicingAPI}/${storageAPI}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'exception': 'UserId',
                'INDEXED_DB_CAHCE': [storageKey, accessKey, 'Cache', 'HH:24']
            })
        }
        return this.http.post<any>(url, null, httpOptions)
            .pipe(
                switchMap((resp: any) => {
                    return of(resp);
                })
            );
    }

        //Get Gender Data
        GetGenderData() {
            let url = `${environment.vmProBl}/api/lookup/gender`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'INDEXED_DB_CAHCE': [`GenderData`, null, 'NoCache', 'DD:7']
                })
            }
            return this.http.post<any>(url, httpOptions)
                .pipe(
                    switchMap((response: any) => {
                        if (response) {
                            let responseData = response;
                            return this.idbSvc.setData('GenderData', responseData, 'DD:7')
                                .pipe(map(() => responseData))
                        }
                        return of(response);
                    })
                );
        }
    
        // Magic Mix Quotation Type data
        GetQuotationTypeData() {
            let url = `${environment.vmProBl}/api/lookup/quottype`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'INDEXED_DB_CAHCE': [`QuotType`, null, 'NoCache', 'DD:7']
                })
            }
            return this.http.post<any>(url, httpOptions)
                .pipe(
                    switchMap((response: any) => {
                        if (response) {
                            let responseData = response;
                            return this.idbSvc.setData('QuotType', responseData, 'DD:7')
                                .pipe(map(() => responseData))
                        }
                        return of(response);
                    })
                );
        }
    
        // Extra Class List 
        GetExtraClassData() {
            let url = `${environment.vmProBl}/api/Lookup/ExtraClasses`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'INDEXED_DB_CAHCE': [`ExtraClass`, null, 'NoCache', 'DD:7']
                })
            }
            return this.http.post<any>(url, httpOptions)
                .pipe(
                    switchMap((response: any) => {
                        if (response) {
                            let responseData = response;
                            return this.idbSvc.setData('ExtraClass', responseData, 'DD:7')
                                .pipe(map(() => responseData))
                        }
                        return of(response);
                    })
                );
        }
    
        // Designation  List 
        GetDesignationListData() {
            let url = `${environment.vmProBl}/api/Lookup/Designation`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'INDEXED_DB_CAHCE': [`Designation`, null, 'NoCache', 'DD:7']
                })
            }
            return this.http.post<any>(url, httpOptions)
                .pipe(
                    switchMap((response: any) => {
                        if (response) {
                            let responseData = response;
                            return this.idbSvc.setData('Designation', responseData, 'DD:7')
                                .pipe(map(() => responseData))
                        }
                        return of(response);
                    })
                );
        }
}