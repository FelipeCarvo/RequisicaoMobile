import { Component, OnInit,Injectable ,Output ,Input,EventEmitter} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-isumos-form',
  templateUrl: './isumos-form.component.html',
  styleUrls: ['./isumos-form.component.scss'],
})
export class IsumosFormComponent implements OnInit {
  @Input()getFormForStore:any;
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  empreendimentoId:String = null;
  public reqForm: FormGroup;
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsInsumos:null,
    filteredOptionsPlanoDeContas:null,
    filteredOptionsServico:null
  };
  constructor(
    private loockupstService:LoockupstService,
    public navCtrl:NavController,
    private router:Router,
    private formBuilder: FormBuilder,
    private store:Store
  ) { }

  async ngOnInit() {
    const{empreendimentoId}=this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
    this.reqForm = this.formBuilder.group({
      empresaId:  new FormControl('', [Validators.required]),
      planoContasId:[null],
      servicoId: [null],
      insumoId:[null],
      blocoId:[null],
      unidadeId:[null]
    });
    await this.setValform();
    this.reqForm.valueChanges.subscribe(selectedValue  => {
      if(!!selectedValue.insumoId){
        const params = {pesquisa: '',empreendimentoId:this.empreendimentoId,insumoId:selectedValue.insumoId,mostrarDI:true};
        this.getLoockupEtapa(params);
      }
      let filterVal =Object.keys(selectedValue).filter(e => selectedValue[e] !== null && this.getFormForStore[e] != selectedValue[e]);
      filterVal.forEach(e =>{
       
        let val = this.getFormField(e);
        let formField = {[e]:val};
        let atualValue = this.getFormForStore[e]
        if(formField != atualValue){
          this.setFormForStore.emit(formField);
        }
      })
    })
  }
  async setValform(){  
    await this.reqForm.patchValue(this.getFormForStore);
  }
  async getLoockupEtapa(params){
    this.loockupstService.getLookUp(params,'etapaId').then(res =>{
     console.log(res)
    });
  }
  async getForm(){
    return this.reqForm.getRawValue();
  }
  getFormField(field){
    return this.reqForm.get(field).value
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    this.router.navigate(['/central-req/consulta-estoque']);
  }
}
