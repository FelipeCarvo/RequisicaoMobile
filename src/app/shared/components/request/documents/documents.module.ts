import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {SharedModules} from '@components/components.module';
import { DocumentsComponent } from './documents.component';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,SharedModules,],
  declarations: [DocumentsComponent],
  exports: [DocumentsComponent]
})
export class DocumentsComponentComponentModule {}
