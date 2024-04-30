import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCreateComponent } from './pages/customer-create/customer-create.component';

const routes: Routes = [
  {path:'' , redirectTo:'create' , pathMatch:"full"},
  {path: 'create' , component : CustomerCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCreationRoutingModule { }
