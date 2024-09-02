import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SharedModules} from '@components/components.module';
import { IonicModule } from '@ionic/angular';

import { ConsultaEstoquePageRoutingModule } from './consulta-estoque-routing.module';

import { ConsultaEstoquePage } from './consulta-estoque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaEstoquePageRoutingModule,
    SharedModules
  ],
  declarations: [ConsultaEstoquePage]
})
export class ConsultaEstoquePageModule {}
