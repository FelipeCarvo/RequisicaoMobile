import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '@components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds,ResetStateReq} from '@core/store/actions/req.actions'
import {RequestService} from '@services/request/request.service'
import { ToastController } from '@ionic/angular';
import {Router } from '@angular/router';
import {map,tap,switchMap} from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import {RouteInterceptorService} from '@services/utils/route-event';
import {LoadingService} from '@services/loading/loading-service';
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
    private routeInterceptorService: RouteInterceptorService,
    public loading: LoadingService,
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
    this.requisicaoId = requisicaoId;
    if(!!this.requisicaoId){
      this.getVersion();
    }
  }

   setStep(val){
    if(this.validForm()){
      if(this.sendPost){
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
    return this.store.selectSnapshot(ReqState.validEmpreendimentoId);
  }
  async openModal(){
    const modal = await this.modalController.create({
      component: ModalFinishReqComponent,
      cssClass: 'modalFinishReq',
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
        console.log('1')
        this.requisicaoId = response;
        this.setFormForStore({requisicaoId:response});
      }),
      switchMap((id) => {
        console.log('2')
        return this.rquestService.getVersion(id)
      }))
      .subscribe(async(result:any) =>{
        console.log('3')
        console.log(result)
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
