import { ListRequestComponentModule } from './list-request/list-resquest.module';
import {SpinnerComponent} from './spinner/spinner.component';
import {InputSearchComponent} from './input-search/input-search.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteInterceptorService} from '../services/utils/route-event'
import { FormsModule,ReactiveFormsModule,FormControlDirective } from '@angular/forms';
import { MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ModalFinishReqComponent} from './modal-finish-req/modal-finish-req.component'
import {IsumosFormComponent} from './request/isumos-form/isumos-form.component'
 @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ListRequestComponentModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule
      
    ],
    declarations: [SpinnerComponent,InputSearchComponent,ModalFinishReqComponent,IsumosFormComponent],
    exports:[InputSearchComponent,SpinnerComponent,FormsModule,CommonModule,ListRequestComponentModule,FormControlDirective,ReactiveFormsModule,ModalFinishReqComponent,IsumosFormComponent,RouteInterceptorService]
  })
  export class sharedModules {}