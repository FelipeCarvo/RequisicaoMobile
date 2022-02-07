import { ListRequestComponentModule } from './list-request/list-resquest.module';
import {SpinnerComponent} from './spinner/spinner.component';
import {InputSearchComponent} from './input-search/input-search.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormControlDirective } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {ModalFinishReqComponent} from './modal-finish-req/modal-finish-req.component'
 @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ListRequestComponentModule,
      ReactiveFormsModule,
      MatAutocompleteModule
      
    ],
    declarations: [SpinnerComponent,InputSearchComponent,ModalFinishReqComponent],
    exports:[InputSearchComponent,SpinnerComponent,FormsModule,CommonModule,ListRequestComponentModule,FormControlDirective,ReactiveFormsModule,ModalFinishReqComponent]
  })
  export class sharedModules {}