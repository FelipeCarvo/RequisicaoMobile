import { Component, OnInit,ViewChild,HostListener,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '@components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds,ResetStateReq} from '@core/store/actions/req.actions';
import {RequestService} from '@services/request/request.service';
import { ToastController } from '@ionic/angular';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import {UpdateRequestStatus} from '@services/send-status/send-status.service';
import {ActivatedRoute,Router} from '@angular/router';
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit,OnDestroy {
  @ViewChild('appChild', {static: false}) childComponent;
  step: any = 0;
  validStep = false;
  sendPost = false;
  hasButtonFinish = false;
  // requisicaoId:string = null;
  // versaoEsperada:Number;
  steps: any = [
    { key: 0, title: 'Requisição',enabled:true},
    { key: 1, title: 'Insumos',enabled:this.validStep},
    { key: 2, title: 'Documentos',enabled:this.validStep},
    { key: 3, title: 'Justificativa',enabled:this.validStep},
  ];
  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    private store: Store,
    private rquestService: RequestService,
    private toastController: ToastController,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private updateRequestStatus: UpdateRequestStatus,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  )
  {
    this.store
    .select(state => state.ReqState)
    .subscribe(e => {
      this.validStep = store.selectSnapshot(ReqState.validEmpreendimentoId);
      this.steps[1].enabled = this.validStep;
      this.steps[2].enabled = this.validStep;
    });
  }
  get validReqId(){
    const retorno = this.store.selectSnapshot(ReqState.validReqId);
    return retorno;
  }
  get currentStatus(){
    return this.store.selectSnapshot(ReqState.getStatus);
  }
  get getFormForStore() {
    return this.store.selectSnapshot(ReqState.getReq);
  }
  public get validForm(){
    return this.store.selectSnapshot(ReqState.validEmpreendimentoId);
  }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  public get versaoEsperada(): number{
    return this.store.selectSnapshot(ReqState.getVersaoEsperada);
  }
  public get getCode(){
    return this.store.selectSnapshot(ReqState.getNumberValue);
  }

  ngAfterViewInit(){


  }

  ionViewWillEnter(){
    this.initStep();
    // Actions
 }
  ngOnInit() {
   this.initStep();

  }
  @HostListener('unloaded')
  ngOnDestroy() {
      console.log('Cleared');
  }
  initStep(){
    this.step = 0;
    const {params} = this.route.snapshot;
    if(!!params.number){
      setTimeout(() =>{
        this.step = parseInt(params.number, 10);
      },200);

    }else{
      if(!!this.requisicaoId){
        setTimeout(()=>{
          this.step = 1;
          this.cdr.detectChanges();
        });

      }
    }
  }
  updateButton(val){
    this.hasButtonFinish = val;
  }
  updateStep(step){
    this.step = step;
  }

   setStep(event){
    const val = parseInt(event.target.value, 10);
    const hasUpdate = Object.values(this.getFormForStore).filter(e =>e).length > 0 && this.requisicaoId;
    if(hasUpdate){
      this.step = val;
    }
  }
  async onBack(): Promise<void> {
    const reqId =  !!this.requisicaoId;
    const filter = Object.values(this.getFormForStore).filter(e =>e).length > 0;
    if(this.step === 0){
      if(reqId ||filter){
        const res = await this.alertServices.alertReq(reqId,filter);
        if(res === 'confirm-exclude'){
          const {versaoEsperada} = this.getFormForStore;
          this.updateRequestStatus.deleteRequest(this.requisicaoId,versaoEsperada).then(res =>{
            this.resetForm();
            this.navCtrl.back();
          },err =>{
            this.showMsg(err?.Mensagem);
            console.log(err);
          });
        }
        else if(res === 'confirm'){
          this.resetForm();
          this.navCtrl.back();
        }
        else if(res === 'confirm-exclude'){
          this.resetForm();
          this.navCtrl.back();
        }
        else if(res === 'finish'){
          await this.openModal();
        }

      }
      else{
        this.navCtrl.back();
      }
    }else{
      this.step = this.step -1;
    }
  }
  resetForm(){
    if(this.step === 0){
      this.childComponent.reqForm.reset();
    }
    this.store.dispatch(new ResetStateReq());
  }

  public setFormForStore(formField){
    this.store.dispatch(new setReqFileds(formField));
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ModalFinishReqComponent,
      cssClass: 'modalFinishReq',
      componentProps:{
        id:this.requisicaoId,versaoEsperada:this.versaoEsperada,currentStatus:this.currentStatus
      }
    });
    await modal.present();
    modal.onDidDismiss().then(response => {
      if(!this.validForm){

        this.resetForm();
        this.step = 0;
      }
    });
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
    const {params,type} = this.getParams(form);
    this.rquestService.postReqTwo(params,type)
      .subscribe(async(res: any) => {
        const {requisicaoId,versaoEsperada} = res;
        if(type === 'POST'){
          this.setFormForStore(form);
          msg = `Requisição criada com sucesso: ${requisicaoId}`;
        }
        else{
          msg = `Requisição editada com sucesso: ${requisicaoId}`;
        }
        this.loading.dismiss();

        this.setFormForStore(form);
        await this.showMsg(msg);
        this.step = 1;
        this.sendPost = false;
      },
      async(error) =>{
        msg = error.Mensagem? error.Mensagem : error;
        console.log(error);
        await this.showMsg(msg);
        this.loading.dismiss();
        this.step = this.step;
      }
    );
  }
  updateForm(ev){
    this.sendPost = ev;
  }
  getParams(form){
    const params = Object.assign({}, form);
    const type = this.validReqId ? 'PUT' :'POST';
    for (const key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    if(this.validReqId){
      params.id = this.requisicaoId;
      params.versaoEsperada = this.versaoEsperada;
      delete params['requisicaoId'];
    }

    return {params,type};
  }
  gonew(){
    this.step = 0;
    this.step = 1;
  }
}
