import { Component, OnInit,Output ,Input,EventEmitter} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl} from '@angular/forms';
import {translateAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import {RequestFormInterface} from '@services/utils/interfaces/reqForm.interce'
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  animations: [translateAnimation()]
})
export class RequestFormComponent implements OnInit {
  @Input() getFormForStore :any;
  @Input() validReqId: boolean;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  sendLoading: boolean = false;
  public reqForm: UntypedFormGroup;
  private loadForm:boolean = false
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOfDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };
  motivos:any;
  load = false;
  constructor(
    private loockupstService:LoockupstService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.initForm();
  }
  get hasValidForm(){
    return !!this.reqForm.valid;
  }
  get empreendimentoIdValue(){
    return this.reqForm.get("empreendimentoId").value
  }
  get hasValueEmpreendimento():boolean{
    return !!this.reqForm.get("empreendimentoId").value
  }
  async ngOnInit() {
    this.getLoockupMotivo();
    this.validReqId;
    await this.setValform();
  }
  get getForm(){
    return this.reqForm.getRawValue();
  }
  initForm(){
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new UntypedFormControl({value:null,disabled:false}, [Validators.required]),
      motivoId: new UntypedFormControl({ value: null,disabled: false}),
      ofDescontoMaterial: new UntypedFormControl({ value: null,disabled: false}),
      aprovador: new UntypedFormControl({ value: null,disabled: false}),
      observacao:new UntypedFormControl({value:null,disabled:false})
    });
    this.loadForm = true;
  }
  async getLoockupMotivo(){
    const {motivoId} = this.getFormForStore;
    const params:RequestFormInterface = {motivos: {pesquisa:''}};
    let {motivos} = params; 
    Object.keys(motivos).forEach(key => {
      if (motivos[key] == null && key != 'pesquisa') {
        delete motivos[key];
      }
    });
    this.loockupstService.getLookUp(motivos,'motivoId').then(res =>{
      this.motivos = res;
    });
  }
  async setValform(){  
    await this.reqForm.patchValue(this.getFormForStore);
    let formVal = this.getForm;
    let obj1 = this.removeFields(formVal);
    let obj2 = this.removeFields(this.getFormForStore);
    this.UpdateForm.emit(JSON.stringify(obj1) !== JSON.stringify(obj2))
  }
  getFormField(field){
    return this.reqForm.get(field).value
  }
  selectedTextOption() {
    if(!!this.motivos)
    return this.motivos.filter(option => option.id == this.getFormField('motivoId'))[0]?.descricao
  }


  removeFields(obj){
    let res = Object.assign({}, obj);
    let filterVal =Object.keys(res).filter(e => res[e] == null || (e == "requisicaoId" || e == "id"));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    })
  }
  async sendForm(){
    this.sendLoading = true;
    await this.sendReq.emit(this.getForm);
    this.sendLoading = false;
  }
}