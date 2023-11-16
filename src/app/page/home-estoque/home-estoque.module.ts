import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HomeEstoquePage } from './home-estoque.page';
import { HomeEstoquePageModule } from './home-estoque-routing.module';
import {sharedModules} from '@components/components.module';
@NgModule({
  imports: [
    IonicModule,
    HomeEstoquePageModule,
    sharedModules,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [HomeEstoquePage]
})
export class HomeEstoquePageRoutingModule {}
