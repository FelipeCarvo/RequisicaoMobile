import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlertServices {
  constructor(private alertCtrl: AlertController) {}
  private getButton(reqId,filter){
    const buttons:Array<any> = [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'cancel-button',
      }, 
    ]
    if(filter){
      buttons.push({
        text: 'Limpar',
        role: 'confirm',
        cssClass: 'confirm-button',
      })
    }
    if(reqId){
      buttons.push({
        text: 'Limpar e excluir',
        role: 'confirm-exclude',
        cssClass: 'cancel-button'
      })
    }
    return buttons
  }
  public async alertReq(reqId,filter): Promise<any>{
    const buttons = this.getButton(reqId,filter);
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert ',
      header: 'Limpar requisição',
      message: 'Você ainda não criou uma requisição deseja mesmo voltar ?',
      buttons
    })
    await alert.present();
    const {role} = await alert.onDidDismiss();
    return role
  }
  public async alertInsumos():Promise<any> {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert ',
      header: 'Limpar insumo',
      message: 'Você ainda não adicionou um insumo deseja mesmo voltar ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        }, 
        {
          text: 'Voltar',
          role: 'confirm',
          cssClass: 'confirm-button'
        }
      ]
    });
    await alert.present();
  }
  public async presentSucess(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: ``,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

  }
  public async presentFailedAlert(msg: string, header?: string, subHeader?: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: `Oops`,
      subHeader,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
