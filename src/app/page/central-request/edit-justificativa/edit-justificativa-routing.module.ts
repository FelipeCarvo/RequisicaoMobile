import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditJustificativaPage } from './edit-justificativa.page';

const routes: Routes = [
  {
    path: '',
    component: EditJustificativaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditJustificativaPageRoutingModule {}
