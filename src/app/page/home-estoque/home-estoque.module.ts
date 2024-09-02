import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HomeEstoquePage } from './home-estoque.page';
import { HomeEstoquePageModule } from './home-estoque-routing.module';
import {SharedModules} from '@components/components.module';
@NgModule({
  imports: [
    IonicModule,
    HomeEstoquePageModule,
    SharedModules,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [HomeEstoquePage]
})
export class HomeEstoquePageRoutingModule {}
