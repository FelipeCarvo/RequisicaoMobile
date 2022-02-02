import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service'
import {opacityAnimation} from '@services/animation/custom-animation'
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [opacityAnimation()]
})
export class homePage {
  listReq: Array<any>;
  load = false;
  constructor(private router:Router,private rquestService:RequestService) {}
  ngOnInit() {
   this.getReq()
  }
  newRequest(){
    this.router.navigate(['/tabs/request']);
  }
  viewAllRequest(){
    this.router.navigate(['/tabs/all-request']);
  }
  getReq(){
    const currentDatecurrentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    const beforeDay = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    console.log(moment(currentDatecurrentDate).format())
    const params = {
      dataInicial: moment(beforeDay).format(),
      dataFinal: moment(currentDatecurrentDate).format(),
      retificada: "Todos",
      vistada: "Todos",
      situacao: "Todas",
      filtrarComprador: true,
      exportadoConstruCompras: "Todos"
    }
    this.rquestService.getReq(params).subscribe((res:any) =>{
      this.listReq = res;​
      setTimeout(()=>{
        this.load = true;
      },200)
    })
  }
}
