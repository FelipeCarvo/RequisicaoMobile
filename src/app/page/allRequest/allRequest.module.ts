import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllRequestPageRoutingModule } from './allRequest-routing.module';
import { AllRequestPage } from './allRequest.page';
import { ListRequestComponentModule } from '../../components/list-request/list-resquest.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllRequestPageRoutingModule,
    ListRequestComponentModule

  ],
  declarations: [AllRequestPage]
})
export class AllRequestPageModule {}
