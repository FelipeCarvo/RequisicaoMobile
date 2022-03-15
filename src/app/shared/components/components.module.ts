import { ListRequest } from './list-request/list-request.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {InputSearchComponent} from './input-search/input-search.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormControlDirective } from '@angular/forms';
import { MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ModalFinishReqComponent} from './modal-finish-req/modal-finish-req.component'
import {IsumosFormComponent} from './request/isumos-form/isumos-form.component'
import { IonicModule } from '@ionic/angular';
import{ListInsumosComponent} from './list-insumos/list-insumos.component';
import {ListInsumosByReqComponent} from './list-insumos-by-req/list-insumos-by-req.component'
import { DatePipe } from '@angular/common';
import {Descripitionpipe} from '../pipes/descripition-pipe';
import {imageTypepipe} from '../pipes/image-type-pipe';
import {DisableControlDirective} from '../directives/disabled-input';
import {DocumentModalComponent} from '../components/document-modal/document-modal.component'
import {NoImageIconComponent} from '../components/no-image-icon/no-image-icon.component'
import {FilterReqComponent} from '../components/filter-req/filter-req.component'
import {NumberDirective} from '../directives/number-directive'
import {momentPipe} from '../pipes/moment-pipe'
import {MosuePositionDirective} from '../directives/mouse-position'
import {statusPipe,statusMoment} from '../pipes/status.pipe'
const providers = [
  statusMoment,Descripitionpipe,DisableControlDirective,imageTypepipe,NumberDirective,momentPipe,MosuePositionDirective,statusPipe
]
const matModules = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
]
const components = [
  SpinnerComponent,
  InputSearchComponent,
  ListRequest,
  ModalFinishReqComponent,
  IsumosFormComponent,
  ListInsumosComponent,
  ListInsumosByReqComponent,
  DocumentModalComponent,
  NoImageIconComponent,
  FilterReqComponent
]
@NgModule({
 
  imports: [CommonModule, ReactiveFormsModule,FormsModule, IonicModule.forRoot(), ...matModules],
  declarations: [...components, ...providers],
  exports: [CommonModule,IonicModule, ReactiveFormsModule, ...matModules, ...providers, ...components]
})
export class sharedModules {}
  // @NgModule({
  //  providers: [DatePipe,Descripitionpipe,DisableControlDirective],
  //   imports: [
  //     CommonModule,
  //     FormsModule,
  //     ReactiveFormsModule,
   
  //     IonicModule
  //   ],
  //   declarations: [SpinnerComponent,InputSearchComponent,ModalFinishReqComponent,ListRequest,IsumosFormComponent,ListInsumosComponent,ListInsumosByReqComponent,Descripitionpipe],
  //   exports:[FormsModule,CommonModule,FormControlDirective,ReactiveFormsModule,ModalFinishReqComponent,IsumosFormComponent,ListInsumosComponent,ListInsumosByReqComponent,]
  // })
  // export class sharedModules {}