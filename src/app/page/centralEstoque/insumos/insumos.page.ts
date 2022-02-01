import { Component, OnInit,Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {LoockupstService} from '@services/lookups/lookups.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.page.html',
  styleUrls: ['./insumos.page.scss'],
})
export class InsumosPage{
  public reqForm: FormGroup;
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsInsumos:null
  };
  obj = {
    "requisicaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "empresaId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "etapaId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "planoContasId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "servicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "insumoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "quantidade": 0,
    "prazo": 0,
    "prazoDevolucao": "2022-02-01T11:24:54.596Z",
    "insumoSubstituicaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "complemento": "string",
    "estoque": true,
    "blocoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "unidadeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "observacoes": "string",
    "ordemServicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "equipamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "versaoEsperada": 0,
    "gerarAtivoImobilizado": true
  }
  constructor(public navCtrl:NavController, private router:Router,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.reqForm = this.formBuilder.group({
      empresaId:  new FormControl('', [Validators.required]),
      planoContasId:[null],
      servicoId: [null],
      insumoId:[null],
      blocoId:[null],
      unidadeId:[null]
    });
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    this.router.navigate(['/central-estoque/consulta-estoque']);
  }
}
