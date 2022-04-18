import { Component, OnInit,Input } from '@angular/core';
import {translateAnimation} from '@services/animation/custom-animation'
import { ModalController } from '@ionic/angular';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-modal-estoque',
  templateUrl: './modal-estoque.component.html',
  styleUrls: ['./modal-estoque.component.scss'],
  animations: [translateAnimation()]
})
export class ModalEstoqueComponent implements OnInit {
  @Input() listInsumos:any;
  @Input() itemSelect:any;
  @Input() insumoEstoque:any ;
  constructor(
    public modalController: ModalController,
    private alertServices: AlertServices,
    private toastController:ToastController,
  ) { }
  ngOnInit(){
   
  }
  dismiss(){
    this.modalController.dismiss();
  }
  async goToInsumoEmpreendimento(item){
    let res = await this.alertServices.quantidadeRes();
    if(res <= this.insumoEstoque.quantidadeRequisitada){
      item.quantidadeReservada = parseInt(res);
      await this.modalController.dismiss(item)
    }else{
      const toast = await this.toastController.create({
        message: 'A quantidade reservada não pode ser maior que a quantidade requisitada',
        duration: 4000
      });
      toast.present();
    }
    //await this.modalController.dismiss(item)
  }

}
