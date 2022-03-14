import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { homePage } from './home.page';
import { homePageRoutingModule } from './home-routing.module';
import {sharedModules} from '@components/components.module'
@NgModule({
  imports: [
    IonicModule,
    homePageRoutingModule,
    sharedModules,
    ReactiveFormsModule
    
  ],
  declarations: [homePage]
})
export class homePageModule {}
