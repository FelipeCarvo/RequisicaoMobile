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
import {map, startWith} from 'rxjs/operators';
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
    const {requisicaoId} = this.getFormForStore();
    if(!!requisicaoId){
      this.getVersion();
    }
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
   setStep(val){
    //  if(val === this.step){
    //    return;
    //  }
    if(this.validForm()){
      console.log(this.sendPost)
      if(this.sendPost){
        this.sendReq(val);       
      }else{
        this.step = val;
      }         
    }
  }
  async getVersion(){
    const {requisicaoId} = this.getFormForStore();
    if(!!requisicaoId){
      this.rquestService.getVersion(requisicaoId).subscribe(async(res) =>{
        console.log(res)
        this.setFormForStore({versaoEsperada:res});
     },async(error)=>{});
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
  public validForm(){
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
    const {requisicaoId,versaoEsperada} = this.getFormForStore();
    const loading = await this.presentLoading();
    let {params,type} = this.getParams();
    if(type === 'POST'){
      delete params["versaoEsperada"];
    }
    
    this.rquestService.postReq(params,type).pipe(
      map(x => this.getVersion())
    ).subscribe(async(response:any) =>{
      this.step = val;
      this.sendPost = false;
      if(!this.validReqId()){
        this.setFormForStore({requisicaoId:response});
       
      }
       
      setTimeout(async ()=>{
        console.log("aqui")
        await loading.onDidDismiss();  
      
      },200)
    },
    async(error) =>{
     
      const toast = await this.toastController.create({
        message: error,
        duration: 2000
      });
      toast.present();
      await loading.onDidDismiss();
      this.step = this.step;
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
