import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerCreationRoutingModule } from './customer-creation-routing.module';
import { CustomerCreateComponent } from './pages/customer-create/customer-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CustomerCreateComponent
  ],
  imports: [
    CommonModule,
    CustomerCreationRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class CustomerCreationModule { }
