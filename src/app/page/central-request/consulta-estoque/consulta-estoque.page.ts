import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import {ModalEstoqueComponent} from '@components/modal-estoque/modal-estoque.component';
import { ModalController,ToastController } from '@ionic/angular';

@Component({
    selector: 'app-consulta-estoque',
    templateUrl: './consulta-estoque.page.html',
    styleUrls: ['./consulta-estoque.page.scss'],
    standalone: false
})
export class ConsultaEstoquePage implements OnInit {
  idInsumo: string;
  insumoEstoque: any;
  listInsumos:any;
  itemSelect:{}
  initLoad:Boolean = false;
  public loadList: boolean = false;
  opcaoConsulta:String = "CentralDeEstoque";
  step:number = 0;
  filtrarComplemento:Boolean = false;
  itemEstoque:{
    itemRequisicao?:String;
    quantidadeReservada?:Number;
    quantidadeRequisitada?:Number;
  }
  constructor(
    public navCtrl:NavController,
    private requestService:RequestService,
    public loading: LoadingService,
    private route:ActivatedRoute,
    private store:Store,
    public modalController: ModalController,
    public toastController:ToastController,
    public router:Router
    ) { }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  ngOnInit() {
    const {id} = this.route.snapshot.params;
    this.initLoad = false;
    this.idInsumo = id;
    this.getEstoque()
  }
  public dismiss(): void {
    if(this.step ===1){
      this.step = 0
    }else{
      this.navCtrl.back();
    }

  }

  getEstoque(){
    this.loading.present();
    const params = {
      requisicaoId: this.requisicaoId,
      opcaoConsulta: this.opcaoConsulta
    }
    this.requestService.getEstoque(params).subscribe((res:any) =>{
     this.insumoEstoque = res.find(e => e.itemId === this.idInsumo);
     let {quantidadeReservada,quantidadeRequisitada,itemRequisicao} = this.insumoEstoque;
     this.itemEstoque = {quantidadeReservada,quantidadeRequisitada,itemRequisicao}
     this.loading.dismiss();
      setTimeout(() =>{
        this.initLoad = true;
      })
    })
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalEstoqueComponent,
      cssClass: 'modalFinishReq',
      componentProps:{
        listInsumos:this.listInsumos,
        itemSelect:this.itemSelect,
        insumoEstoque:this.insumoEstoque
      }
    });
    await modal.present();
    modal.onDidDismiss().then((res:any) => {
      if(!!res.data){
        this.itemSelect = res.data;
        this.itemEstoque.quantidadeReservada = res.data.quantidadeReservada;
        this.step = 1;
      }
      else{
        this.itemSelect = {}
      }
    });
  }
  updateEstoque(val){
    this.opcaoConsulta = val;
  }
  updateComplementoFilter(val){
  
    this.filtrarComplemento = val;
  }
  consultEstoque(){
    this.loadList = false;
    const params = {
      itemId:  this.idInsumo,
      opcaoConsulta: this.opcaoConsulta,
      filtrarComplemento: this.filtrarComplemento
    }
    this.requestService.consultaEstoqueItem(params).subscribe((res:Array<any>) =>{    
      this.listInsumos= res;​
      this.loadList = true;
      setTimeout(async()=>{
        await this.openModal();
      },200)
    })
  }
  sendEstoque(params){
    this.loading.present();
    this.requestService.sendEstoqueItem(params).subscribe(async(res:Array<any>) =>{    
      const toast = await this.toastController.create({
        message: 'Estoque adicionado',
        duration: 4000
      });
      toast.present();
      this.router.navigate(['/tabs/central-req/nova-req']);
      this.loading.dismiss();
    },async(error)=>{
      this.loading.dismiss();
      const toast = await this.toastController.create({
        message: error,
        duration: 4000
      });
      toast.present();
    })
  }

}
