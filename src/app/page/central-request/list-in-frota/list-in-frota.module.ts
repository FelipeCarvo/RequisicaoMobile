import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInsumosFrotaPageRoutingModule } from './list-in-routing-frota.module';

import { ListInsumosFrotaPage } from './list-in-frota.page';
import {sharedModules} from '@components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInsumosFrotaPageRoutingModule,
    sharedModules
  ],
  declarations: [ListInsumosFrotaPage]
})
export class ListInsumosFrotaPageModule {}
