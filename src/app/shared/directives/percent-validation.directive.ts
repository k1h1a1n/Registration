import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalInput]'
})
export class DecimalInputDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue = inputElement.value;

    // Use a regular expression to allow up to 3 digits and 2 decimal places
    const regex = /^(\d{0,3})(\.\d{0,2})?$/;
    if (!regex.test(inputValue)) {
      inputValue = inputValue.slice(0, -1); // Remove the last character
    }

    inputElement.value = inputValue; // Update the input value
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue = inputElement.value;

    // If the input is empty, reset it to '0'
    if (inputValue.trim() === '') {
      inputElement.value = '0';
    }
  }
}
