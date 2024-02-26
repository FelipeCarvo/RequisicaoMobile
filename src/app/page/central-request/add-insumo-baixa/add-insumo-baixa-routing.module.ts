import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInsumoBaixaPage } from './add-insumo-baixa.page';

const routes: Routes = [
  {
    path: '',
    component: AddInsumoBaixaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddInsumoBaixaPageRoutingModule {}
