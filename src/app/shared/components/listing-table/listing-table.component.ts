import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, catchError, delay, finalize, of, takeUntil } from 'rxjs';
import { fadeIn } from '../../animations/common-filter';
import { DatePipe } from '@angular/common';
import { ListingTableConfig } from '../../models/listing-table-config';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-listing-table',
  templateUrl: './listing-table.component.html',
  styleUrls: ['./listing-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn
  ],
})
export class ListingTableComponent {
  @Input() config: ListingTableConfig;
  @Input() data$: Observable<any[]>;
  @Output() selectedRow: EventEmitter<object> = new EventEmitter();
  @Output() addNew: EventEmitter<boolean> = new EventEmitter();
  selectedFilterColumn: { header: string, property: string, pipe: string };
  selectedFilterColumnHeader: string;
  searchStr: string;
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource();
  isLoading: boolean = true;
  singleSelectionData: any;
  prevSelectedRow: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$ = new Subject<void>();
  private datePipe = inject(DatePipe);
  // private _liveAnnouncer = inject(LiveAnnouncer);
  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.setInitialFilterCol();
  }

  ngOnChanges() {
    this.initializeTableData();
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional    
    // details about the values being sorted.
    const columnProperty = this.config.columnConfig.filter((column) => {
      return column.header === sortState.active
    })
    this.sortData(sortState, columnProperty[0]['property']);
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  sortData(sort: Sort, columnProperty?: string) {
    const data = this.dataSource.data;
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case sort.active:
          return this.compare(a[`${columnProperty}`], b[`${columnProperty}`], isAsc);
        default:
          return 0;
      }
    });
  }
  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  private setInitialFilterCol() {
    this.config.columnConfig[0].header === 'Select All' ? this.selectedColumnFilter(this.config.columnConfig[1]) : this.selectedColumnFilter(this.config.columnConfig[0])
  }
  selectedColumnFilter(value: { header: string; property: string; pipe: string; }) {
    if (this.selectedFilterColumn !== value) {
      this.selectedFilterColumn = value;
      this.selectedFilterColumnHeader = this.selectedFilterColumn.header;
      this.searchStr = ''
      this.applyFilter(this.searchStr, this.selectedFilterColumn);
    } else {

    }
  }
  private initializeTableData() {
    this.data$.pipe(
      catchError((error: any) => {
        return of(null);
      }),
      takeUntil(this.destroy$),
      // finalize(() => {
      //   this.isLoading = false;
      // })
    )
    .subscribe((result) => {
        this.selection.clear();
        this.dataSource.data = result;
        this.isLoading = false;
        if (this.config.defaultSortingConfig) {
          const columnProperty = this.config.columnConfig.filter((column) => {
            return column.header === this.config.defaultSortingConfig.active
          })
          this.sortData({ direction: this.config.defaultSortingConfig.direction, active: this.config.defaultSortingConfig.active }, columnProperty[0]['property']);
        }
      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  addNewAction() {
    this.addNew.emit(true);
  }
  getTableColumnProperties(): string[] {
    return this.config.columnConfig.map(column => column.property);
  }
  printAction(element) {
    const dataToSend = {
      data: element,
      action: 'print'
    }
    this.selectedRow.emit(dataToSend);
  }
  deleteAction(element) {
    const dataToSend = {
      data: element,
      action: 'delete'
    }
    this.selectedRow.emit(dataToSend);
  }
  editAction(element) {
    const dataToSend = {
      data: element,
      action: 'edit'
    }
    this.selectedRow.emit(dataToSend);
  }
  adjustedMinHeightNoData(): string {
    const originalMinHeight = this.config.minHeight; // Replace with your original minHeight value
    const adjustedHeight = (parseInt(originalMinHeight, 10) - 44) + 'px';
    return adjustedHeight;
  }
  adjustedMinHeightfecthingdata(): string {
    const originalMinHeight = this.config.minHeight; // Replace with your original minHeight value
    const adjustedHeight = (parseInt(originalMinHeight, 10) - 32) + 'px';
    return adjustedHeight;
  }
  applyFilter(filterValue: string, column: { header: string, property: string, pipe: string }) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (column.pipe === 'date') {
        data[column.property] = this.datePipe.transform(data[column.property], 'dd/MMM/yyyy')
      }
      return String(data[column.property])?.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }
  singleSelection(selectedRow: object) {
    if (this.singleSelectionData) {
      this.singleSelectionData['isSelected'] = false;
    }
    // Select the clicked row
    this.singleSelectionData = selectedRow;
    selectedRow['isSelected'] = true;

    //for not emitting value multiple times if user clicked on the same row many times
    this.config.emitOnRowclick && (JSON.stringify(this.singleSelectionData)) !== (JSON.stringify(this.prevSelectedRow)) ?
      this.selectedRow.emit(this.singleSelectionData) : null;
    (JSON.stringify(this.singleSelectionData)) !== (JSON.stringify(this.prevSelectedRow)) ?
      this.prevSelectedRow = this.singleSelectionData : null;
  }
  selectClose() {
    this.singleSelectionData !== undefined ? this.selectedRow.emit(this.singleSelectionData) : null;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
