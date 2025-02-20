import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-exclui-req-dev',
  templateUrl: './modal-exclui-req-dev.page.html',
  styleUrls: ['./modal-exclui-req-dev.page.scss'],
  standalone: false
})
export class ModalExcluiReqDevPage {
  public mensagem: string;

  constructor(private modalController: ModalController) { }


  confirm() {
    this.modalController.dismiss({ confirmado: true });
  }

  cancel() {
    this.modalController.dismiss({ confirmado: false });
  }

  static async PerguntaUsuario(modalCtrl: ModalController, mensagem: string) {
    const modal = await modalCtrl.create({
      component: ModalExcluiReqDevPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      componentProps: {
        mensagem: mensagem
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    return (data && data.confirmado) ;
  }
}
