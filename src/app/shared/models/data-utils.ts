import * as _moment from 'moment';
const moment = _moment;
import { formatDate } from '@angular/common';

//https://momentjs.com/

export class DateUtils{

  today(){
    return moment();
  }

  addCalendarYears(years: number): any {
    return moment().add(years, 'years');
  }
  addCalendarMonths(months: number): any {
    return moment().add(months, 'months');
  }
  addCalendarDays(days: number): any {
    return moment().add(days, 'days');
  }

  addToDate(dateVal: any, amount: number, unit: any): any {
    if( dateVal instanceof Date ){
      return moment(dateVal.toString()).add(amount, unit);
    }
    else {
      let dateObject = this.toDate(dateVal);
      return moment(dateObject.toString()).add(amount, unit);
    }
  }

  diffCalendar(dateStr, unit): any {
    let dateObject;
    if( dateStr.indexOf('-') != -1 ) {
      dateStr = dateStr.replaceAll('-', '/');
    }
    dateObject = this.toDate(dateStr);
    return moment().diff(dateObject, unit);
  }

  toDate(dateStr, year?, month?){
    let dateObject;
    try{
      if( dateStr.indexOf('/') != -1 ) {
        const dateParts = dateStr.split("/");
        // month is 0-based, that's why we need dataParts[1] - 1
        const d = Number(dateParts[0]);
        const m = Number(dateParts[1]);
        const y = Number(dateParts[2]);

        // Creates Date Object from Date String / parts (y)ear-(m)onth-(d)ay
        let _dateObject = new Date(y, m - 1, d);
        if(year && month) _dateObject = new Date(year, month - 1, d);
        else if(year) _dateObject = new Date(year, m - 1, d);
        else if(month) _dateObject = new Date(year, month - 1, d);

        if( _dateObject.toString() == 'Invalid Date' ){
          _dateObject = new Date(dateStr);
        }
        dateStr = _dateObject.toString();
      }
      dateObject =  moment(dateStr).toDate();
    }
    catch(e){
      dateObject = new Date(); // Fallback - Current Date
    }
    return dateObject;
  }

  getFormatDate(date? : any , format : string = 'yyyy-MM-dd'){
    if( date instanceof Date )
    {
      return formatDate(date, format, 'en');
    }
    else if( date instanceof String )
    {
      const _date = this.toDate(date);
      return formatDate(_date, format, 'en');
    }
    else{
      return formatDate(new Date(), format, 'en');
    }
  }

  getDatePart(part: string = 'D', date? : any){
    let value : any;
    const _date = date ? moment(date) : moment();
    switch( part ){
      case 'M' : 
        value = _date.month();
        break;
      case 'Y' : 
        value = _date.year();
        break;
      default: 
        value = _date.day();
        break;
    }
    return `${value}`;
  }

  toDateFormat(dateStr: string, sourcFormat: string) {
    if (sourcFormat == 'dd-MM-yyyy') {
      let dateParts = dateStr.split("-");
      dateStr = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;
    }
    return dateStr;
  }
  
  CalcDateDiffInYMD(startDateStr: string, endDateStr: string) {

    let startDate = new Date(new Date(startDateStr).toISOString().substr(0, 10));
    if (!endDateStr) {
      endDateStr = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
    }
    let endDate = new Date(endDateStr);

    if (startDate > endDate) {
      const swap = startDate;
      startDate = endDate;
      endDate = swap;
    }
    const startYear = startDate.getFullYear();
    const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let yearDiff = endDate.getFullYear() - startYear;
    let monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    let dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[startDate.getMonth()];
    }

    return { 'Y' : yearDiff, 'M' : monthDiff, 'D' : dayDiff };
  }

  
}
