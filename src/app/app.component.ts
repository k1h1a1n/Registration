import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Optional, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TableData {
  ReferalName: string;
  ReferalPanNO: string;
  ReferalEmailID: string;
  CustName: number;
  CustMobi: number;
  CustEmail: string;
  Amount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Referral Commission';
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    }),
  };
  recMode: any = null;
  dataSource: MatTableDataSource<TableData> = new MatTableDataSource<TableData>([]);
  tableInfo = [{ name: 'Referor Name', property: 'ReferalName' }, { name: 'Referor Mail', property: 'ReferalEmailID' }, { name: 'Referor Pan', property: 'ReferalPanNO' }, { name: 'Customer Name', property: 'CustName' }, { name: 'Customer Email', property: 'CustEmail' }, { name: 'Customer Mobile', property: 'CustMobi' }, { name: 'Amount', property: 'Amount' }, { name: '', property: 'delete' }];
  public form: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  alertController: { action: boolean, message: string } = { action: false, message: '' };
  private dialog = inject(MatDialog);
  showSpinner: boolean = false;

  constructor(fb: FormBuilder, @Optional() private dialogRef: MatDialogRef<any> , private http: HttpClient) {
    this.form = fb.group({
      refName: ['', [Validators.required]],
      refPanNo: ['', [Validators.required]],
      // refEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      refEmail: ['', [Validators.required]],

      cusEmail: ['', [Validators.required]],
      cusName: ['', [Validators.required]],
      cusMobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      amount: [{ value: 0, disabled: false }]
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() { }
  onAddNew() {
    this.recMode = 'Add';
  }
  onActionClick(action: String) {
    this.recMode = action;
    if (action === 'Save') {
      this.onSubmit();
    }
    else if (action === 'Reset') {
      this.resetForm('amount')
    }
  }

  // Function to reset the form excluding a specific field
  resetForm(excludedField: string) {
    const allFormValues = this.form.value;

    // Reset all form controls except the excluded field
    Object.keys(allFormValues).forEach(key => {
      if (key !== excludedField) {
        this.form.get(key)?.reset(null, { emitEvent: false });
      }
    });
  }
  onDeleteByPanNo(panNoToDelete: string, dialogTemplate: any) {
    this.alertController = { action: true, message: 'Are you sure you want to delete this record' };
  
    this.dialogRef = this.OpenDialog(dialogTemplate, {
      disableClose: true,
    });
  
    // Subscribe to the dialog result
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // User clicked "Yes", proceed with deletion
        const index = this.dataSource.data.findIndex(row => row.ReferalPanNO === panNoToDelete);
  
        if (index !== -1) {
          // Remove the row from the data source
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
  
          // Perform any additional actions after successful deletion
          console.log('Record deleted successfully.');
  
          // Now you can execute further code
          // ...
        }
      } else {
        // User clicked "No" or closed the dialog without clicking "Yes"
        // console.log('Deletion canceled.');
      }
    });
  }
  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // console.log(this.form.value);
    const tableData: TableData = {
      ReferalName: this.form.get('refName')?.value,
      ReferalPanNO: this.form.get('refPanNo')?.value,
      ReferalEmailID: this.form.get('refEmail')?.value,
      CustName: this.form.get('cusName')?.value,
      CustMobi: this.form.get('cusMobile')?.value,
      CustEmail: this.form.get('cusEmail')?.value,
      Amount: this.form.get('amount')?.value,
    };
    // this.dataSource.data.push(tableData)
    this.dataSource.data = [...this.dataSource.data, tableData];
    this.resetForm('amount');
  }
  getTableColumnProperties(): string[] {
    return this.tableInfo.map(column => column.property);
  }

  handleOK() {
    this.dialog.closeAll();
  }
  handleConfirm(isConfirmed: boolean): void {
    // Close the dialog with the result
    this.dialogRef.close(isConfirmed);
  }
  handleCancel() {
    this.dialog.closeAll();
  }

  printReport(dialogTemplate?: TemplateRef<NgTemplateOutlet>) {
    if (this.dataSource.data.length === 0) {
      this.alertController = { action: false, message: 'Please enter atleast one record entry into the table.' }
      const dialogRef = this.OpenDialog(dialogTemplate , {
        disableClose: true,
      });
    }
    else{
      let input : {"ReferalList" : any[]} = {"ReferalList" : []};
      input.ReferalList = this.dataSource.data;
      // Show spinner while generating the report
      this.showSpinner = true;

      // console.log(input);
      this.generateReport(input).subscribe((result => {
        const message = JSON.parse(result.message);
        this.showSpinner = false;
        // console.log(message)
        if(message.Status === '1'){
          // console.log(`${environment.baseURL}${message.URL}`)
          const url = `${environment.baseURL}${message.URL}`;
          this.dataSource.data = [];
          window.open(url, '_blank');
        }else{
          alert('something went wrong!!!');
        }
      }))
    }
  }

  OpenDialog(template: any, config?: any): MatDialogRef<any> {
    return this.dialog.open(template, config);
  }

  generateReport(input: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseURL}/api/CommonAPI/GetReferalcommPDF`,
      input,
      this.httpOptions
    )
  }
} 
