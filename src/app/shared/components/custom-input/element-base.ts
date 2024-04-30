import {NgModel} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ValueAccessorBase} from './value-accessor';
import { AsyncValidatorArray, ValidatorArray, ValidationResult, message, validate } from './validate';

export abstract class ElementBase<T> extends ValueAccessorBase<T> {
  abstract model: NgModel;

  constructor(
    private validators: ValidatorArray,
    private asyncValidators: AsyncValidatorArray,
  ) {
    super();
  }

  validate(): Observable<ValidationResult> {
    // console.log('validate', this.model );
    return validate
      (this.validators, this.asyncValidators)
      (this.model?.control);
  }

  get invalid(): Observable<boolean> {
    return this.validate().pipe( map(v => Object.keys(v || {}).length > 0) );
  }

  get failures(): Observable<Array<string>> {
    return this.validate().pipe( map(v => Object.keys(v).map(k => message(v, k))) );
  }
}
