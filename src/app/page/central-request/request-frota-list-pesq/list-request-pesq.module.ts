import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRequestFrotaPesqPageRoutingModule } from './list-request-pesq-routing.module';

import { ListRequestFrotaPesqPage } from './list-request-pesq.page';
import {sharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRequestFrotaPesqPageRoutingModule,
    sharedModules
  ],
  declarations: [ListRequestFrotaPesqPage]
})
export class ListRequestFrotaPesqPageModule {}
