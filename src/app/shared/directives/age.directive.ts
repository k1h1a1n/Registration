import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAge]'
})
export class AgeDirective {

  constructor() { }
  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^0-9]/g, ''); // Allow only numbers
    inputElement.value = sanitizedValue.length > 2 ? sanitizedValue.slice(0, 2) : sanitizedValue;
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e' || event.key === '.') {
      event.preventDefault();
    }
  }
}
