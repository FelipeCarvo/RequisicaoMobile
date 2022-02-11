import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '@components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds} from '@core/store/actions/req.actions'
import {RequestService} from '@services/request/request.service'
import { ToastController } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import {RouteInterceptorService} from '@services/utils/route-event';
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
  private history: string[] = []
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
    private router:Router,
    private loadingController:LoadingController,
    private routeInterceptorService: RouteInterceptorService
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
   
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

  
    return loading
  }
  async setStep(val){
    if(this.validForm()){
      if(this.sendPost){
        this.sendReq(val);       
      }else{
        const {requisicaoId} = this.getFormForStore()
       
        const test = await this.rquestService.getVersion(requisicaoId).toPromise()
        console.log(test)
        this.childComponent?.reqForm.reset();
        this.step = val;
      }         
    }
  }
  public onBack(event) {
    const {previousUrl} =this.routeInterceptorService
    if(previousUrl == '/tabs/home'){

    }
    // this.navCtrl.back();
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
  public  validForm(){
    let valid = this.store.selectSnapshot(ReqState.validEmpreendimentoId);
    return valid
  }
  async openModal(){
   
    const modal = await this.modalController.create({
      component: ModalFinishReqComponent,
      cssClass: 'modalFinishReq',
    });
    await modal.present();
  }
  async sendReq(val){
    let {params,type} = this.getParams();
    const loading = await this.presentLoading();
    if(type === 'POST'){
      delete params["versaoEsperada"];
    }
    this.rquestService.postReq(params,type).subscribe(async(response:any) =>{
      await loading.onDidDismiss();
      if(!this.validReqId()){
        this.setFormForStore({requisicaoId:response});
        
      }
      setTimeout(()=>{
        if(val !=0){
          this.childComponent?.reqForm.reset();
        }
        this.step = val;
      },200)
    },
    async(error) =>{
      await loading.onDidDismiss();
      const toast = await this.toastController.create({
        message: error,
        duration: 2000
      });
      toast.present();
    })
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
