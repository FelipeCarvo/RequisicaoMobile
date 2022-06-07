import { Component, OnInit,Injectable ,Output ,Input,EventEmitter,ViewChild,ChangeDetectorRef} from '@angular/core';
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
  @ViewChild('popOne') popOne;
  @ViewChild('popTwo') popTwo;
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
  closeModal = false;
  sendMsg:String = 'Adicionar Insumos';
  loadedEtapas = false;
  loadForm: boolean = false;
  hasLoaded:boolean = false;
  updateInsumos:boolean = false;
  saveInsumos:boolean = false;
  savePlanoDeContas:boolean = false;
  saveEtapas:boolean = false;
  saveblocoId:boolean = false;
  hasQtdOr:boolean = true;
  qtdOrc:number = 0;
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
    private cdr: ChangeDetectorRef

  ) {
   
   }
   changeQtdEtapa(ev){
    let insumoId = this.reqFormInsumos?.get('insumoId').value;
    if(!!insumoId){
      this.updateInsumos = true;
    }
     this.hasQtdOr = ev
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
  get hasInsumoId():boolean{
    let valid = !!this.reqFormInsumos.get('insumoId').value;
    let hasQtd = this.reqFormInsumos.get('quantidade').value > 0;
    if(!valid && hasQtd){
      this.reqFormInsumos.controls['quantidade'].setValue(0)
    }
    return valid
  }
  get quantidadeInput() { 
    return this.reqFormInsumos.get('quantidade');
   }
  get etapaIdInput():String { return this.reqFormInsumos.get('etapaId').value; }
  get paramsInsumo(){
    let obj:{
      empreendimentoId?:String,
      pesquisa?:String,
      etapaId?:String,
      somenteInsumosDaEtapa?:Boolean,
      calcularQuantidade?:Boolean
    } = {empreendimentoId: this.empreendimentoId,pesquisa:'',calcularQuantidade:this.hasQtdOr}
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

      this.setDif(null);
    }
    
    if(!!this.getFormField('etapaId')){
      this.getLoockupEtapa();
    }
    this.reqFormInsumos.controls['etapaId'].valueChanges.subscribe(res =>{
      let etapas = this.etapas.filter(option => option.id == this.getFormField('etapaId'))[0];
      if(!!etapas && !!etapas.planoContasId){
        this.reqFormInsumos.controls['planoContasId'].setValue(etapas.planoContasId)
     
       }
    })
  }
  setDateManual(val){
    this.diference = moment(new Date()).add(val, 'days').toISOString();
  }
  setUnidadeType(desc: string){
    if(!!desc && this.hasInsumoId){
      // this.insumoTypeUnidades = desc.split('-')[1].trim();
      let s =  desc.split(' - ')[1]
      let trim = s.trim();
      console.log(trim)
      this.insumoTypeUnidades = trim.split(' ')[0];
      if(this.hasQtdOr){
        this.insumoTypeUnidades = trim.split(' ')[1];
        let int = parseFloat(trim.split(' ')[0])
        console.log(this.qtdOrc)
        if(this.qtdOrc == 0)
        this.qtdOrc = !!int ? int : 0;
      }else{
        this.qtdOrc = 0;
      }
    }else{
      this.insumoTypeUnidades = null
      this.qtdOrc = 0;
    }
  }
  async openPop(){
    await this.popOne.present();
  }
  async setPopTwo(event){
    await this.popTwo.dismiss();

  }
  async setDif(event){
    let a = moment(this.diference);
    let b = moment(this.currentDay);
    let dif:any = a.diff(b,'days');
    this.reqFormInsumos.controls['prazo'].setValue(parseInt(dif))
    setTimeout(async()=>{
      if(!this.closeModal){
        await this.popOne.dismiss();
        this.closeModal = true
      }else{
        this.closeModal = false 
      }
    },200)

        
  }
  eventChanged(event){
    let{type} = event
    if(type == 'cancel' || type == 'ionCancel'){
      this.reqFormInsumos.controls['etapaId'].setValue(null);
      this.emitFieldClean( {['etapaId']:null})
      this.updateInsumos = true;
    }
  }
  changeEtapa(){
    this.reqFormInsumos.controls['insumoId'].setValue(null);
    this.reqFormInsumos.controls['etapaId'].setValue(null);
    if(!this.updateInsumos)this.updateInsumos = true;
  }
  async initForm(){
    const{empreendimentoId,requisicaoId}=this.store.selectSnapshot(ReqState.getReq);
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

        if(formField != atualValue){
          this.setFormForStore.emit(formField);
          if(e === 'etapaId' && !!formField){
            this.updateInsumos = true;
          }
        }
      })
    })

  }
  emitFieldClean(formField){
    this.setFormForStore.emit(formField);
  }
  setfalseUpdate(){
    this.updateInsumos = false;
  }
  async setValform(){
    await this.reqFormInsumos.patchValue(this.getFormForStore);
  }
  changeQtd(ev){
    if(!ev){
      setTimeout(() => {
        this.reqFormInsumos.controls['quantidade'].setValue(0)
      })
    
    }
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
      const insumoSubstituicaoId = this.getFormField('insumoSubstituicaoId');
      let planoContasId = this.reqFormInsumos.controls['planoContasId'].value
      this.etapas = res;
      if(!!planoContasId){
        this.etapas = this.etapas.filter(el=>el.planoContasId == planoContasId)
      }
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
    let qtd = this.getFormField('quantidade');
    if(this.hasQtdOr){
      let etapaId = this.getFormField('etapaId');
      let insumoId =  this.getFormField('insumoId');
      let insumoSubstituicaoId =  this.getFormField('insumoSubstituicaoId');
      let obj = {
        empreendimentoId:this.empreendimentoId,
        insumoId,
        etapaId,
        insumoSubstituicaoId

      }
      let newObj = Object.keys(obj)
      .filter((k) => obj[k] != null)
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
      let res:any = await this.insumosRequest.getValidacaoInsumoOrc(newObj);
      let {quantidadePedida,quantidadeOrcada} = res;
      let total = quantidadePedida + qtd;
      if(total > quantidadeOrcada){
        const toast = await this.toastController.create({
          message: `Quantidade pedida para esta etapa é maior que a orçada. Quantidade Orçada do Insumo para a Etapa : ${quantidadeOrcada}<br />
          Quantidade Pedida do Insumo para a Etapa : ${total}`,
          duration: 4000,
          position: 'top'
        });
        toast.present();
      }
    }
    this.insumosRequest.sendNewInsumo(this.getForm,this.metodSend,id).subscribe(async(response) =>{
      this.sendLoading = false;
      let type = 'criado';


      if(this.metodSend === 'PUT'){
        type = 'editado'
        this.resetAndBack.emit();
      }else{

        this.resetForm();
        
        
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
    this.onlyReset.emit();
    this.insumoTypeUnidades = null;

    let empresaId = this.getFormField('empresaId');
    let qtd:number = this.getFormField('quantidade');
    let etapaId = this.saveEtapas ? this.getFormField('etapaId'):null;
    let insumoId = this.saveInsumos ? this.getFormField('insumoId'):null;
    let planoContasId = this.savePlanoDeContas ? this.getFormField('planoContasId'):null;
    let blocoId = this.saveblocoId ? this.getFormField('blocoId'):null;
    if(this.hasQtdOr && this.saveInsumos &&  this.qtdOrc != 0){
      console.log('aqui',this.qtdOrc - qtd
      )
      if(this.qtdOrc < 0 ){
        console.log('aqui')
        let res = this.qtdOrc - qtd;

        this.qtdOrc =res;
      }
      else{
        this.qtdOrc = this.qtdOrc + qtd;
      }
    }
    else{
      this.qtdOrc = 0;
    }
    let objForm = {
      empresaId:empresaId,
      etapaId:etapaId,
      somenteInsumosDaEtapa:false,
      planoContasId:planoContasId,
      insumoSubstituicaoId:null,
      servicoId:null,
      insumoId:insumoId,
      quantidade:0,
      prazo:0,
      prazoDevolucao:null,
      complemento:'S/ COMPLEMENTO',
      estoque:false,
      gerarAtivoImobilizado:false,
      blocoId:blocoId,
      unidadeId:null,
      ordemServicoId:null,
      equipamentoId:null,
      observacoes:null  
    }
    this.reqFormInsumos.patchValue(objForm)
    setTimeout(()=>{
      this.cdr.detectChanges();
    })

   

    // const controlNames = ['nameOne', 'nameTwo'];
    // controlNames.map((value: string) => this.reqFormInsumos.get(value).setValue(null));
  }
}
