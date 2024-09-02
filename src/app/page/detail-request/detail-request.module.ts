import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DetailRequestPageRoutingModule } from './detail-request-routing.module';
import { DetailRequestPage } from './detail-request.page';
import {SharedModules} from '@components/components.module'
@NgModule({
  imports: [
    IonicModule,
    DetailRequestPageRoutingModule,
    SharedModules
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
