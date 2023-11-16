import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {sharedModules} from '../../../components.module';
import { IonicModule } from '@ionic/angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RequestFormFrotaPesqComponent } from './request-form-frota-pesq.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MatAutocompleteModule,ReactiveFormsModule,sharedModules],
  declarations: [RequestFormFrotaPesqComponent],
  exports: [RequestFormFrotaPesqComponent]
})
export class RequestFormPesqComponentModule {}
