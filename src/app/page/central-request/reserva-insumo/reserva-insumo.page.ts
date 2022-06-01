import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {RequestService} from '@services/request/request.service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-insumo',
  templateUrl: './reserva-insumo.page.html',
  styleUrls: ['./reserva-insumo.page.scss'],
})
export class ReservaInsumoPage implements OnInit {
  itemObject:{
    complemento:String
    empreendimento:Number
    empreendimentoDescricao:String
    empresa: Number
    empresaDescricao: String
    insumo: String
    insumoDescricao:String
    item:Number
    quantidadeEstoque: Number
    quantidadeReservada: Number
    reservado: Number
    ri:Number
    unidade: String
  }
  constructor(
    private requestService:RequestService,
    private store:Store,
    public navCtrl:NavController,
    private route:ActivatedRoute,
    private router:Router,
  ) { }

  ngOnInit() {
    let {params} = this.route.snapshot;
    this.itemObject ={
      complemento:params.complemento,
      empreendimento:parseInt(params.empreendimento),
      empreendimentoDescricao:params.empreendimentoDescricao,
      empresa:parseInt(params.empresa),
      empresaDescricao:params.empresaDescricao,
      insumo:params.insumo,
      insumoDescricao:params.insumoDescricao,
      item:parseInt(params.item),
      quantidadeEstoque:parseFloat(params.quantidadeEstoque),
      quantidadeReservada: parseFloat(params.quantidadeReservada),
      reservado: parseFloat(params.reservado),
      ri: parseFloat(params.ri),
      unidade: params.unidade
    }
  }
  dismiss(){
    this.navCtrl.back();
  }

}
