import { Component,Injectable ,ViewChild} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {ReqState} from '@core/store/state/req.state';
import { Store } from '@ngxs/store';
import {InsumoState} from '@core/store/state/inusmos.state';
import { SetInsumosFileds,ResetStateInsumos } from '@core/store/actions/insumos.actions';
import { AlertController } from '@ionic/angular';
import {InsumosRequest} from '@services/insumos/inusmo-req.service'
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.page.html',
  styleUrls: ['./insumos.page.scss'],
})
export class InsumosPage{
  @ViewChild('appChild', {static: false}) childComponent;

  constructor(
    public navCtrl:NavController,
    private router:Router,
    public alertController: AlertController,
    private store:Store,
    private insumosRequest:InsumosRequest
  ) { }

  ngOnInit() {
    if(!this.validReqId()){
      const {requisicaoId,versaoEsperada} = this.getRequest();
      this.setFormForStore({requisicaoId,versaoEsperada});
    
    }
  }
  validReqId(){
    return this.store.selectSnapshot(InsumoState.validInsumos);
  }
  getFormForStore(){
    return this.store.selectSnapshot(InsumoState.getInsumos);
  }
  getRequest(){
    return this.store.selectSnapshot(ReqState.getReq);
  }
  setFormForStore(formField){
    this.store.dispatch(new SetInsumosFileds(formField))
  }

  async dismiss(): Promise<void> {
   let filter = Object.values(this.getFormForStore()).filter(e =>e).length > 2;
    if(filter){
      await this.openModal()
    }else{
      this.navCtrl.back();
    }
  }
  async openModal(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert ',
      header: 'Limpar insumo',
      message: 'Você ainda não adicionou um insumo deseja mesmo voltar ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Voltar',
          cssClass: 'confirm-button',
          handler: () => {
            this.store.dispatch(new ResetStateInsumos())
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }
  public goCentralEstoque(){
    console.log(this.getFormForStore())
    this.router.navigate(['tabs/central-req/consulta-estoque']);
  }
}
