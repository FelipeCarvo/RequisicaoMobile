import { Component,OnInit,ChangeDetectorRef,OnDestroy,HostListener } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd,NavigationStart } from '@angular/router';
import { Injectable } from '@angular/core';
import {RequestService} from '@services/request/request.service'
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation'
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {ResetStateReq} from '@core/store/actions/req.actions'
import { ResetStateInsumos } from '@core/store/actions/insumos.actions';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [translateAnimation(),rotateAnimation()]
})
export class homePage implements OnInit,OnDestroy{
  listReq: Array<any> = [];
  load = false;
  showFIlters:Boolean = false;
  statusRequisicao:Number = 2;
  empreendimentoDescricao:any = '';
  dataInicial = new Date(Date.now()  - 10 * 24 * 60 * 60 * 1000);
  dataFinal = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  routerEventSubscription: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private $unsubscribe: Subscription;
  constructor(
    private router:Router,
    private rquestService:RequestService,
    private store:Store,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
   ) {
  
    // this.$unsubscribe = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.observeUrlChanges);
    // this.mySubscription.unsubscribe()
   }

   get validReqId(){
    return this.store.selectSnapshot(ReqState.validReqId);
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter')
    this.getReq()
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter')
  
  }
  ngOnInit() {
    console.log('init')
    this.getReq()
    this.$unsubscribe = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.observeUrlChanges);
  }
  observeUrlChanges(event: NavigationEnd) {
    console.log('observeUrlChanges')
    try { 
      this.getReq();
    } catch (e) {}
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy')

    this.routerEventSubscription.unsubscribe();
    this.destroy$.next(true);
  }
  newRequest(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }

    this.router.navigate(['tabs/central-req/nova-req']);
    
  }
  viewAllRequest(){
    this.router.navigate(['tabs/all-request']);
    this.ngOnDestroy()
    
  }
  setParams(params){
    this.showFIlters = false;
    const {dataFim ,dataInicio , status,empreendimento} = params;
    this.dataInicial = dataInicio;
    this.dataFinal = dataFim;
    this.statusRequisicao = status;
    this.empreendimentoDescricao = empreendimento;
    // if(!!empreendimento){
    //   this.empreendimentoDescricao = empreendimento.replace(/[^0-9]/g,'');
    // }else{
    //   this.empreendimentoDescricao = '';
    // }
    setTimeout(() =>{
      this.getReq();
    },250)

  }
  convertNumber(element){
    if(!this.empreendimentoDescricao){
      return
    }
    return parseInt(element.replace(/[^0-9]/g,''))
  }
  getReq(){
    this.load = false;
    let hour = {
      hour: 24,
      minute: 0,
      second: 0,
      millisecond: 0,
    }

    const params = {
      dataInicial: moment(this.dataInicial).format(),
      dataFinal: moment(this.dataFinal).set(hour).format(),
      retificada: "Todos",
      vistada: "Todos",
      situacao: "Todas",
      statusRequisicao:this.statusRequisicao,
      filtrarComprador: true,
      exportadoConstruCompras: "Todos"
      
    }

    this.rquestService.getReq(params).subscribe((res:any) =>{
     
      setTimeout(()=>{
        this.load = true;
        this.dataInicial = new Date(this.dataInicial);
        this.dataFinal = new Date(this.dataFinal);
        let datea = moment(this.dataInicial)
        let dateb = moment(this.dataFinal)
        let dif:any = dateb.diff(datea,'days')

        let msg = `Requisições adicionadas nos ultimos ${dif} dias`
        if(!!this.empreendimentoDescricao){
          this.listReq = res.filter(el => el.empreendimento === this.convertNumber(this.empreendimentoDescricao));​
        }else{
          this.listReq = res;​
        }
      },200)
    },async(error)=>{
      this.load = true;
    })
  }
}
