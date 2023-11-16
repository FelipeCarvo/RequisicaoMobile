import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { newHomePage } from './new-home.page';
import { newHomePageRoutingModule } from './new-home-routing.module';
import {sharedModules} from '@components/components.module';
@NgModule({
  imports: [
    IonicModule,
    newHomePageRoutingModule,
    sharedModules,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [newHomePage]
})
export class newHomePageModule {}
