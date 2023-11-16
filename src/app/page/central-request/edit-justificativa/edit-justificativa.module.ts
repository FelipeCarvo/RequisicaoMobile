import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {sharedModules} from '@components/components.module'
import { IonicModule } from '@ionic/angular';

import { EditJustificativaPageRoutingModule } from './edit-justificativa-routing.module';

import { EditJustificativaPage } from './edit-justificativa.page';

@NgModule({
  imports: [
    sharedModules,
    CommonModule,
    FormsModule,
    IonicModule,
    EditJustificativaPageRoutingModule
  ],
  declarations: [EditJustificativaPage]
})
export class EditJustificativaPageModule {}
