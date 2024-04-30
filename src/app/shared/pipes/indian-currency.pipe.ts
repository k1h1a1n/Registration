import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IndianCurrency',
  pure:true
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: any, noOfFractions = 2): any {
    if( isNaN(value) ){
      value = parseInt(value);
    }
    return new Intl.NumberFormat('en-IN', {maximumFractionDigits: noOfFractions}).format(value);
  }
}

@Pipe({
  name: 'INRFormat',
  pure:true
})

export class IndianRSFormatPipe implements PipeTransform {
  transform(value: any, prefix: string = '₹', locale: string = 'en-IN', decimalPlaces: number = 2): any {
    value = Math.round(value)
    if (isNaN(value)) {
      value = parseFloat(value);
    }

    if (!isNaN(value)) {
      return prefix + new Intl.NumberFormat(locale, { maximumFractionDigits: decimalPlaces }).format(value);
    }

    return '';
  }
}
