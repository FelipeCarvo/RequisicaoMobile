import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInsumosPageRoutingModule } from './list-insumos-routing.module';

import { ListInsumosPage } from './list-insumos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInsumosPageRoutingModule
  ],
  declarations: [ListInsumosPage]
})
export class ListInsumosPageModule {}
