import { Component} from '@angular/core';
import { Router} from '@angular/router';
import { Injectable } from '@angular/core';
import {RequestService} from '@services/request/request.service';
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {ResetStateReq} from '@core/store/actions/req.actions';
import { ResetStateInsumos } from '@core/store/actions/insumos.actions';

import { formatISO, setHours, setMinutes, setSeconds } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    animations: [translateAnimation(), rotateAnimation()],
    standalone: false
})
export class homePage {


  listReq: Array<any> = [];
  load = false;
  showFIlters = false;
  statusRequisicao = 2;
  empreendimento: '';
  dataInicial = new Date(Date.now()  - 10 * 24 * 60 * 60 * 1000);
  dataFinal = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  constructor(
    private router: Router,
    private rquestService: RequestService,
    private store: Store,

   ) {
   }
   ngAfterViewInit() {
  }
  // Helper functions
   get validReqId(){
    return this.store.selectSnapshot(ReqState.validReqId);
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    this.getReq();
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter');

  }
  ngOnInit() {
    console.log('ngOnInit');
    // this.getReq()
  }

  newRequest(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req']);

  }
  newRequestFrota(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req']);

  }
  newRequestFrotaBt(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req-frota']);
  }
  viewAllRequest(){
    this.router.navigate(['tabs/all-request']);
  }
  setParams(params){
    this.showFIlters = false;
    const {dataFim ,dataInicio , status,empreendimento} = params;
    this.dataInicial = dataInicio;
    this.dataFinal = dataFim;
    this.statusRequisicao = status;
    this.empreendimento = empreendimento;
    setTimeout(() =>{
      this.getReq();
    },250);

  }
  getReq(){
    this.load = false;

    let data = this.dataFinal;
    data = setHours(data, 23);
    data = setMinutes(data, 59);
    data = setSeconds(data, 59);

    const params = {
      dataInicial: formatISO(this.dataInicial, { representation: 'date' }),
      dataFinal: formatISO(data),
      retificada: 'Todos',
      vistada: 'Todos',
      situacao: 'Todas',
      comTodosOsItensCancelados:true,
      statusRequisicao:this.statusRequisicao,
      filtrarComprador: false,
      exportadoConstruCompras: 'Todos',
      empreendimentoId: this.empreendimento

    };

    this.rquestService.getReq(params).subscribe((res: any) =>{
      this.load = true;
      this.listReq = res;
    },async (error)=>{
      console.log(error);
      this.load = true;
    });
  }
}
