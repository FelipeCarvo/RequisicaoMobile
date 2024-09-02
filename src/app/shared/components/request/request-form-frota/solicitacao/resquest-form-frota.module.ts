import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {SharedModules} from '../../../components.module';
import { IonicModule } from '@ionic/angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RequestFormFrotaComponent } from './request-form-frota.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MatAutocompleteModule,ReactiveFormsModule,SharedModules],
  declarations: [RequestFormFrotaComponent],
  exports: [RequestFormFrotaComponent]
})
export class RequestFormComponentModule {}
