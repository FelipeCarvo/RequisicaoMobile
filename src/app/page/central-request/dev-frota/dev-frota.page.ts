import { Component, OnInit,ViewChild,HostListener,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds} from '@core/store/actions/req.actions';
import {RequestService} from '@services/request/request.service';
import { ToastController } from '@ionic/angular';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute,Router} from '@angular/router';

import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { format } from 'date-fns';


@Component({
  selector: 'app-dev',
  templateUrl: './dev-frota.page.html',
  styleUrls: ['./dev.page.scss'],
})


export class RequestPage implements OnInit,OnDestroy {
  @ViewChild('appChild', {static: false}) childComponent;
  step: any = 0;
  load = false;
  rota = '';
  tituloPagina: any= '';
  validStep =  false;
  sendPost = false;
  hasButtonFinish = false;
  steps: any = [];
  public reqForm: UntypedFormGroup;

  listStatus: any =
    [
      { id:0, descricao:'Não concluido' },
      { id:1, descricao:'Solicitado' },
      { id:2, descricao:'Solicitação' },
      { id:3, descricao:'Cancelado' },
      { id:4, descricao:'Reprovado' },
    ];
  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    private store: Store,
    private toastController: ToastController,
    public loading: LoadingService,
    private rquestService: RequestService,
    // private alertServices: AlertServices,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  )
  {
    this.rota = route.snapshot.params.rota;
    if(this.rota==='dev'){
      this.steps =[ { key: 0, title: 'Pesquisa', enabled:true}];
    }else {
    this.steps =[
      { key: 0, title: 'Pesquisa', enabled:true},
      { key: 1, title: 'Nova Requisição', enabled: true}
    ];
    }

    this.store
    .select(state => state.ReqState)
    .subscribe(e => {
      this.validStep = store.selectSnapshot(ReqState.validEmpreendimentoId);
      this.steps[0].enabled = true;
      if(this.rota!=='dev'){
        this.steps[1].enabled = true;
      }

    });
  }
  get validReqId(){
    return true;
    // if (this.steps[0].enabled === true){
    //   return true;
    // }
    // return this.store.selectSnapshot(ReqState.validReqId);
  }
  get currentStatus(){
    return this.store.selectSnapshot(ReqState.getStatus);
  }
  get getFormForStore() {
    return this.store.selectSnapshot(ReqState.getReq);
  }

  public get empreendimentoId(){
    return this.store.selectSnapshot(ReqState.validEmpreendimentoId);
  }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  public get versaoEsperada(){
    return this.store.selectSnapshot(ReqState.getVersaoEsperada);
  }
  public get getCode(){
    return this.store.selectSnapshot(ReqState.getNumberValue);
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.initStep();
    // Actions
 }
  ngOnInit() {
    console.log('ngOnInit');
    this.initStep();
   // this.RequestFormFrotaPesqComponent.reset()

  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Cleared');
  }
  initStep(){
    this.step = 0;
    const {params} = this.route.snapshot;
  }
  updateButton(val){
    this.hasButtonFinish = val;
  }
  updateStep(step){
    this.step = step;
  }
  setStep(event){
    const val = parseInt(event.target.value, 10);
    this.step = val;
  }
  async onBack(): Promise<void> {
    this.router.navigate(['tabs/home-estoque']);
  }
  public setFormForStore(formField){
    this.store.dispatch(new setReqFileds(formField));
  }

  async incluirItens() {
    this.loading.present();
  }

  async showMsg(msg){
    const toast = await this.toastController.create(
      {
        message: msg,
        duration: 2000
      }
    );
    toast.present();
  }

  async sendReq(form){
    this.loading.present();
    let msg: string;
    const {params} = this.getParamsReq(form);
    if(this.rota === 'req') {
      this.rquestService.postReqFrota(params,'POST')
        .subscribe(async (res: any) => {
          const requisicaoId = res.requisicaoId;
          msg = `Requisição criada com sucesso: ${requisicaoId}`;
          this.loading.dismiss();
          //this.router.navigate([`tabs/list-in-frota/${requisicaoId}/${params.empreendimentoId}`]);
          this.router.navigate([`tabs/detail-request-frota/${requisicaoId}/${params.empreendimentoId}`],{queryParams: {rota:'req'}});
        },
        async (error) =>{
          msg = error.Mensagem? error.Mensagem : error;
          console.log(error);
          await this.showMsg(msg);
          this.loading.dismiss();
          this.step = this.step;
        }
      );
    } else if (this.rota === 'epi'){
      const paransEpi =  this.getParamsEpi(form);
      this.rquestService.postReqEpi(paransEpi,'POST')
        .subscribe(async (resapi: any) => {
          const requisicaoId = resapi.requisicaoId;
          msg = `Solicitação criada com sucesso: ${requisicaoId}`;
          this.loading.dismiss();
          this.router.navigate([`tabs/detail-request-frota/${requisicaoId}/${params.empreendimentoId}`],{queryParams: {rota:'epi'}});
        },
        async (error) =>{
          msg = error.Mensagem? error.Mensagem : error;
          console.log(error);
          await this.showMsg(msg);
          this.loading.dismiss();
          this.step = this.step;
        }
    );
  }
}

  async sendReqPesq(form){
    this.loading.present();
    const {params,type} = this.getParams(form);
    console.log(params);
    this.router.onSameUrlNavigation = 'reload';
    const url = `tabs/central-req/list-req-pesqfrota`;
    this.router.navigate([url],{queryParams: {rota:this.rota, colaboradorId: params.colaboradorId,
                                  statusTermo:params.statusId , dataIni:params.dataInicio,
                                  dataFim:params.dataFim, empreendimentoId:  params.empreendimentoId}});
    this.loading.dismiss();
  }
  getParamsReq(form){
    const paramsForm = Object.assign({}, form);
    for (const key in paramsForm) {
      if (!paramsForm[key]) {
        delete paramsForm[key];
      }
    }
    if(this.validReqId){
      paramsForm.id = this.requisicaoId;
      paramsForm.versaoEsperada = this.versaoEsperada;
      delete paramsForm.requisicaoId;
    }
    const params = {
      empreendimentoId:paramsForm.empreendimentoId,
      colaboradorId:paramsForm.colaboradorCod,
      empresaId: paramsForm.empresaId,
      documentoData: this.formatDate(paramsForm.dataInicio)
    };
    return {params};
  }
  getParamsEpi(form){
    const paramsForm = Object.assign({}, form);
    const params = {
      empreendimentoId:paramsForm.empreendimentoId,
      colaboradorId:paramsForm.colaboradorCod,
      observacao: '',
      baixaData: this.formatDate(new Date())
    };
    return params;
  }
  getParams(form){
    const paramsForm = Object.assign({}, form);
    const type = !this.validReqId ? 'PUT' :'POST';
    const params = {
      empreendimentoId:paramsForm.empreendimentoId,
      colaboradorId:paramsForm.colaboradorCod,
      statusId: paramsForm.statusId,
      dataInicio: this.formatDate(paramsForm.dataInicio),
      dataFim: this.formatDate(paramsForm.dataFinal)
    };
    console.log(params)
    for (const key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    return {params,type};
  }
  formatDate(date){
    if (date !== null){
      return format(date, 'yyyy-MM-dd');
    }
    return date;
  }
  gonew(){
    this.step = 0;
    this.step = 1;
  }
}
