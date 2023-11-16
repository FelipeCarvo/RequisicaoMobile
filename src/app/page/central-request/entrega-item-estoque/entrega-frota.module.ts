import { NgModule,Component } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { EntregaRequestPageRoutingModule } from './entrega-routing-frota.module';
import { EntregaRequestPage } from './entrega-frota.page';
import {sharedModules} from '@components/components.module';


@NgModule({
  imports: [
    IonicModule,
    EntregaRequestPageRoutingModule,
    sharedModules
  ],
  declarations: [EntregaRequestPage]
})
export class EntregaRequestPageModule {}
