import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {sharedModules} from '../../../components.module';
import { IonicModule } from '@ionic/angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RequestFormFrotaComponent } from './request-form-frota.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MatAutocompleteModule,ReactiveFormsModule,sharedModules],
  declarations: [RequestFormFrotaComponent],
  exports: [RequestFormFrotaComponent]
})
export class RequestFormComponentModule {}
