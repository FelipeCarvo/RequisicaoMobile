import { Component, OnInit,Injectable ,ViewChild} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';

import { Store } from '@ngxs/store';
import {InsumoState} from '@core/store/state/inusmos.state';
import { setInsumosFileds } from '@core/store/actions/insumos.actions';
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

  }
  validReqId(){
    return this.store.selectSnapshot(InsumoState.validInsumos);
  }
  getFormForStore(){
    return this.store.selectSnapshot(InsumoState.getInsumos);
  }
  setFormForStore(formField){
    this.store.dispatch(new setInsumosFileds(formField))
  }

  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    this.router.navigate(['/central-req/consulta-estoque']);
  }
}
