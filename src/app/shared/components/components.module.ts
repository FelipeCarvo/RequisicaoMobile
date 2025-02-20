import { ListRequest } from './list-request/list-request.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {InputSearchComponent} from './input-search/input-search.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ModalFinishReqComponent} from './modal-finish-req/modal-finish-req.component';
import {IsumosFormComponent} from './isumos-form/isumos-form.component';
import { IonicModule } from '@ionic/angular';
import{ListInsumosComponent} from './list-insumos/list-insumos.component';
import {ListInsumosByReqComponent} from './list-insumos-by-req/list-insumos-by-req.component';
import {Descripitionpipe,filterType} from '../pipes/descripition-pipe';
import {imageTypepipe} from '../pipes/image-type-pipe';
import {DisableControlDirective} from '../directives/disabled-input';
import {DocumentModalComponent} from '../components/document-modal/document-modal.component';
import {NoImageIconComponent} from '../components/no-image-icon/no-image-icon.component';
import {FilterReqComponent} from '../components/filter-req/filter-req.component';
import {NumberDirective} from '../directives/number-directive';
import {momentPipe} from '../pipes/moment-pipe';
import {MosuePositionDirective} from '../directives/mouse-position';
import {statusPipe,statusMoment} from '../pipes/status.pipe';
import {fullDate} from '../pipes/date-full-pipe';
import {sizeFormatPipe} from '../pipes/format-size-pipe';
import {JustificativaComponent} from '../components/request/justificativa/justificativa.component';
import {ListJustificativaComponent} from '../components/list-justificativa/list-justificativa.component';
import {ModalEstoqueComponent} from '../components/modal-estoque/modal-estoque.component';
import {StepOneComponent} from '../components/estoque/step-one/step-one.component';
import {StepTwoComponent} from '../components/estoque/step-two/step-two.component';
import {DocumentItemComponent} from '../components/document-item/document-item.component';
import {LoginComponent} from '../components/login/login/login.component';
import {ConfigComponent} from '../components/login/config/config.component';
const providers = [
  statusMoment,Descripitionpipe,DisableControlDirective,imageTypepipe,
  NumberDirective,momentPipe,MosuePositionDirective,statusPipe,sizeFormatPipe,
  fullDate,
  filterType
];
const matModules = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
];
const components = [
  ConfigComponent,
  LoginComponent,
  DocumentItemComponent,
  StepOneComponent,
  SpinnerComponent,
  StepTwoComponent,
  InputSearchComponent,
  QrScannerComponent,
  ListRequest,
  ModalFinishReqComponent,
  IsumosFormComponent,
  ListInsumosComponent,
  ListInsumosByReqComponent,
  DocumentModalComponent,
  NoImageIconComponent,
  FilterReqComponent,
  JustificativaComponent,
  ListJustificativaComponent,
  ModalEstoqueComponent
];
@NgModule({

  imports: [CommonModule, ReactiveFormsModule,FormsModule, IonicModule.forRoot(), ...matModules],
  declarations: [...components, ...providers],
  exports: [CommonModule,IonicModule, ReactiveFormsModule, ...matModules, ...providers, ...components]
})
export class SharedModules {}
  // @NgModule({
  //  providers: [DatePipe,Descripitionpipe,DisableControlDirective],
  //   imports: [
  //     CommonModule,
  //     FormsModule,
  //     ReactiveFormsModule,

  //     IonicModule
  //   ],
  //   declarations: [SpinnerComponent,InputSearchComponent,ModalFinishReqComponent,ListRequest,IsumosFormComponent,
  //ListInsumosComponent,ListInsumosByReqComponent,Descripitionpipe],
  //   exports:[FormsModule,CommonModule,FormControlDirective,ReactiveFormsModule,ModalFinishReqComponent,IsumosFormComponent,
  //ListInsumosComponent,ListInsumosByReqComponent,]
  // })
  // export class sharedModules {}
