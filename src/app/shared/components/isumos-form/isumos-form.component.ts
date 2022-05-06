import { Component, OnInit,Injectable ,Output ,Input,EventEmitter,ViewChild} from '@angular/core';
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
  @Output() onlyReset:EventEmitter<any> = new EventEmitter();
  @Output() resetAndBack:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('scrollTarget') scrollTarget;
  empreendimentoId:String = null;
  public reqFormInsumos: FormGroup;
  public etapas:any= [];
  public metodSend: String = 'POST'
  public sendLoading: boolean = false;
  public insumoTypeUnidades:String = null;
  diference = new Date().toISOString();
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  sendMsg:String = 'Adicionar Insumos';
  loadedEtapas = false;
  loadForm: boolean = false;
  hasLoaded:boolean = false;
  updateInsumos:boolean = false;
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
  get quantidadeInput() { return this.reqFormInsumos.get('quantidade'); }
  get etapaIdInput():String { return this.reqFormInsumos.get('etapaId').value; }
  get paramsInsumo(){
    let obj:{empreendimentoId?:String,pesquisa?:String,etapaId?:String,somenteInsumosDaEtapa?:Boolean} = {empreendimentoId: this.empreendimentoId,pesquisa:''}
    if(!!this.etapaIdInput){
      obj.etapaId = this.etapaIdInput
      obj.somenteInsumosDaEtapa = true
    }
    return obj
  }
  get validForm(){
    return this.reqFormInsumos.valid;
  }
  get getForm(){
    return this.reqFormInsumos.getRawValue();
  }
  async ngOnInit() {
    const {id} = this.getFormForStore;
    if(!!id){
      this.metodSend = 'PUT';
      this.sendMsg = 'Editar Insumos';
    }
    this.initForm();
    if(!this.reqFormInsumos.controls['prazo'].value){
      this.setDif();
    }
    
    if(!!this.getFormField('etapaId')){
      this.getLoockupEtapa();
    }
  }
  setDateManual(val){
    this.diference = moment(new Date()).add(val, 'days').toISOString();
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
    let dif:any = a.diff(b,'days');
    this.reqFormInsumos.controls['prazo'].setValue(parseInt(dif))    
  }
  changeEtapa(){
    this.reqFormInsumos.controls['insumoId'].setValue(null);
    this.reqFormInsumos.controls['etapaId'].setValue(null);
    if(!this.updateInsumos)this.updateInsumos = true;
  }
  async initForm(){
    const{empreendimentoId,requisicaoId}=this.store.selectSnapshot(ReqState.getReq);
    console.log(empreendimentoId,requisicaoId)
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
      complemento:new FormControl('S/ COMPLEMENTO', [Validators.required]),
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

      let filterVal =Object.keys(selectedValue).filter(e => selectedValue[e] !== null && this.getFormForStore[e] != selectedValue[e]);
      filterVal.forEach(e =>{
        let val = this.getFormField(e);
        let formField = {[e]:val};
        let atualValue = this.getFormForStore[e];
        if(e === 'etapaId' && formField != atualValue){
          console.log(e)
          this.updateInsumos = true;
        }
        if(formField != atualValue){
          this.setFormForStore.emit(formField);
        }
      })
    })
  }
  
  setfalseUpdate(){
    this.updateInsumos = false;
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
        if(!!this.etapaIdInput){
          this.changeEtapa()
        }
      }else{
        this.etapas = [];
        return
      }
    }else{
      params = {pesquisa: '',empreendimentoId:this.empreendimentoId};
    }
    this.loockupstService.getLookUp(params,'etapaId').then(res =>{
      this.loadedEtapas = true;
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

  getFormField(field){
    return this.reqFormInsumos.get(field).value
  }


  async submit(){
   if(this.validForm){
    this.sendLoading = true;
    const {id} = this.getFormForStore;
    this.insumosRequest.sendNewInsumo(this.getForm,this.metodSend,id).subscribe(async(response) =>{
      this.sendLoading = false;
      let type = 'criado';

      if(this.metodSend === 'PUT'){
        type = 'editado'
        this.resetAndBack.emit();
      }else{
        this.resetForm();
        this.insumoTypeUnidades = null
        this.onlyReset.emit();
        this.scrollToElement();
      }
      const toast = await this.toastController.create({
        message: `Insumo ${type} com sucesso`,
        duration: 3000
      });
      toast.present();
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
  scrollToElement() {
    let el = this.scrollTarget.nativeElement
    el.scrollIntoView({ behavior: 'smooth' });
  }
  public resetForm(){
 
    Object.keys(this.reqFormInsumos.controls).forEach(key => {
      if(key != 'empresaId' && key != 'complemento'){
        this.reqFormInsumos.get(key).setValue(null)
      }
    });
    // const controlNames = ['nameOne', 'nameTwo'];
    // controlNames.map((value: string) => this.reqFormInsumos.get(value).setValue(null));
  }
}
