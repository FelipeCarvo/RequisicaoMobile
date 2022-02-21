import { Component, OnInit,Output ,Input,EventEmitter} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {opacityAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { filter } from 'rxjs/operators';
import {RequestFormInterface} from '@services/utils/interfaces/reqForm.interce'
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  animations: [opacityAnimation()]
})
export class RequestFormComponent implements OnInit {
  @Input()getFormForStore:any;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  public reqForm: FormGroup;
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOFsDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };
  motivos:any;
  load = false;
  constructor(private loockupstService:LoockupstService,private formBuilder: FormBuilder) {
    this.initForm();
  }
  async ngOnInit() {
    this.getLoockupMotivo();
    await this.setValform();
    this.reqForm.valueChanges.subscribe(selectedValue  => {
      let filterVal =Object.keys(selectedValue).filter(e => selectedValue[e] !== null && this.getFormForStore[e] != selectedValue[e]);
      filterVal.forEach(e =>{
 
        let val = this.getFormField(e);
        let formField = {[e]:val};
        let atualValue = this.getFormForStore[e];
        if(formField != atualValue){
          this.setFormForStore.emit(formField);
          this.UpdateForm.emit(true);
        }
      })
    })
  }
 
  initForm(){
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new FormControl(null, [Validators.required]),
      motivoId: new FormControl(null),
      OFsDescontoMaterial: [null],
      aprovador: new FormControl({value:null}),
      observacao:[null]
    });
  }
  getDisable(){
    if(!!this.reqForm){
      return this.reqForm.get('empreendimentoId').invalid
    }
  }
  async getLoockupMotivo(){
    const {motivoId} = this.getFormForStore;
    console.log(motivoId)
    const params:RequestFormInterface = {motivos: {pesquisa:null}};
    let {motivos} = params; 
    Object.keys(motivos).forEach(key => {
      console.log(motivos[key])
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
    let formVal = await this.getForm();
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
  validform(){
    return this.reqForm.valid;
  }
  async getForm(){
    return this.reqForm.getRawValue();
  }
  removeFields(obj){
    let res = Object.assign({}, obj);
    let filterVal =Object.keys(res).filter(e => res[e] == null || (e == "requisicaoId" || e == "id"));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    })
  }
}