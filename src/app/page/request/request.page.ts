import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '../../components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@store/state/req.state';
import {setReqFileds} from '@store/actions/req.actions'
import {RequestService} from '@services/request/request.service'
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  @ViewChild('appChild', {static: false}) childComponent;
  step:Number = 0;
  validStep: boolean = false;
  steps:any = [
    { key: 0, title: "Requisição",route:'/tabs/cart/step1',enabled:true},
    { key: 1, title: "Insumos",route:'/tabs/cart/step2',enabled:this.validStep},
    { key: 2, title: "Documentos",route:'/tabs/cart/step3',enabled:this.validStep},
   
  ]
  constructor(public navCtrl:NavController,public modalController: ModalController,private store:Store,private rquestService:RequestService) {
    
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
      this.sendReq(val)    
    }
  }
  public onBack(event) {
    console.log(event);
    this.navCtrl.back();
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
      // componentProps: {
      //   data: { productId: this.productId, productsBookmark: this.productsBookmark, currentUserId: this.userId }
      // }
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
         this.step = val;
       // this.load = true;
       },200)
      })
  }
  getParams(){
    let params = this.getFormForStore();
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
