import { Component, OnInit,Output ,Input,EventEmitter} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl} from '@angular/forms';
import {translateAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-form-frota',
  templateUrl: './request-form-frota.component.html',
  styleUrls: ['./request-form-frota.component.scss'],
  animations: [translateAnimation()]
})
export class RequestFormFrotaComponent implements OnInit {
  @Input() getFormForStore: any;
  @Input() validReqId: boolean;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  @Input() dateSolicit: any;
  @Input() dateInicial: any;
  rota='';
  sendLoading: boolean = false;
  public reqForm: UntypedFormGroup;
  private loadForm: boolean = false
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOfDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };

  load = false;
  constructor(
    private route: ActivatedRoute,
    private loockupstService: LoockupstService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.rota = route.snapshot.params.rota;
    this.initForm();
  }
  get hasValidForm(){
    return !!this.reqForm.valid;
  }
  get empreendimentoIdValue(){
    return this.reqForm.get('empreendimentoId').value;
  }
  get hasValueEmpreendimento(): boolean{
    return !!this.reqForm.get('empreendimentoId').value;
  }
  get colaboradorIdValue(){
    return this.reqForm.get('colaboradorCod').value;
  }
  get hasValueColaborador(): boolean{
    return !!this.reqForm.get('colaboradorCod').value;
  }
  get _dataSolicitacao(){
    return this.reqForm.get('dataSolicitacao').value;
  }
  get _dataInicio(){
    return this.reqForm.get('dataInicio').value;
  }
  async ngOnInit() {
    this.validReqId;
    await this.setValform();
  }
  get getForm(){
    return this.reqForm.getRawValue();
  }
  initForm(){
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new UntypedFormControl({value:null,disabled:false}, [Validators.required]),
      colaboradorCod: new UntypedFormControl({ value: null,disabled: false}, [Validators.required]),
      empresaId: new UntypedFormControl({ value: null,disabled: false}),
      dataInicio: [this.dateInicial],
    });
    this.loadForm = true;
  }

  async setValform(){
    await this.reqForm.patchValue(this.getFormForStore);
    const formVal = this.getForm;
    const obj1 = this.removeFields(formVal);
    const obj2 = this.removeFields(this.getFormForStore);
    this.UpdateForm.emit(JSON.stringify(obj1) !== JSON.stringify(obj2));
  }
  getFormField(field){
    return this.reqForm.get(field).value;
  }
  removeFields(obj){
    const res = Object.assign({}, obj);
    const filterVal =Object.keys(res).filter(e => res[e] == null || (e === 'requisicaoId' || e === 'id'));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    });
  }
  async sendForm(){
    this.sendLoading = true;
    await this.sendReq.emit(this.getForm);
    this.sendLoading = false;
  }
}
