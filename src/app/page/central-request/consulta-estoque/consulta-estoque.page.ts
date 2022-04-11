import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-consulta-estoque',
  templateUrl: './consulta-estoque.page.html',
  styleUrls: ['./consulta-estoque.page.scss'],
})
export class ConsultaEstoquePage implements OnInit {
  idInsumo: string;
  insumoEstoque: {};
  constructor(
    public navCtrl:NavController,
    private requestService:RequestService,
    public loading: LoadingService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private store:Store,
    private toastController:ToastController,
    ) { }
  centralEstoque:boolean = true;
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  ngOnInit() {
    const {id} = this.route.snapshot.params;
    this.idInsumo = id;
    this.getEstoque()
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  setEstoque(estoque:boolean){
    this.centralEstoque = estoque;
  }
  getEstoque(){
    this.loading.present();
    const params = {
      requisicaoId: this.requisicaoId,
      opcaoConsulta: "CentralDeEstoque"
    }
    this.requestService.getEstoque(params).subscribe((res:any) =>{
     this.insumoEstoque = res.find(e => e.itemId === this.idInsumo);
     console.log(this.insumoEstoque)
     this.loading.dismiss();
    })
  }

}
