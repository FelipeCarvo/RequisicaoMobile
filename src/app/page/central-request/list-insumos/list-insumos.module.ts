import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInsumosPageRoutingModule } from './list-insumos-routing.module';

import { ListInsumosPage } from './list-insumos.page';
import {sharedModules} from '@components/components.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInsumosPageRoutingModule,
    sharedModules
  ],
  declarations: [ListInsumosPage]
})
export class ListInsumosPageModule {}
