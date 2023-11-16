import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailRequestPage } from './detail-request.page';

const routes: Routes = [
  {
    path: '',
    component: DetailRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRequestPageRoutingModule {}
