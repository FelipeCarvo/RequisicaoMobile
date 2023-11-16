import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInsumosFrotaPage } from './list-in-frota.page';

const routes: Routes = [
  {
    path: '',
    component: ListInsumosFrotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListInsumosFrotaPageRoutingModule {}
