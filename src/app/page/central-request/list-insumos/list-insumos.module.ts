import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInsumosPageRoutingModule } from './list-insumos-routing.module';

import { ListInsumosPage } from './list-insumos.page';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInsumosPageRoutingModule,
    SharedModules
  ],
  declarations: [ListInsumosPage]
})
export class ListInsumosPageModule {}
