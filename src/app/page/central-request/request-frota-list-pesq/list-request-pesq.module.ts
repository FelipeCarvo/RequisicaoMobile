import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRequestFrotaPesqPageRoutingModule } from './list-request-pesq-routing.module';

import { ListRequestFrotaPesqPage } from './list-request-pesq.page';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRequestFrotaPesqPageRoutingModule,
    SharedModules
  ],
  declarations: [ListRequestFrotaPesqPage]
})
export class ListRequestFrotaPesqPageModule {}
