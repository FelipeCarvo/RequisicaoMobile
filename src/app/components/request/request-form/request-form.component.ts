import { Component, OnInit,Output ,Input,EventEmitter} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {opacityAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
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
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  public reqForm: FormGroup;
  // filteredOptionsEmpreendimento: Observable<string[]>;
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOFsDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };
  motivos:any;
  load = false;
  object ={
    "motivoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "observacao": "string",
    "empreendimentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "ofDescontoMaterial": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "exportadoConstruCompras": true,
    "prazoCotacaoConstruCompras": 0,
    "aprovador": "string",
    "versaoEsperada": 0
  }
  constructor(private loockupstService:LoockupstService,private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.getLoockupMotivo();
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new FormControl(null, [Validators.required]),
      motivoId: new FormControl(null),
      OFsDescontoMaterial: [null],
      aprovador: new FormControl(null),
      observacao:[null]
    });
    this.setValform();
    this.reqForm.valueChanges.subscribe(selectedValue  => {
      let filterVal =Object.keys(selectedValue).filter(e => selectedValue[e] !== null && this.getFormForStore[e] != selectedValue[e]);
      filterVal.forEach(e =>{
        let val = this.getFormField(e);
        let formField = {[e]:val};
        this.setFormForStore.emit(formField);
      })
    })
  }

  async getLoockupMotivo(){
    const params = {pesquisa: ''};
    this.loockupstService.getLookUp(params,'motivoId').then(res =>{
      this.motivos = res;
    });
  }
  setValform(){
    this.reqForm.patchValue(this.getFormForStore);
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
  getForm(){
    return this.reqForm.getRawValue();
  }
}