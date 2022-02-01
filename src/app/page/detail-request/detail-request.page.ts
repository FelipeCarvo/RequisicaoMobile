import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {opacityAnimation} from '@services/animation/custom-animation'
@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.page.html',
  styleUrls: ['./detail-request.page.scss'],
  animations: [opacityAnimation()]
})
export class DetailRequestPage implements OnInit {
  requisicaoId:string;
  reqItem:any = {}
  load = false;
  constructor(
    public navCtrl:NavController,
    private rquestService:RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
     this.requisicaoId = activatedRoute.snapshot.params.requisicaoId;
     }

  ngOnInit() {
    this.getReq(this.requisicaoId)
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  getReq(id){
    const params ={id,mostrarCancelados:true}
    this.rquestService.getReq(params,'RelatorioRequisicao').subscribe((res:any) =>{
      this.reqItem = res[0];
      let date = new Date(this.reqItem.dataHora)
      console.log(date)
      this.reqItem.dataHora = date.toLocaleDateString('PT-US',{ hour12: false,hour: "numeric", minute: "numeric"})
      console.log(this.reqItem)
      setTimeout(()=>{
        this.load = true;
      },300)
    })
  }
}
