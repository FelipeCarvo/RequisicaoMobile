import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss'],
})
export class InsumoComponent implements OnInit {
  @Input() requisicaoId:String;
  @Input()validForm;
  loading:boolean = false;
  constructor(
    public modalController: ModalController,
    public router:Router,
    private requestService:RequestService,
    private loadingController:LoadingController,) { }

  ngOnInit() {
   this.getInsumos()
  }
  getInsumos(){
    this.requestService.getInsumosById(this.requisicaoId).subscribe(res =>{
      this.loading = true;
      console.log(res)
    })
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
  presentModal(){
    if(this.validForm){
      this.router.navigate(['/tabs/central-req/insumos']);
    }
  }

}
