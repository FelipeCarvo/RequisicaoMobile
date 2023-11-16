import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {sharedModules} from '../../components.module'
import { IonicModule } from '@ionic/angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RequestFormComponent } from './request-form.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MatAutocompleteModule,ReactiveFormsModule,sharedModules],
  declarations: [RequestFormComponent],
  exports: [RequestFormComponent]
})
export class RequestFormComponentModule {}
