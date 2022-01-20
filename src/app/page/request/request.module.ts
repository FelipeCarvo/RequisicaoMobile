import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestPageRoutingModule } from './request-routing.module';
import {RequestFormComponentModule} from '../../components/request/request-form/resquest-form.module'
import {InsumoComponentModule} from '../../components/request/insumo/insumo.module'
import { RequestPage } from './request.page';
import {DocumentsComponentComponentModule} from '../../components/request/documents/documents.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPageRoutingModule,
    RequestFormComponentModule,
    InsumoComponentModule,
    DocumentsComponentComponentModule
  ],
  declarations: [RequestPage]
})
export class RequestPageModule {}
