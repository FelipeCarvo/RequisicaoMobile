import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { newHomePage } from './new-home.page';
import { newHomePageRoutingModule } from './new-home-routing.module';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    IonicModule,
    newHomePageRoutingModule,
    SharedModules,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [newHomePage]
})
export class newHomePageModule {}
