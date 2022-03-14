import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {RequestService} from '@services/request/request.service'
import {opacityAnimation} from '@services/animation/custom-animation'
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [opacityAnimation()]
})
export class homePage {
  listReq: Array<any>;
  load = false;
  showFIlters:Boolean = false;
  statusRequisicao:Number = 2;
  dataInicial = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  dataFInal = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  filterStatus = [
    {status:'Reprovada',id:1},
    {status:'Não Concluída',id:2},
    {status:'Em Aprovação',id:3},
    {status:'Aprovada para Cotação',id:4},
    {status:'Aprovada para OF',id:5},
    {status:'Cancelada',id:6},
    {status:'Aprovação Cancelada',id:7},
    {status:'Aprovada para OF Transferência',id:8},
    {status:'Aprovada para BT',id:9}
  ]
  constructor(
    private router:Router,
    private rquestService:RequestService,
   ) {}
   ionViewWillEnter(){
    this.getReq()
  }
  ngOnInit() {

  }
  selectedTextOption() {
    
    return this.filterStatus.filter(option => option.id == this.statusRequisicao)[0]?.status
  }
  newRequest(){
    this.router.navigate(['/tabs/central-req/nova-req']);
  }
  viewAllRequest(){
    this.router.navigate(['/tabs/all-request']);
  }
  getReq(){
    const currentDatecurrentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    const beforeDay = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    const params = {
      dataInicial: moment(beforeDay).format(),
      dataFinal: moment(currentDatecurrentDate).format(),
      retificada: "Todos",
      vistada: "Todos",
      situacao: "Todas",
      statusRequisicao:2,
      filtrarComprador: true,
      exportadoConstruCompras: "Todos"
      
    }
    this.rquestService.getReq(params).subscribe((res:any) =>{
      this.listReq = res;​
      setTimeout(()=>{
        this.load = true;
      },200)
    },async(error)=>{
      this.load = true;
      console.log(error)
    })
  }
}
