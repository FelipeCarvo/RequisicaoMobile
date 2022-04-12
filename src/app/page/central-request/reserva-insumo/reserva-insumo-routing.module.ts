import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaInsumoPage } from './reserva-insumo.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaInsumoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaInsumoPageRoutingModule {}
