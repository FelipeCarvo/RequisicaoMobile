import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { homePage } from './home.page';
import { homePageRoutingModule } from './home-routing.module';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    IonicModule,
    homePageRoutingModule,
    SharedModules,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [homePage]
})
export class homePageModule {}
