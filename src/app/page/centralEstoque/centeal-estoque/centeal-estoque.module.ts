import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentealEstoquePageRoutingModule } from './centeal-estoque-routing.module';

import { CentealEstoquePage } from './centeal-estoque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentealEstoquePageRoutingModule
  ],
  declarations: [CentealEstoquePage]
})
export class CentealEstoquePageModule {}
