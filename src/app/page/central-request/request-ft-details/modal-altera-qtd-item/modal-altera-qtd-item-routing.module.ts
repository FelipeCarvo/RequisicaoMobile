import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAlteraQtdItemPage } from './modal-altera-qtd-item.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAlteraQtdItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAlteraQtdItemPageRoutingModule {}
