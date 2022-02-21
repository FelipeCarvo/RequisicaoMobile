import { Component, OnInit,Injectable ,ViewChild,Input} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';
import {ReqState} from '@core/store/state/req.state';
import { Store } from '@ngxs/store';
import {InsumoState} from '@core/store/state/inusmos.state';
import { SetInsumosFileds } from '@core/store/actions/insumos.actions';
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
    private loockupstService:LoockupstService,
    public navCtrl:NavController,
    private router:Router,

    private store:Store
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

  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    console.log(this.getFormForStore())
    this.router.navigate(['tabs/central-req/consulta-estoque']);
  }
}
