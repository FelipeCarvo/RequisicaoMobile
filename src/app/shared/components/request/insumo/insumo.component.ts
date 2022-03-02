import { Component, Input,Output,EventEmitter, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service';
import { LoadingController } from '@ionic/angular';
import {opacityAnimation} from '@services/animation/custom-animation'
import {InsumosRequest} from '@services/insumos/inusmo-req.service'
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss'],
  animations: [opacityAnimation()]
})
export class InsumoComponent implements OnInit {
  @Input() requisicaoId:String;
  @Input() validForm;
  @Output() updateStep:EventEmitter<any> = new EventEmitter();
  listInsumos: Array<any>;
  loading:boolean = false;
  constructor(
    public modalController: ModalController,
    public router:Router,
    private requestService:RequestService,
    private insumosRequest:InsumosRequest,
    private loadingController:LoadingController,) { }

  ngOnInit() {
    if(!!this.validForm && !!this.requisicaoId){
      this.getInsumos();
    }else{
      this.updateStep.emit(0)
    }
  }
  getInsumos(){
    this.insumosRequest.getInsumoById(this.requisicaoId).then((res:any) =>{
      this.listInsumos = res;
      setTimeout(() =>{
        this.loading = true;
      },200)
    })
  }
  presentModal(){
    if(this.validForm){
      this.router.navigate(['/tabs/central-req/insumos']);
    }
  }

}
