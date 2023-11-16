import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AllRequestPageRoutingModule } from './allRequest-routing.module';
import { AllRequestPage } from './allRequest.page';
import {sharedModules} from '@components/components.module'
@NgModule({
  imports: [
    sharedModules,
    IonicModule,
    AllRequestPageRoutingModule,
  ],
  declarations: [AllRequestPage]
})
export class AllRequestPageModule {}
