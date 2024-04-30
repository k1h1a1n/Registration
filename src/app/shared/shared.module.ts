import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModule } from './material.module';
import { IndianCurrencyPipe, IndianRSFormatPipe } from './pipes/indian-currency.pipe';

import { MomentDateAdapter } from './components/custom-input/moment-date-adapter';
import { LocalCacheTTLInterceptor } from './intercepters/local-cache-ttl.interceptor';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { AppendCommonDetails } from './intercepters/append-common-deatils.interceptor';
import { StylePaginatorDirective } from './directives/style-paginator.directive';
import { ActionAlertComponent } from './components/action-alert/action-alert.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';

import { CommonDataTableComponent } from './components/common-data-table/common-data-table.component';
import { InputEditableDirective } from './directives/input-editable.directive';
import { AutoTabIndexDirective } from './directives/auto-tab-index.directive';
import { SortPipe } from './pipes/sort.pipe';
import { CellFormat } from './pipes/cell-format.pipe';
import { ListingTableComponent } from './components/listing-table/listing-table.component';
import { DecimalInputDirective } from './directives/percent-validation.directive';
import { NgxEditorModule } from 'ngx-editor';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { AgeDirective } from './directives/age.directive';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
const CompDirList: any[] = [
  AutocompleteInputComponent,
  StylePaginatorDirective,
  CurrencyInputDirective,
  ActionAlertComponent,
  CommonDataTableComponent,
  ListingTableComponent,
  InputEditableDirective,
  AutoTabIndexDirective,
  DecimalInputDirective,
  AgeDirective,
  TextEditorComponent,
];

const PipeList: any[] = [
  IndianCurrencyPipe,
  IndianRSFormatPipe,
  SortPipe,
  CellFormat
];

@NgModule({
  declarations: [CompDirList, PipeList],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgxEditorModule
  ],
  providers: [
    PipeList,
    DatePipe,
    CurrencyPipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: LocalCacheTTLInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppendCommonDetails, multi: true },
  ],
  exports: [
    CompDirList,
    PipeList,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgxEditorModule],
})
export class SharedModule {

}
