import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-altera-qtd-item',
  templateUrl: './modal-altera-qtd-item.page.html',
  styleUrls: ['./modal-altera-qtd-item.page.scss'],
  standalone: false
})
export class ModalAlteraQtdItemPage {
  public item: any;

  constructor(private modalController: ModalController) { }

  confirmAlterarQuantida(item,termoResponsabilidadeItemId) {
    const myDiv = document.getElementById(termoResponsabilidadeItemId) as HTMLInputElement;
    const quantidade = myDiv.value;

    this.modalController.dismiss({ confirmado: true, quantidade: quantidade });
  }

  cancel() {
    this.modalController.dismiss({ confirmado: false, quantidade: 0 });
  }

  static async PerguntaUsuario(modalCtrl: ModalController, item: any) {
    const modal = await modalCtrl.create({
      component: ModalAlteraQtdItemPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      componentProps: {
        item: item
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    let retorno = { confirmado: false, quantidade: 0 };
    if (data && data.confirmado) {
      retorno = { confirmado: true, quantidade: data.quantidade };
    }
    return retorno;
  }
}
