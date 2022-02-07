import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsumoComponent } from './insumo.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [InsumoComponent],
  exports: [InsumoComponent]
})
export class InsumoComponentModule {}
