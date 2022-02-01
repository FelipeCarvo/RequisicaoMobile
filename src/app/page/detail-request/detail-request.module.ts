import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DetailRequestPageRoutingModule } from './detail-request-routing.module';
import { DetailRequestPage } from './detail-request.page';
import {sharedModules} from '../../components/components.module'
@NgModule({
  imports: [
    IonicModule,
    DetailRequestPageRoutingModule,
    sharedModules
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
