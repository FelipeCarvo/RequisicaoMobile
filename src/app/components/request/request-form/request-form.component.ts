import { Component, OnInit,ViewChild ,} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {opacityAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { Store } from '@ngxs/store';
import {ReqState} from '@store/state/req.state';
import {setReqFileds} from '@store/actions/req.actions'
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
  constructor(private loockupstService:LoockupstService,private formBuilder: FormBuilder, private store:Store) { }
  
  ngOnInit() {
   
    this.getLoockupMotivo();
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new FormControl(null, [Validators.required]),
      motivoId: new FormControl(null),
      OFsDescontoMaterial: [null],
      aprovador: new FormControl(null),
      observacao:[null]
    });
    this.setValform()
    this.reqForm.valueChanges.subscribe(selectedValue  => {
     
      let filterVal =Object.keys(selectedValue).filter(e => selectedValue[e] !== null);
      filterVal.forEach(e =>{
        let val = this.getFormField(e);
        let formField = {[e]:val};
        this.store.dispatch(new setReqFileds(formField));
      })
      // let val = this.getFormField(filterVal);
      // let formField = {[filterVal]:val}
      // this.store.dispatch(new setReqFileds(formField));
    })
  }

  async getLoockupMotivo(){
    const params = {pesquisa: ''};
    this.loockupstService.getLookUp(params,'motivoId').then(res =>{
      this.motivos = res;
    });
   
  }
  setValform(){
    let arr :any = this.store.selectSnapshot(ReqState.getReq);
    this.reqForm.patchValue(arr);
  }
  getFormField(field){
    return this.reqForm.get(field).value
  }
  selectedTest() {
    if(!!this.motivos)
    return this.motivos.filter(option => option.id == this.getFormField('motivoId'))[0]?.descricao
  
  }

  validform(){
    return this.reqForm.valid;
  }
  getForm(){
    return this.reqForm.getRawValue();
    //console.log(this.reqForm.valid)
  }
}
