import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {sharedModules} from '@components/components.module'
import { DocumentsComponent } from './documents.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,sharedModules],
  declarations: [DocumentsComponent],
  exports: [DocumentsComponent]
})
export class DocumentsComponentComponentModule {}
