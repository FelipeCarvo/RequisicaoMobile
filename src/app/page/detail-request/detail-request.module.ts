import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailRequestPageRoutingModule } from './detail-request-routing.module';

import { DetailRequestPage } from './detail-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailRequestPageRoutingModule
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
