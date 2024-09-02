import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInsumoBaixaPageRoutingModule } from './add-insumo-baixa-routing.module';

import { AddInsumoBaixaPage } from './add-insumo-baixa.page';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddInsumoBaixaPageRoutingModule,
    SharedModules
  ],
  declarations: [AddInsumoBaixaPage]
})
export class AddInsumoBaixaPageModule {}
