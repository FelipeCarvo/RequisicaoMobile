import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '@components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds} from '@core/store/actions/req.actions'
import {RequestService} from '@services/request/request.service'
import { ToastController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
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
    private router:Router
  ) {  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
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
  setStep(val){
    if(this.validForm()){
      if(this.sendPost){
        this.sendReq(val);       
      }else{
        
          this.childComponent?.reqForm.reset();
       
        this.step = val;
      }         
    }
  }
  public onBack(event) {
    this.history.pop()
    console.log(this.history);
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
  sendReq(val){
    let {params,type} = this.getParams();
    this.rquestService.postReq(params,type).subscribe((res:any) =>{
      if(!this.validReqId()){
        this.setFormForStore({requisicaoId:res});
      }
      setTimeout(()=>{
        if(val !=0){
          this.childComponent?.reqForm.reset();
        }
        this.step = val;
      },200)
    },
    async(error) =>{
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
