import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {RequestService} from '@services/request/request.service'
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation'
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [translateAnimation(),rotateAnimation()]
})
export class homePage {
  listReq: Array<any> = [];
  load = false;
  showFIlters:Boolean = false;
  statusRequisicao:Number = 2;
  empreendimentoDescricao:any = '';
  dataInicial = new Date(Date.now()  - 10 * 24 * 60 * 60 * 1000);
  dataFinal = new Date(Date.now());
  constructor(
    private router:Router,
    private rquestService:RequestService,
   ) {}
   ionViewWillEnter(){
    this.getReq()
  }
  ngOnInit() {
   
  }

  newRequest(){
    this.router.navigate(['/tabs/central-req/nova-req']);
  }
  viewAllRequest(){
    this.router.navigate(['/tabs/all-request']);
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
    const params = {
      dataInicial: moment(this.dataInicial).format(),
      dataFinal: moment(this.dataFinal).set("hour", 24).format(),
      retificada: "Todos",
      vistada: "Todos",
      situacao: "Todas",
      statusRequisicao:this.statusRequisicao,
      filtrarComprador: true,
      exportadoConstruCompras: "Todos"
      
    }
    console.log(moment(this.dataFinal).format())
    this.rquestService.getReq(params).subscribe((res:any) =>{
      if(!!this.empreendimentoDescricao){
        this.listReq = res.filter(el => el.empreendimento === this.convertNumber(this.empreendimentoDescricao));​
      }else{
        this.listReq = res;​
      }
      setTimeout(()=>{
        this.load = true;
        this.dataInicial = new Date(this.dataInicial);
        this.dataFinal = new Date(this.dataFinal);
        let datea = moment(this.dataInicial)
        let dateb = moment(this.dataFinal)
        let dif:any = dateb.diff(datea,'days')
        let msg = `Requisições adicionadas nos ultimos ${dif} dias`
      },200)
    },async(error)=>{
      this.load = true;
    })
  }
}
