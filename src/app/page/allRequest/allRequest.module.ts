import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AllRequestPageRoutingModule } from './allRequest-routing.module';
import { AllRequestPage } from './allRequest.page';
import {SharedModules} from '@components/components.module'
@NgModule({
  imports: [
    SharedModules,
    IonicModule,
    AllRequestPageRoutingModule,
  ],
  declarations: [AllRequestPage]
})
export class AllRequestPageModule {}
