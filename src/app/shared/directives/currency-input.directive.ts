import { Directive, HostListener, ElementRef, OnInit, Input, Attribute } from "@angular/core";

@Directive({ selector: "[currencyInput]" })
export class CurrencyInputDirective implements OnInit {

  
  private el: HTMLInputElement;

  constructor(@Attribute('formControlName') private controlName: string, private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }
  
  ngOnInit() {
    this.onBlur(this.el.value);
  }

  ngAfterViewInit() {
    this.onBlur(this.el.value);
  }

  // Input binding to track changes in the input value
  @Input('currencyInput')
  set inputValue(value : any) {
    // console.log('controlName', this.controlName);
    if( value && value[this.controlName]){
      this.el.value = this.formatToIndianCurrency(value[this.controlName]);
    }
    else{
      this.el.value = this.formatToIndianCurrency(value);
    }
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    // On focus, remove the currency formatting and Indian numbering separators
    this.el.value = value.replace(/[₹,]/g, '');
    this.el.select();
  }
  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    // On blur, add the currency formatting using the Indian numbering system
    this.el.value = this.formatToIndianCurrency(value);
  }

  // Function to convert a number to the Indian currency format without decimals
  private formatToIndianCurrency(value: string | number): string {
    value = String(value)
    if (!value) return '0';
    const parsedValue = parseFloat(value.replace(/[₹,]/g, ''));
    if (isNaN(parsedValue)) return '0';
    return parsedValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
