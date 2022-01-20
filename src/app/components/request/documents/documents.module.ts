import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentsComponent } from './documents.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [DocumentsComponent],
  exports: [DocumentsComponent]
})
export class DocumentsComponentComponentModule {}
