import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'cellformat'
})
export class CellFormat implements PipeTransform {

  constructor(private datePipe:DatePipe){}

  transform(value: any, type: string = 'string', format?:string): any {
    if (!value) return value;
    if (!type) return value;
    else type = type.toLowerCase();

    switch(type){
        case 'date' :
            return this.datePipe.transform(value, format);;
        default: 
            return value;
    }
  }
}
