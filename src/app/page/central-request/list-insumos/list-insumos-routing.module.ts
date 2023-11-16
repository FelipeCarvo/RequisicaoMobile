import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInsumosPage } from './list-insumos.page';

const routes: Routes = [
  {
    path: '',
    component: ListInsumosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListInsumosPageRoutingModule {}
