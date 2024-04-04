import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItensDevolverFrotasPage } from './itens-devolver-frotas.page';

const routes: Routes = [
  {
    path: '',
    component: ItensDevolverFrotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItensDevolverFrotasPageRoutingModule {}
