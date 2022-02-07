import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRequest } from './list-request.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ListRequest],
  exports: [ListRequest]
})
export class ListRequestComponentModule {}
