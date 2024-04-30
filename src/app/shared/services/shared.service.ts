
import { Injectable, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DateUtils } from '../models/data-utils';
import { IndianRSFormatPipe } from './../pipes/indian-currency.pipe';
import { ActionAlertComponent } from '../components/action-alert/action-alert.component';

@Injectable({
    providedIn: 'root',
})
export class SharedService {

    constructor(
        private router: Router,
        private domSanitizer: DomSanitizer,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private inrFormat: IndianRSFormatPipe
    ) { }

    /***************************************************************************************************/
    // Formatting Helper functions
    /***************************************************************************************************/


    FormBuilder(): FormBuilder {
        return this.formBuilder;
    }

    ToCamelCase(strVal: string): string {
        return strVal ? strVal.charAt(0).toLowerCase().concat(strVal.substring(1)) : strVal;
    }

    ToINRFormat(value: string) {
        return this.inrFormat.transform(value);
    }

    DeepCopy(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    ParseFloat(val: string | any) {
        try {
            return parseFloat(val);
        } catch (e) {
            return 0.0;
        }
    }

    ParseInt(val: string | any) {
        try {
            return parseInt(val);
        } catch (e) {
            return 0;
        }
    }

    // ShowElement(elemSelector: string, visible: boolean) {
    //     $(elemSelector)?.css('display', visible ? 'block' : 'none');
    // }

    // FocusElement(elemSelector: string) {
    //     $(elemSelector)?.trigger('focus');
    // }

    SetFormControlFocus(formcontrolname: string, delay = 300) {
        const formcontrolElem = document.querySelector('[formcontrolname="' + formcontrolname + '"]');
        setTimeout(() => {
            (<HTMLElement>formcontrolElem)?.focus();
        }, delay);
    }

    FocusErrorFormControl(formGroup: FormGroup<any>, formcontrolname: string) {
        this.SetFormControlFocus(formcontrolname);
        formGroup.controls[formcontrolname]?.markAsTouched();
        formGroup.controls[formcontrolname]?.setErrors({required : true})
    }

    EnableDisableFields(formGroup: FormGroup<any>, enableFieldList: string[], disableFieldList: string[], isReset = false) {

        let fieldList = [...enableFieldList, ...disableFieldList];
        fieldList = [... new Set(fieldList)];
        
        fieldList.map(fldName => {
            const fldArr = fldName.split('>>');
            let control: FormControl = null;
            for (let fld of fldArr) {
                if (!control)
                    control = <FormControl>formGroup.get(fld);
                else
                    control = <FormControl>control.get(fld);
            }
            if( control ){
                if( enableFieldList?.includes(fldName) ){
                    control.enable();
                }
                if( disableFieldList?.includes(fldName) ){
                    control.disable();
                }
                if( isReset ){
                    control.reset();   
                }
            }
        });

    }

    /***************************************************************************************************/
    // Auth Data Helper functions
    /***************************************************************************************************/
    GetAuthUserDetails() {
        const _IFADetails = this.GetJsonItem('AuthUser', 'IFADetails');
        return _IFADetails[0] || {};
    }


    /***************************************************************************************************/
    // Storage Helper functions
    /***************************************************************************************************/
    GetItem(lsKey: string, isLocal = true): string {
        const value = (isLocal ? localStorage.getItem(lsKey) : sessionStorage.getItem(lsKey)) || '';
        return value;
    }

    GetJsonItem(lsKey: string, jsonKey: string, isLocal = true): any {
        const value = (isLocal ? localStorage.getItem(lsKey) : sessionStorage.getItem(lsKey)) || (jsonKey == 'AS_ARRAY' ? '[]' : '{}');
        const json = JSON.parse(value);
        console.log('value', jsonKey, json);
        if (jsonKey == 'AS_ARRAY') {
            return json || [];
        }
        else if (jsonKey == 'AS_OBJ') {
            return json || {};
        }
        else {
            return json[jsonKey] || '--';
        }
    }

    SetItem(lsKey: string, value: string, isLocal = true): void {
        if (!value) return;
        if (isLocal) localStorage.setItem(lsKey, value);
        else sessionStorage.setItem(lsKey, value);
    }

    SetJsonItem(lsKey: string, jsonObj: any, isLocal = true): void {
        if (!jsonObj) return;
        const value = JSON.stringify(jsonObj);
        this.SetItem(lsKey, value, isLocal);
    }

    ClearStorage(isLocal = true): void {
        if (isLocal) localStorage.clear();
        else sessionStorage.clear();
    }

    /***************************************************************************************************/
    // Navigation Helper functions
    /***************************************************************************************************/
    // Back() {
    //   this.header.Back();
    // }

    NavigateTo(routeUrl: string, data?: any, isReloadPage?: boolean) {
        if (isReloadPage) {
          // Reload the current page
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([routeUrl], { state: data });
          });
        } else {
          // Navigate to the specified route
          this.router.navigate([routeUrl], { state: data });
        }
    }

    RouterEvents(): Observable<any> {
        return this.router.events;
    }

    RouterNavigationState(): any {
        return this.router.getCurrentNavigation()?.extras?.state;
    }

    // To display Under-Construction popup
    // ShowUnderConstruct() {
    //     $('.underConstruct')?.css('display', 'flex');
    // }

    OpenDialog(template: any, config?: any): MatDialogRef<any> {
        return this.dialog.open(template, config);
    }

    CloseDialog() {
        return this.dialog.closeAll();
    }

      // To Open Custom Alert Popup
    OpenAlertPopup( messageConfig: { messageText: string, headerText?: string, isHtml?: boolean }, callback?: any ): void {
        this.dialog.open(ActionAlertComponent, {
            data: {
                message: messageConfig.messageText,
                header: messageConfig.headerText,
                asHtml: messageConfig.isHtml,
                action : false
            }
        })
        .afterClosed().subscribe( resp => {
            if(callback) callback(resp);
        });
    }

    // To Open Custom Confirm Popup
    OpenConfirmPopup( messageConfig: { messageText: string, headerText?: string, isHtml?: boolean }, callback?: any ): void {
        this.dialog.open(ActionAlertComponent, {
            data: {
                header: messageConfig.headerText,
                message: messageConfig.messageText,
                asHtml: messageConfig.isHtml,
                action : true
            },
            disableClose : true
        })
        .afterClosed().subscribe( resp => {
            if(callback) callback(resp);
        });
    }

    Sanitizer() {
        return this.domSanitizer;
    }

    showMessage(successMessage, callback?){
        this.openSnackBar(successMessage, 'Ok', callback, {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
            panelClass: 'success-message'
        });
    }

    showError(errorMessage, callback?, delay = 3000){
        this.openSnackBar(errorMessage, 'Ok', callback, {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: delay,
            panelClass: 'failure-message'
        });
    }

    private openSnackBar(message: string, action: string, callback? , config?: MatSnackBarConfig) {
        if(!config){
            config = new MatSnackBarConfig();
            config.duration = 3000;
        }
        this._snackBar.open(message, action, config)
        .afterDismissed().subscribe( () => {
            if(callback) callback();
        });
    }

    sessionSnackBar(message: string, action: string) {
        let config = new MatSnackBarConfig();
        config.panelClass = 'sessionExpired';
        config.horizontalPosition = 'center';
        config.verticalPosition = 'top';
        this._snackBar.open(message, action, config);
    }

    formatDate(input: any, formatStr?: string) {
        const date = new Date(input);
        const formatedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes() - date.getTimezoneOffset()
        );

        if( formatStr ){
            return new DateUtils().getFormatDate(formatedDate, formatStr);
        }
        else{
            return formatedDate.toISOString()
            .substring(0, 10);;
        }
    }

    CompareDate(date1: string | Date, date2: string | Date) {
        return (<Date>date1).getTime() == (<Date>date2).getTime();
    }

    CalculateAge(dob: Date, isNotHadBdayYet = false) {
        if( !dob ) return 'DOB is Null';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();

        // Check if the birth date has not occurred yet this year
        if( isNotHadBdayYet ){
            const hasNotHadBirthdayYet =
                today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() &&
                    today.getDate() < birthDate.getDate());

            if (hasNotHadBirthdayYet) {
                age--;
            }
        }

        return age;
    }

    // 'groupCode', ['groupCode', 'groupHeadName']
    groupBy(arrData: [], groupByKey: string, extraKeys?: string[]) {
        let groupData = arrData.reduce((prev: any, curr: any) => {
            const groupByVal = curr[groupByKey];
            const groupElem = prev[groupByVal] || {};
            if (!groupElem.groups) {
                groupElem.groups = [];
                extraKeys?.map((k) => {
                    groupElem[k] = curr[k];
                });
            }
            groupElem.groups.push(curr);
            return { ...prev, [groupByVal]: groupElem };
        }, {});
        return Object.values(groupData);
    }
    
    GetDateUtils() : DateUtils{
        return new DateUtils();
    }

    sortByDate(arrData: any[], dateKey: string, sortOrder = 'asc'): any[] {
        arrData = arrData.sort((a, b) => {
            return +new Date(a[dateKey]) - +new Date(b[dateKey]);
        });

        return sortOrder === 'asc' ? arrData : arrData.reverse();
    }

    showErrorDialog(message: string, callback?: () => void) {
        const dialogRef = this.dialog.open(ActionAlertComponent, {
          data: {
            title: message,
            action: false
          },
          disableClose: true,
        });
      
        if (callback) {
          dialogRef.afterClosed().subscribe(() => {
            callback();
          });
        }
    }
    
    openPdf(PdfData: string) {
        if(PdfData){
            const blob = this.dataURItoBlob(PdfData);
            const file = new Blob([blob], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }
        else{
            this.dialog.open(ActionAlertComponent, {
                data: {
                title: 'No Record found to generate report',
                action : false
                }
            });
        }
    }

    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'application/pdf' });
        return blob;
    }


    capitalizeFirstLetter(str) {
        return str.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    openMessageDailogue(text : string){
        const saveDailogueRef = this.dialog.open(ActionAlertComponent, {
          data: {
            title: `${text}`,
            action : true
          },
          disableClose : true
        });
        return saveDailogueRef
    }
}
