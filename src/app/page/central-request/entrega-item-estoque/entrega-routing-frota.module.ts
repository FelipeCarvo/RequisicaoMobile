import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntregaRequestPage } from './entrega-frota.page';

const routes: Routes = [
  {
    path: '',
    component: EntregaRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntregaRequestPageRoutingModule {}
