import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorDefaultOptions } from '@angular/material/paginator';

import { rowsAnimationEnter } from '../../animations/common-filter';
import { ColumnConfig, TableConfig } from '../../models/common-data-table-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'common-data-table',
  templateUrl: './common-data-table.component.html',
  styleUrls: ['./common-data-table.component.scss'],
  animations: [
    rowsAnimationEnter
  ]
})
export class CommonDataTableComponent implements OnInit {

  @HostListener('document:keydown.escape')
  handleEscape() {
    // console.log('ESC');
    this.displayFilter = false;
  }
  
  constructor(private fb: FormBuilder) { }

  @Input() columnConfig: ColumnConfig[];
  @Input() tableConfig: TableConfig;

  isDataAvail: boolean;
  private _dataSource: MatTableDataSource<any>;
  @Input()
  set dataSource(data: MatTableDataSource<any>) {
    this.isDataAvail = false;
    this._dataSource = data;
    if(this._dataSource && this._dataSource.data.length > 0 ){
      this.isDataAvail = true;
      this._dataSource.paginator = this.paginator;
      this._dataSource.sort = this.matSort;
      this.setDefaultSort();
      this.setFilterPredicate();
    }
  }
  get dataSource() {
    return this._dataSource;
  }

  @Output() addEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() backEvent = new EventEmitter();
  @Input() 
  set selectEvent(data){
    if( this.tableConfig?.isSingleSelection && !data )
    {
      this.selection.clear();
    }
    else if( this.tableConfig?.isSingleSelection && data )
    {
      this.onRowSelect(data, false);
    }
  }
  @Output() selectEventChange = new EventEmitter();

  @Input() 
  set multiSelectEvent(data : any[]){
    if( this.tableConfig?.isMultiSelect && data?.length == 0 )
    {
      this.selection.clear();
    }
    else if (this.tableConfig?.isMultiSelect && data?.length > 0 )
    {
      data.forEach(row => this.selection.select(row));
    }
  }
  @Output() multiSelectEventChange = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  paginatorOpts : MatPaginatorDefaultOptions;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: any[];

  filterForm: FormGroup;
  activeFilter: boolean = false;
  displayFilter: boolean = false;

  ngOnInit() {

    this.displayedColumns = this.columnConfig.map((col) => col.name);

    if( this.tableConfig )
    {
      this.paginatorOpts = this.tableConfig.pageOptions;
      if( this.tableConfig.isMultiSelect || this.tableConfig.isMultiDelete ){
        this.displayedColumns = ['Select', ...this.displayedColumns];
      }
      if ( this.tableConfig.rowActions ) {
        this.displayedColumns = [...this.displayedColumns, 'RowActMenu'];
      }
      if ( this.tableConfig.contextMenu ) {
        this.displayedColumns = [...this.displayedColumns, 'CtxMenu'];
      }
  
      if( this.tableConfig.isFilterTable ){
        this.filterForm = this.fb.group({
          filtertext: ['', [Validators.required]],
          filterByColumn: [ ColumnConfig, [Validators.required]]
        });
  
        this.filterForm.get('filterByColumn').valueChanges.subscribe( (col:ColumnConfig) => {
          this.filterForm.get('filtertext').reset();
          this.setFormControlFocus( 'filtertext' ) ;
          if( col?.type == 'date' ){
            let distinctVals = [];
            this.dataSource.data.map( d => {
              let dVal = d[col.name];
              if(!distinctVals.includes(dVal)) distinctVals.push(dVal);
            });
            // console.log(distinctVals);
            col.values = distinctVals;
          }
        });
      }
    }
    
  }

  // on delete  table
  OnDeleteTable() {
    if (this.selection.selected.length == 0) {
      alert('Please select Record !');
    } else {
      let deletedRecords = [];
      this.selection.selected.forEach(item => {
        deletedRecords.push(item);
        let index: number = this.dataSource.data.findIndex(d => d === item);
        this.dataSource.data.splice(index, 1);
        alert('Are you sure you wish to delete selected record(s) ?');
        this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
      });
      this.deleteEvent.emit(deletedRecords);
      this.selection = new SelectionModel<any>(true, []);
    }
  }

  // on delete row
  OnDeleteRow(data) {
    this.deleteEvent.emit(data);
  }

  //edit data
  OnEditRow(data: any) {
    this.editEvent.emit(data);
  }

  //edit data
  OnAddClick() {
    this.addEvent.emit('Add from ' + this.tableConfig.tableHeader);
  }

   //on table back 
   onBackClick() {
    this.backEvent.emit(true);
  }

  // if the clicked column
  onColSelect(column: ColumnConfig, data: any) {
    if (column.isHyperlink === true) {
       this.editEvent.emit(data);
    }
  }

  onRowSelect(dataRow: any, emitEvent = true) {
    if( this.tableConfig?.isSingleSelection ) {
      this.selection.clear();
      this.selection.select(dataRow);

      if(emitEvent){
        this.selectEventChange.emit(dataRow);
      }
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  private masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  private setDefaultSort(){
    // Apply Default sort
    if( this.tableConfig.defaultSort ){
      const sortState = this.tableConfig.defaultSort;
      const sortColumn = this.columnConfig.filter( col => col.name == sortState.active )[0];
      this.dataSource.sortingDataAccessor = (item, colName) => {
        if( colName == sortColumn.name && sortColumn.type == 'Date' ){
          return new Date(item[colName]).getTime();
        }
        else{
          return item[colName];
        }
      };
      this.matSort.active = sortState.active;
      this.matSort.direction = sortState.direction;
      this.matSort.sortChange.emit(sortState);
    }
  }

  private setFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter: any = [];
      const filters = JSON.parse(filtersJson);
      filters.forEach((filter: any) => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        const lowerCaseStr = val.toString().toLowerCase();
        matchFilter.push(
          lowerCaseStr.includes(filter.value.toLowerCase())
        );
      });
      return matchFilter.every(Boolean);
    };
  }

  //Filter Datatable
  onFilter(){
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
    } 
    else {
      const filterValue = this.filterForm.value;
      const tableFilters = [];
      tableFilters.push({
        id: filterValue.filterByColumn.name,
        value: filterValue.filtertext
      });
      this.dataSource.filter = JSON.stringify(tableFilters);
      this.activeFilter = true;
      this.displayFilter = false;
    }
  }

  onResetFilter(){
    this.dataSource.filter = JSON.stringify([]);
    this.filterForm.reset();
    this.activeFilter = false;
    this.displayFilter = false;
  }

  setFormControlFocus( formcontrolname : string ){
    const formcontrolElem = document.querySelector('[formcontrolname="' + formcontrolname + '"]');
    // console.log('formcontrolElem', formcontrolElem);
    setInterval( () =>{
      (<HTMLElement>formcontrolElem)?.focus();
    }, 300);
  }

  onChangeSelection(target, dataRow?){
    // console.log(target, isChecked, dataRow);
    switch(target){
      case 'ALL':
        this.masterToggle();
        if( this.tableConfig?.isMultiSelect ){
          this.multiSelectEventChange.emit(this.selection.selected);
        }
      break;
      case 'ROW':
        this.selection.toggle(dataRow);
        if( this.tableConfig?.isMultiSelect ){
          this.multiSelectEventChange.emit(this.selection.selected);
        }
      break;
    }
  }
}
