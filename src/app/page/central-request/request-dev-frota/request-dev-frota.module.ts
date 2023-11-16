import { NgModule,Component } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { DetailRequestPageRoutingModule } from './request-dev-frota-routing.module';
import { DetailRequestPage } from './request-dev-frota.page';
import {sharedModules} from '@components/components.module';


@NgModule({
  imports: [
    IonicModule,
    DetailRequestPageRoutingModule,
    sharedModules
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
