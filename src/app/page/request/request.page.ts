import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  step = 0;
  steps:any = [
    { key: 0, title: "Requisição",route:'/tabs/cart/step1',enabled:true},
    { key: 1, title: "Insumos",route:'/tabs/cart/step2',enabled:true},
    { key: 2, title: "Documentos",route:'/tabs/cart/step3',enabled:true},
   
  ]
  constructor(public navCtrl:NavController) { }

  ngOnInit() {
  }
  setStep(val){
    this.step = val
  }
  public onBack(event) {
    console.log(event);
    this.navCtrl.back();
  }
}
