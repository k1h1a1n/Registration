import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-alert',
  templateUrl: './action-alert.component.html',
  styleUrls: ['./action-alert.component.scss']
})
export class ActionAlertComponent {
  constructor(
  @Inject(MAT_DIALOG_DATA) public data: { action : boolean, title?: string , header?: string , message?: string, asHtml?: boolean },
    private dialogRef: MatDialogRef<ActionAlertComponent>
  ) {}
  handleConfirm() {
    this.dialogRef.close(true);
  }

  handleCancel() {
    this.dialogRef.close(false);
  }

  handleOK(){
    this.dialogRef.close(true);
  }
}
