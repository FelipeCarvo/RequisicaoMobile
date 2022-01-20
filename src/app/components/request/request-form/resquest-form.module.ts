import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestFormComponent } from './request-form.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [RequestFormComponent],
  exports: [RequestFormComponent]
})
export class RequestFormComponentModule {}
