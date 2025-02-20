import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalExcluiReqDevPageRoutingModule } from './modal-exclui-req-dev-routing.module';

import { ModalExcluiReqDevPage } from './modal-exclui-req-dev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalExcluiReqDevPageRoutingModule
  ],
  declarations: [ModalExcluiReqDevPage]
})
export class ModalExcluiReqDevPageModule {}
