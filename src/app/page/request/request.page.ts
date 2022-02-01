import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {ModalFinishReqComponent} from '../../components/modal-finish-req/modal-finish-req.component';
import { Store } from '@ngxs/store';
import {ReqState} from '@store/state/req.state';
import {setReqFileds} from '@store/actions/req.actions'
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
  constructor(public navCtrl:NavController,public modalController: ModalController,private store:Store) {
    
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
      const form = this.getForm();
      this.step = val;
    }
  }
  public onBack(event) {
    console.log(event);
    this.navCtrl.back();
  }
  getForm(){
    return this.store.selectSnapshot(ReqState.getReq);
  }
  public validForm(){
    return this.store.selectSnapshot(ReqState.validEmpreendimentoId);
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
}
