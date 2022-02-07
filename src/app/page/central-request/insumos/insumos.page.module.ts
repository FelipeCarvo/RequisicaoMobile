import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InsumosPage } from './insumos.page';
import {InsumosPageRoutingModule} from './insumos-routing.module';
import {sharedModules} from '@components/components.module'
@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,InsumosPageRoutingModule,sharedModules],
  declarations: [InsumosPage],
  exports: [InsumosPage]
})
export class InsumosPageModule {}
