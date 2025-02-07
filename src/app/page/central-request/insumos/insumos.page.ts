import { Component,Injectable ,ViewChild} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {ReqState} from '@core/store/state/req.state';
import { Store } from '@ngxs/store';
import {InsumoState} from '@core/store/state/inusmos.state';
import { SetInsumosFileds,ResetStateInsumos } from '@core/store/actions/insumos.actions';
import { AlertController } from '@ionic/angular';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';

@Injectable({
  providedIn: 'root'
})
@Component({
    selector: 'app-insumos',
    templateUrl: './insumos.page.html',
    styleUrls: ['./insumos.page.scss'],
    standalone: false
})
export class InsumosPage{
  @ViewChild('appChild', {static: false}) childComponent;
  constructor(
    public navCtrl:NavController,
    private router:Router,
    private alertServices: AlertServices,
    private store:Store,
  ) { 

  }
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
   let obj = await this.getFormForStore();
   let filter = Object.values(obj).filter(e =>e).length > 3;
    if(filter){
      await this.openModal()
    }else{
      this.navCtrl.back();
    }
  }
  async openModal(){
    await this.alertServices.alertInsumos().then(res =>{
      if(res === 'confirm'){
       this.resetAndBack();
      }
    });
  }
  public onlyReset():void{
    this.store.dispatch(new ResetStateInsumos())
  }
  public resetAndBack():void{
    this.store.dispatch(new ResetStateInsumos())
    
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    const {insumoId} = this.getFormForStore();
    let url = 'list-insumos'
   
    if(!!insumoId){
     url = 'consulta-estoque'
    }
    this.router.navigate([`tabs/central-req/${url}?number:3`]);
  }
}
