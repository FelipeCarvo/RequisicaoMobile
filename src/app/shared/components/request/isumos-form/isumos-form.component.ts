import { Component, OnInit,Injectable ,Output ,Input,EventEmitter} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {InsumosRequest} from '@services/insumos/inusmo-req.service'
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
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
  @Output() resetAndBack:EventEmitter<any> = new EventEmitter();
 
  empreendimentoId:String = null;
  public reqFormInsumos: FormGroup;
  public etapas:any= [];
  public sendLoading: boolean = false;
  public insumoTypeUnidades:String = null;
  diference = new Date().toISOString();
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
 
  loadForm: boolean = false;
  hasLoaded:boolean = false;
  listItemFilter:FilterRequestFields ={
    EmpresasDoEmpreendimento:null,
    filteredOptionsInsumos:null,
    filteredOptionsPlanoDeContas:null,
    filteredOptionsServico:null,
    filteredOptionsBloco:null,
    filteredOptionsUnidade:null,
    filteredOptionsOrdemServico:null,
    filteredOptionsEquipamento:null
  };
  constructor(
    private loockupstService:LoockupstService,
    public navCtrl:NavController,
    private router:Router,
    private formBuilder: FormBuilder,
    private store:Store,
    private insumosRequest:InsumosRequest,
    private toastController:ToastController,

  ) {
   
   }

  async ngOnInit() {
    console.log(this.currentDay,this.currentyear)
    this.initForm();
    this.setDif()
    if(!!this.getFormField('etapaId')){
      this.getLoockupEtapa();
    }
  }
  setDateManual(val){
    this.diference = moment(new Date()).add(val, 'days').toISOString()
  }
  setUnidadeType(desc: string){
    if(!!desc){
      this.insumoTypeUnidades = desc.split('-')[1]
    }else{
      this.insumoTypeUnidades = null
    }
  }
  setDif(){
    let a = moment(this.diference);
    let b = moment(this.currentDay);
    let dif:any = a.diff(b,'days')
    this.reqFormInsumos.controls['prazo'].setValue(parseInt(dif))
  }
  async initForm(){
    const{empreendimentoId}=this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
    this.reqFormInsumos = this.formBuilder.group({
      empresaId:  new FormControl(null, [Validators.required]),
      etapaId:new FormControl(null),
      somenteInsumosDaEtapa:new FormControl(false),
      planoContasId:new FormControl(null, [Validators.required]),
      insumoSubstituicaoId:new FormControl(null),
      servicoId: new FormControl(null),
      insumoId:new FormControl(null, [Validators.required]),
      quantidade:new FormControl(0, [Validators.required,Validators.pattern(/[0-9]/),Validators.min(1)]),
      prazo:new FormControl(0, [Validators.required]),
      prazoDevolucao:new FormControl(null),
      complemento:new FormControl('S/COMPLEMENTO', [Validators.required]),
      estoque:new FormControl(false, [Validators.required]),
      gerarAtivoImobilizado:new FormControl(false, [Validators.required]),
      blocoId:new FormControl(null),
      unidadeId:new FormControl(null),
      ordemServicoId:new FormControl(null),
      equipamentoId:new FormControl(null),
      observacoes:new FormControl(null),
     
    });
    this.loadForm = true;
    await this.setValform();
    this.reqFormInsumos.valueChanges.subscribe(selectedValue  => {
      console.log(selectedValue);
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
  
  get disabledEtapa():boolean{
    let retorno;
    const somenteInsumosDaEtapa = this.reqFormInsumos?.get('somenteInsumosDaEtapa').value;
    const insumoId = this.reqFormInsumos?.get('insumoId').value;
    if(!!somenteInsumosDaEtapa){
      retorno = !insumoId
    }
    else{
      retorno = false;
    }
    return retorno
  }
  async setValform(){
    await this.reqFormInsumos.patchValue(this.getFormForStore);
  }
  async getLoockupEtapa(){
    let params;
    let somenteInsumosDaEtapa = this.reqFormInsumos?.get('somenteInsumosDaEtapa').value;
    let insumoId = this.reqFormInsumos?.get('insumoId').value;
    if(somenteInsumosDaEtapa){
      if(!!insumoId){
        params = {pesquisa: '',empreendimentoId:this.empreendimentoId,insumoId:insumoId,mostrarDI: true,};
      }else{
        this.etapas = [];
        return
      }
    }else{
      params = {pesquisa: '',empreendimentoId:this.empreendimentoId};
    }
    this.loockupstService.getLookUp(params,'etapaId').then(res =>{
      const selectedEtapa = this.getFormField('etapaId');
      this.etapas = res;
      if(!!selectedEtapa){
        let test = !!this.etapas.find(e => e.id == selectedEtapa);
        const insumoSubstituicaoId = this.getFormField('insumoSubstituicaoId');
        if(!!insumoSubstituicaoId){
          this.reqFormInsumos.controls['insumoSubstituicaoId'].setValue(null)
        }
        if(!test){
          this.reqFormInsumos.controls['etapaId'].setValue(null)
        }
      }
    });
  }
  selectedTextOption() {
    if(!!this.etapas)
    return this.etapas.filter(option => option.id == this.getFormField('etapaId'))[0]?.descricao
  }
  async getForm(){
    return this.reqFormInsumos.getRawValue();
  }
  getFormField(field){
    return this.reqFormInsumos.get(field).value
  }
  validForm(){
    return this.reqFormInsumos.valid;
  }
  get quantidadeInput() { return this.reqFormInsumos.get('quantidade'); }
  async submit(){
    const valid = this.validForm();
   if(valid){
    const params = await this.getForm();
    this.sendLoading = true;
    this.insumosRequest.sendNewInsumo(params).then(response =>{
      this.resetAndBack.emit();

    },async(error) =>{
      this.sendLoading = false;
      const toast = await this.toastController.create({
        message: error,
        duration: 2000
      });
      toast.present();
    })

   }
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    
    this.router.navigate(['/central-req/consulta-estoque']);
  }
}
