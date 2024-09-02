import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInsumosFrotaPageRoutingModule } from './list-in-routing-frota.module';

import { ListInsumosFrotaPage } from './list-in-frota.page';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInsumosFrotaPageRoutingModule,
    SharedModules
  ],
  declarations: [ListInsumosFrotaPage]
})
export class ListInsumosFrotaPageModule {}
