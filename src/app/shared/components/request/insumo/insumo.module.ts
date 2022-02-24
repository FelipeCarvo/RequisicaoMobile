import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {sharedModules} from '@components/components.module'
import { InsumoComponent } from './insumo.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,sharedModules],
  declarations: [InsumoComponent],
  exports: [InsumoComponent]
})
export class InsumoComponentModule {}
