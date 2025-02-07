import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {LoockupstService} from '@services/lookups/lookups.service';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {translateAnimation} from '@services/animation/custom-animation'
import {RequestService} from '@services/request/request.service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
@Component({
    selector: 'app-list-insumos',
    templateUrl: './list-insumos.page.html',
    styleUrls: ['./list-insumos.page.scss'],
    animations: [translateAnimation()],
    standalone: false
})
export class ListInsumosPage implements OnInit {
  empreendimentoId:string = null;
  load = false;
  listInsumos: Array<any>;
  constructor(
    private requestService:RequestService,
    private store:Store,
    public navCtrl:NavController,
    private route:ActivatedRoute,
    private router:Router,
  ) { 
    const {empreendimentoId}= this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
  }

  ngOnInit() {
    this.getInsumos();
  }
  getInsumos(){
    let {params} = this.route.snapshot;
    
    const newItem = {...params}
    newItem.filtrarComplemento = Boolean(params.filtrarComplemento);

    this.requestService.consultaEstoqueItem(newItem).subscribe((res:Array<any>) =>{    
      this.listInsumos= res;​

      this.load = true;
    })
  }
  dismiss(){
    this.navCtrl.back();
  }
  goToInsumoEmpreendimento(item){
    const params = item;
    this.router.navigate(['tabs/central-req/reserva-insumo',params]);
  }
}
