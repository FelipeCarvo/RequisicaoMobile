import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {translateAnimation} from '@services/animation/custom-animation';
import {RequestService} from '@services/request/request.service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
@Component({
    selector: 'app-list-request-pesq',
    templateUrl: './list-request-pesq.page.html',
    styleUrls: ['./list-request-pesq.page.scss'],
    animations: [translateAnimation()],
    standalone: false
})
export class ListRequestFrotaPesqPage implements OnInit {
  empreendimentoId: string = null;
  nomeEmpreendimento: string = null;
  rota = '';
  load = false;
  listInsumos: Array<any>;
  qtdItens = 0;
  habilitaDev = false;
  constructor(
    private requestService: RequestService,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }
  async navInsertItens(reqId) {
    if(this.rota!=='dev') {
      this.router.navigate([`tabs/detail-request-frota/${reqId}/${this.empreendimentoId}`],
                {queryParams: {rota:this.rota}});
    } else {
      this.router.navigate([`tabs/request-dev-frota/${reqId}/${this.empreendimentoId}`],
                {queryParams: {rota:this.rota}});
    }
  }

  ngOnInit() {
    // this.getEmpreendimento();
    this.getDados();
  }
  getEmpreendimento() {
    const {params} = this.route.snapshot;
    this.requestService.consultaEstoqueItem(params.empreendimentoId).subscribe((res: Array<any>) =>{
      this.listInsumos= res;

      this.load = true;
    });
  }


  getDados(){
    const {params,queryParams} = this.route.snapshot;
    console.log(this.route.snapshot);
    console.log(params);
    console.log(queryParams);
    this.empreendimentoId = queryParams.empreendimentoId;
    this.habilitaDev = queryParams.rota === 'dev'?true:false;
    this.rota=queryParams.rota;
    const dados = this.getParams(params,queryParams);
    if (this.rota === 'req' || this.rota === 'dev'){
      this.requestService.getTermosEmpr(dados.params).subscribe((res: Array<any>) =>{
        this.listInsumos= res;
        this.qtdItens = res.length;
        this.load = true;
      });
    } else if(this.rota === 'epi'){
      this.requestService.getTermosEmprEpi(dados.params).subscribe((res: Array<any>) =>{
        this.listInsumos= res;
        this.qtdItens = res.length;
        this.load = true;
      });
    }
  }
  dismiss(){
    this.navCtrl.back();
  }

  getParams(form,queryParams){
    const paramsForm = Object.assign({}, form);
    const params = {
      empreendimentoId:queryParams.empreendimentoId,
      colaboradorId:queryParams.colaboradorId===undefined?null:queryParams.colaboradorId,
      statusId: queryParams.statusTermo===undefined?null:queryParams.statusTermo,
      dataInicio: queryParams.dataIni===undefined?null:queryParams.dataIni,
      dataFim: queryParams.dataFim===undefined?null:queryParams.dataFim,
      termoResponsabilidadeId:queryParams.termoResponsabilidadeId===undefined?null:queryParams.termoResponsabilidadeId,
      equipamentoId: queryParams.equipamentoId===undefined ? null : queryParams.equipamentoId,
      somenteComSaldoDevedor: (this.rota === 'dev' ? 1 : 0)
    };
    return {params};
  }
}
