import { Component, OnInit,Injectable ,Output ,Input,EventEmitter,ViewChild,ChangeDetectorRef} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl} from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {InsumosRequest} from '@services/insumos/inusmo-req.service';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { InputSearchComponent } from '@components/input-search/input-search.component';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-isumos-form',
  templateUrl: './isumos-form.component.html',
  styleUrls: ['./isumos-form.component.scss'],

})
export class IsumosFormComponent implements OnInit {
  @Input() getFormForStore:any;
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  @Output() onlyReset:EventEmitter<any> = new EventEmitter();
  @Output() resetAndBack:EventEmitter<any> = new EventEmitter();
  @ViewChild('popOne') popOne;
  @ViewChild('popTwo') popTwo;
  @ViewChild('scrollTarget') scrollTarget;
  @ViewChild('etapaId') etapaIdComponent: InputSearchComponent;
  empreendimentoId:String = null;
  public reqFormInsumos: UntypedFormGroup;
  public metodSend: String = 'POST'
  public sendLoading: boolean = false;
  public insumoTypeUnidades:String = null;
  diference = new Date().toISOString();
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  closeModal = false;
  sendMsg:String = 'Adicionar Insumos';
  loadForm: boolean = false;
  hasLoaded:boolean = false;
  updateInsumos:boolean = false;
  saveInsumos:boolean = false;
  savePlanoDeContas:boolean = false;
  saveEtapas:boolean = false;
  saveblocoId:boolean = false;
  hasQtdOr:boolean = true;
  qtdOrc:number = 0;
  status:any =[
    {id: '1',label: 'Ativo'},
    {id: '2',label: 'Suspenso'},
    {id: '3',label: 'Cancelado'},
  ]
  listItemFilter:FilterRequestFields ={
    EmpresasDoEmpreendimento:null,
    filteredOptionsInsumos:null,
    filteredOptionsPlanoDeContas:null,
    filteredOptionsServico:null,
    filteredOptionsBloco:null,
    filteredOptionsUnidade:null,
    filteredOptionsOrdemServico:null,
    filteredOptionsEquipamento:null,
    filteredOptionsEtapas: null
  };
  constructor(
    private loockupstService:LoockupstService,
    public navCtrl:NavController,
    private router:Router,
    private formBuilder: UntypedFormBuilder,
    private store:Store,
    private insumosRequest:InsumosRequest,
    private toastController:ToastController,
    private cdr: ChangeDetectorRef

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
    let hasEtapa = !!this.reqFormInsumos?.get('somenteInsumosDaEtapa').value || !!this.etapaIdInput;
    if(hasEtapa){
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

    this.reqFormInsumos.controls['etapaId'].valueChanges.subscribe(res =>{
      const comp = this.etapaIdComponent;
      if (comp) {
        const etapa = comp.objetoSelecionado();
        if (!!etapa && !!etapa.planoContasId) {
          this.reqFormInsumos.controls['planoContasId'].setValue(etapa.planoContasId);
        }
      }
      const insumoSubstituicaoId = this.getFormField('insumoSubstituicaoId');
      if (!!insumoSubstituicaoId) {
        this.reqFormInsumos.controls['insumoSubstituicaoId'].setValue(null);
      }
    });
  }

  setDateManual(val){
    this.diference = moment(new Date()).add(val, 'days').toISOString();
  }
  changeQtdEtapa(ev){
   let insumoId = this.reqFormInsumos?.get('insumoId').value;
   if(!!insumoId){
     this.updateInsumos = true;
   }
    this.hasQtdOr = ev
  }
  setUnidadeType(desc: string){
    if(!!desc && this.hasInsumoId){
      let s =  desc.split(' - ')[1]
      let trim = s.trim();
      this.insumoTypeUnidades = trim.split(' ')[0];
      if(this.hasQtdOr){
        if(trim.split(' ').length > 1){
          this.insumoTypeUnidades = trim.split(' ')[1];
          let int = parseFloat(trim.split(' ')[0])
          if(this.qtdOrc == 0)
          this.qtdOrc = !!int ? int : 0;
        }
        else if(trim.split(' ').length == 1){
          this.insumoTypeUnidades = trim;
        }else{
          this.qtdOrc = 0;
        }
      }
      else{
        this.insumoTypeUnidades = trim.split(' ').length > 1 ? trim.split(' ')[1] : trim
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
      empresaId:  new UntypedFormControl(null, [Validators.required]),
      etapaId:new UntypedFormControl(null),
      somenteInsumosDaEtapa:new UntypedFormControl(false),
      planoContasId:new UntypedFormControl(null, [Validators.required]),
      insumoSubstituicaoId:new UntypedFormControl(null),
      servicoId: new UntypedFormControl(null),
      insumoId:new UntypedFormControl(null, [Validators.required]),
      quantidade:new UntypedFormControl(0, [Validators.required,Validators.pattern(/[0-9]/),Validators.min(1)]),
      prazo:new UntypedFormControl(0, [Validators.required]),
      prazoDevolucao:new UntypedFormControl(null),
      complemento:new UntypedFormControl('S/ COMPLEMENTO', [Validators.required]),
      estoque:new UntypedFormControl(false, [Validators.required]),
      gerarAtivoImobilizado:new UntypedFormControl(false, [Validators.required]),
      blocoId:new UntypedFormControl(null),
      unidadeId:new UntypedFormControl(null),
      ordemServicoId:new UntypedFormControl(null),
      equipamentoId:new UntypedFormControl(null),
      observacoes:new UntypedFormControl(null),
      status:new UntypedFormControl('Ativo'),

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
    if(this.getFormForStore.status === 0){
      this.reqFormInsumos.controls['status'].setValue('Ativo')
    }
  }
  changeQtd(ev){
    if(!ev){
      setTimeout(() => {
        this.reqFormInsumos.controls['quantidade'].setValue(0)
      })
    }
  }
  get parametrosLookupEtapa()
  {

    const somenteInsumosDaEtapa = this.reqFormInsumos?.get('somenteInsumosDaEtapa').value;
    const insumoId = this.reqFormInsumos?.get('insumoId').value;
    let insumoPesquisa = null;
    if(somenteInsumosDaEtapa){
      if(!!insumoId){
        insumoPesquisa = insumoId;
      }
    }
    return {
      pesquisa:'',
      empreendimentoId: this.empreendimentoId,
      insumoId: insumoPesquisa,
      mostrarDI: true
    };

  }

  getFormField(field){
    return this.reqFormInsumos.get(field).value
  }
  async submit(){
   if(this.validForm){
    this.sendLoading = true;
    const {id} = this.getFormForStore;
    if(this.hasQtdOr){
      await this.qtdInsumoMsg();
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
  async qtdInsumoMsg(){
    let qtd = this.getFormField('quantidade');
    let etapaId = this.getFormField('etapaId');
    let insumoId =  this.getFormField('insumoId');
    let insumoSubstituicaoId =  this.getFormField('insumoSubstituicaoId');
    if( !!etapaId){
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
      if(this.qtdOrc < 0 ){
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
      observacoes:null,
      status:'Ativo'
    }
    this.reqFormInsumos.patchValue(objForm)
    setTimeout(()=>{
      this.cdr.detectChanges();
    })
  }
}
