import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {LoockupstService} from '@services/lookups/lookups.service';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {opacityAnimation} from '@services/animation/custom-animation'
@Component({
  selector: 'app-list-insumos',
  templateUrl: './list-insumos.page.html',
  styleUrls: ['./list-insumos.page.scss'],
  animations: [opacityAnimation()]
})
export class ListInsumosPage implements OnInit {
  empreendimentoId:string = null;
  load = false;
  listInsumos: Array<any>;
  constructor(
    private loockupstService:LoockupstService,
    private store:Store,
    public navCtrl:NavController,
  ) { 
    const {empreendimentoId}= this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
  }

  ngOnInit() {
    this.getInsumos();
  }
  getInsumos(){
    const params = {
      empreendimentoId: this.empreendimentoId,
      calcularQuantidade: true,
      // somenteInsumosDaEtapa: true,
    }
    this.loockupstService.getLookUp(params,'insumoId').then((res:Array<any>) =>{
      this.listInsumos= res;​
        this.load = true;
      
    });
  }
  dismiss(){
    this.navCtrl.back();
  }
}
