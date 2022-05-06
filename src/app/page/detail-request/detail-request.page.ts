import { Component, OnInit,OnDestroy  } from '@angular/core';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {translateAnimation} from '@services/animation/custom-animation';
import {LoadingService} from '@services/loading/loading-service';
import {Subject } from 'rxjs';
@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.page.html',
  styleUrls: ['./detail-request.page.scss'],
  animations: [translateAnimation()]
})
export class DetailRequestPage implements OnInit,OnDestroy {
  requisicaoId:string;
  reqItem:any = {}
  load:Boolean = false;
  loadButton:boolean = false;
  public unsubscribe$ = new Subject();
  constructor(
    public navCtrl:NavController,
    private rquestService:RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loading: LoadingService,
    ) {
     this.requisicaoId = activatedRoute.snapshot.params.requisicaoId;
     }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.loadButton = false;
    this.getReq(this.requisicaoId)
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
  public dismiss(): void {
    // console.log(this.navCtrl)
    this.navCtrl.back();
  }
  getReq(id){
    const params ={id,mostrarCancelados:true}
    this.rquestService.getReq(params,'RelatorioRequisicao').subscribe((res:any) =>{
      this.reqItem = res[0];
      let date = new Date(this.reqItem.dataHora)
      if(this.reqItem.itens.length == 1) {
        this.reqItem.itens = this.reqItem.itens.filter(itens => itens.id !=="00000000-0000-0000-0000-000000000000")
      }
      console.log(this.reqItem.itens.length)
      this.reqItem.dataHora = date.toLocaleDateString('PT-US',{ hour12: false,hour: "numeric", minute: "numeric"})
      setTimeout(()=>{
        this.load = true;
      },300)
    })
  }
  editReq(){
    this.loadButton = true;
    this.loading.present();
    this.rquestService.getCurrentReq(this.requisicaoId).subscribe((res:any) =>{
      this.router.navigate(['/tabs/central-req/nova-req']);
      this.loading.dismiss();
      this.loadButton = false;
    },async(error) =>{
      this.loading.dismiss();
      this.loadButton = false;
    })
  }
}
