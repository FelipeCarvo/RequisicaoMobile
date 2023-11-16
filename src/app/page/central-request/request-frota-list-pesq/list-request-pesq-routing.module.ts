import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListRequestFrotaPesqPage } from './list-request-pesq.page';

const routes: Routes = [
  {
    path: '',
    component: ListRequestFrotaPesqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRequestFrotaPesqPageRoutingModule {}
