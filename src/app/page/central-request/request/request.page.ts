import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '@components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds,ResetStateReq} from '@core/store/actions/req.actions'
import {RequestService} from '@services/request/request.service'
import { ToastController } from '@ionic/angular';
import {tap,switchMap} from 'rxjs/operators';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import {UpdateRequestStatus} from '@services/send-status/send-status.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  @ViewChild('appChild', {static: false}) childComponent;
  step:Number = 0;
  validStep: boolean = false;
  sendPost:boolean = false;
  requisicaoId:string = null;
  versaoEsperada:number = null;;
  steps:any = [
    { key: 0, title: "Requisição",enabled:true},
    { key: 1, title: "Insumos",enabled:this.validStep},
    { key: 2, title: "Documentos",enabled:this.validStep},
   
  ]
  constructor(
    public navCtrl:NavController,
    public modalController: ModalController,
    private store:Store,
    private rquestService:RequestService,
    private toastController:ToastController,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private updateRequestStatus: UpdateRequestStatus,

  ) {  

    this.store
    .select(state => state.ReqState)
    .subscribe(e => {
      this.validStep = store.selectSnapshot(ReqState.validEmpreendimentoId);
      this.steps[1].enabled = this.validStep;
      this.steps[2].enabled = this.validStep;
    });
   }
  ngOnInit() {
    const {requisicaoId,versaoEsperada} = this.getFormForStore();
    this.requisicaoId = requisicaoId;
    this.versaoEsperada = versaoEsperada;
    if(!!this.requisicaoId){
      this.getVersion();
    }
  }
  updateStep(step){
    console.log("update step",step)
    this.step = step;
  }
   setStep(val){
    const hasUpdate = Object.values(this.getFormForStore()).filter(e =>e).length > 0 && !this.requisicaoId;
    if(this.validForm()){
      if(this.sendPost || hasUpdate){
        this.sendReq(val);       
      }else{
        this.step = val;
      }         
    }
  }
  async getVersion(){
    if(!!this.requisicaoId){
      this.rquestService.getVersion(this.requisicaoId).subscribe(async(res:any) =>{ 
        this.setFormForStore({versaoEsperada:res});
        if(this.versaoEsperada !== res){
          this.versaoEsperada = res;
        }
     },async(error)=>{});
    }
  }

  async onBack():Promise<void> {
    const reqId =  !!this.requisicaoId;
    const filter = Object.values(this.getFormForStore()).filter(e =>e).length > 0;
    if(reqId ||filter){
      const res = await this.alertServices.alertReq(reqId,filter);
      if(res === 'confirm-exclude'){
        const {versaoEsperada} = this.getFormForStore();
        this.updateRequestStatus.deleteRequest(this.requisicaoId,versaoEsperada).then(res =>{
          this.resetForm();
          this.navCtrl.back();  
        },err =>{
          console.log(err)
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
        await this.getVersion();
        await this.openModal();
      }
     
    }
    else{
      this.navCtrl.back();
    }
  }
  resetForm(){
    this.childComponent.reqForm.reset();
    this.store.dispatch(new ResetStateReq());
  }
  validReqId(){
    return this.store.selectSnapshot(ReqState.validReqId);
  }
  getFormForStore(){
    return this.store.selectSnapshot(ReqState.getReq);
  }
  setFormForStore(formField){
    this.store.dispatch(new setReqFileds(formField))
  }
  public validForm(){
    return this.store.selectSnapshot(ReqState.validEmpreendimentoId);
  }
  async openModal(){
 
    const modal = await this.modalController.create({
      component: ModalFinishReqComponent,
      cssClass: 'modalFinishReq',
      componentProps:{
        id:this.requisicaoId,versaoEsperada:this.versaoEsperada
      }
    });
    await modal.present();
  }
  async sendReq(val){
    this.loading.present();
    let {params,type} = this.getParams();
    if(type === 'POST'){
      delete params["versaoEsperada"];
    }
    this.rquestService.postReq(params,type).pipe(
      tap((response:any) => {
        if(!this.requisicaoId || response){
          this.requisicaoId = response;
          this.setFormForStore({requisicaoId:response});
        }
      
      }),
      switchMap((id) => {
        let reqId = !!id ? id : this.requisicaoId; 
        return this.rquestService.getVersion(reqId)
      }))
      .subscribe(async(result:any) =>{
        this.loading.dismiss();
        this.setFormForStore({versaoEsperada:result});
        this.step = val;
        
        this.sendPost = false;  
      },
      async(error) =>{
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
        this.loading.dismiss();
        this.step = this.step;
      }
    )
  }
  UpdateForm(ev){
    this.sendPost = ev
  }
  getParams(){
    let params = Object.assign({}, this.getFormForStore());
    let type = this.validReqId() ? "PUT" :"POST";
    for (const key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    if(this.validReqId()){
      params["id"] = params["requisicaoId"];
      delete params["requisicaoId"];
    }
    return {params,type}
  }
}
