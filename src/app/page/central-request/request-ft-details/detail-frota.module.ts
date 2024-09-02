import { NgModule,Component } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { DetailRequestPageRoutingModule } from './detail-routing-frota.module';
import { DetailRequestPage } from './detail-frota.page';
import {SharedModules} from '@components/components.module';


@NgModule({
  imports: [
    IonicModule,
    DetailRequestPageRoutingModule,
    SharedModules
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
