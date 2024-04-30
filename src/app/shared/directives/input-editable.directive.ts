import { Directive, ElementRef, Renderer2, HostListener, HostBinding, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[inputeditable][formControlName],[inputeditable][formControl],[inputeditable][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputEditableDirective),
      multi: true,
    },
  ]
})
export class InputEditableDirective implements ControlValueAccessor {

  @Input() propValueAccessor = 'textContent';

  @HostBinding('attr.contenteditable') @Input() editable: boolean | string = true;
  @HostBinding('class.edit-input') isEditing = false;

  private onChange: (value: string) => void;
  private onTouched: () => void;
  private removeDisabledState: () => void;

  constructor( private elementRef: ElementRef, private renderer: Renderer2) {

  }

  @HostListener('input')
  callOnChange() {
    console.log('input');
    this.isEditing = true;
    if (typeof this.onChange == 'function') {
      this.onChange(this.elementRef.nativeElement[this.propValueAccessor]);
    }
  }

  @HostListener('focus')
  callOnFocus() {
    console.log('focus');
    this.isEditing = true;
  }

  @HostListener('blur')
  callOnTouched() {
    console.log('blur');
    this.isEditing = this.isValid();
    if (typeof this.onTouched == 'function') {
      this.onTouched();
    }
  }

  private isValid(){
    console.log('isValid', this.elementRef?.nativeElement?.className);
    return this.elementRef?.nativeElement?.className?.includes('ng-invalid');
  }

  /**
   * Writes a new value to the element.
   * This method will be called by the forms API to write
   * to the view when programmatic (model -> view) changes are requested.
   *
   * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
   */
  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.propValueAccessor,
      normalizedValue
    );
  }

  /**
   * Registers a callback function that should be called when
   * the control's value changes in the UI.
   *
   * This is called by the forms API on initialization so it can update
   * the form model when values propagate from the view (view -> model).
   */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * This is called by the forms API on initialization so it can update the form model on blur.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * This function is called by the forms API when the control status changes to or from "DISABLED".
   * Depending on the value, it should enable or disable the appropriate DOM element.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'disabled',
        'true'
      );
      this.removeDisabledState = this.renderer.listen(
        this.elementRef.nativeElement,
        'keydown',
        this.listenerDisabledState
      );
    } else {
      if (this.removeDisabledState) {
        this.renderer.removeAttribute(
          this.elementRef.nativeElement,
          'disabled'
        );
        this.removeDisabledState();
      }
    }
  }

  private listenerDisabledState(e: KeyboardEvent) {
    e.preventDefault();
  }  

}