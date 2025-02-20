import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAlteraQtdItemPageRoutingModule } from './modal-altera-qtd-item-routing.module';

import { ModalAlteraQtdItemPage } from './modal-altera-qtd-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAlteraQtdItemPageRoutingModule
  ],
  declarations: [ModalAlteraQtdItemPage]
})
export class ModalAlteraQtdItemPageModule {}
