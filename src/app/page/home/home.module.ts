import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { homePage } from './home.page';
import { ListRequestComponentModule } from '../../components/list-request/list-resquest.module';

import { homePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListRequestComponentModule,
    homePageRoutingModule
  ],
  declarations: [homePage]
})
export class homePageModule {}
