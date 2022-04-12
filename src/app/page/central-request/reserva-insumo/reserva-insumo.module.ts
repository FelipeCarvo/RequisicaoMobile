import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservaInsumoPageRoutingModule } from './reserva-insumo-routing.module';

import { ReservaInsumoPage } from './reserva-insumo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaInsumoPageRoutingModule
  ],
  declarations: [ReservaInsumoPage]
})
export class ReservaInsumoPageModule {}
