import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroupDirective, FormGroup } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, map, startWith, switchMap } from "rxjs/operators";

@Component({
  selector: "app-autocomplete-input",
  templateUrl: "./autocomplete-input.component.html",
  styleUrls: ["./autocomplete-input.component.scss"],
})
export class AutocompleteInputComponent implements OnInit {

  @Input() inputName: string;
  @Input() formGroupName: string;
  @Input() formControlNameInput: string = "autoComplete";
  @Input() data$: Observable<any[]>;
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter<string>();

  // Added on 14AUG2023
  @Input() searchKey: string = "lookupDescription";
  @Input() displayWithKey: string = "lookupDescription";
  @Input() displayFldKey: string = "lookupDescription";
  @Input() loadingMessage: string = "Fetching available plans...";
  @Input() noDataMessage: string = "No plan available";

  _displayFldKey: string[];
  autoCompleteForm: FormGroup;
  optionList$: Observable<any[]>;
  searchSubject$ = new Subject<any>();

  constructor(private parentFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.autoCompleteForm = this.parentFormGroup.control.get( this.formGroupName ) as FormGroup;

    // for direct filter method
    this.initializeInput();
  }

  initializeInput() {
    this._displayFldKey = this.displayFldKey.split(",");

    this.optionList$ = this.searchSubject$.pipe(
      debounceTime(150),
      startWith(""), // An initial value (empty string) to show all plans on focus
      switchMap((searchStr: string) => {
        searchStr = searchStr.toLowerCase();        
        return this.data$.pipe(
          map((data: any[]) => {
            if (Array.isArray(data)) {
              const filteredList = data.filter((item) => {

                // Changed on 28AUG2023 - To matched with any of multiple keys.
                // Added on 14AUG2023
                // return item['lookupDescription'].toLowerCase().includes(searchStr)
                // return item[this.searchKey].toLowerCase().includes(searchStr)

                let isMatched = [];
                let _searchKey = this.searchKey.split(",");
                _searchKey.forEach((serchKey) => {
                  if(item[serchKey]){
                    isMatched.push(item[serchKey].toLowerCase().includes(searchStr));
                  }
                });
                return isMatched.includes(true);
              });
              // console.log('serchKey', this.searchKey, filteredList?.length);
              return filteredList;
            } 
            else {
              return [];
            }
          })
        );
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  onChange(event: any) {
    if (typeof event == "string") {
      this.searchSubject$.next(event);
    }
  }

  onSelection(event: any) {
    const selectedValue = event.option.value;
    // console.log('onSelection', selectedValue);
    this.inputValueChange.emit(selectedValue);
  }

  setDisplayValue(): (option: any) => any {
    return (option: any) => {
      if (typeof option == "string") {
        return option;
      } else {
        // Added on 14AUG2023
        // return option ? option.lookupDescription : '';
        return option ? option[this.displayWithKey] : '';
      }
    };
  }

}
