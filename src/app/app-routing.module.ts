import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'' , redirectTo:'customer-creation' , pathMatch:"full"},
  {
    path: 'customer-creation',
    loadChildren: () =>
      import('./customer-creation/customer-creation.module').then((m) => m.CustomerCreationModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
