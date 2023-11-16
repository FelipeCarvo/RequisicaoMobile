import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllRequestPage } from './allRequest.page';

const routes: Routes = [
  {
    path: '',
    component: AllRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRequestPageRoutingModule {}
