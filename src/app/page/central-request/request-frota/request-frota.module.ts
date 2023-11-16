import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {sharedModules} from '@components/components.module';
import { RequestPageRoutingModule } from './request-frota-routing.module';
import {RequestFormComponentModule} from '@components/request/request-form-frota/solicitacao/resquest-form-frota.module';
import {RequestFormPesqComponentModule} from '@components/request/request-form-frota/pesquisa/request-form-frota-pesq.module';
import {InsumoComponentModule} from '@components/request/insumo/insumo.module';
import { RequestPage } from './request-frota.page';
import {DocumentsComponentComponentModule} from '@components/request/documents/documents.module';

@NgModule({
  imports: [
    sharedModules,
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPageRoutingModule,
    RequestFormComponentModule,
    InsumoComponentModule,
    DocumentsComponentComponentModule,
    RequestFormPesqComponentModule
  ],
  declarations: [RequestPage,]
})
export class RequestFrotaPageModule {}
