import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
export enum endPointsEnum{
  'empreendimentoId'= 'cadastros/Lookups/Empreendimentos',
  'motivoId' = 'suprimentos/Lookups/Motivos',
  'OFsDescontoMaterial'= 'suprimentos/Lookups/OFsDescontoMaterial',
  'aprovador'='cadastros/Lookups/Usuarios',
  'empresaId' = 'cadastros/Lookups/Empresas',
  'planoContasId' = 'cadastros/Lookups/PlanoContas',
  'servicoId' ='contratoservicos/Lookups/Servicos',
  'insumoId'='suprimentos/Lookups/Insumos',
  'blocoId' = 'cadastros/Lookups/Blocos',
  'unidadeId'= 'cadastros/Lookups/Unidades',
  'etapaId' = 'orcamentos/Lookups/Etapas',

}
@Injectable({
    providedIn: 'root'
  })
  export class LoockupstService {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}/sieconwebwebapi/api/`;

    constructor(private http:HttpClient, private store:Store){}

    getLookUp(params = null, endPoint = 'Empreendimentos'){
      return new Promise((resolve, reject) => {
     
        this.http.post(`${this.apiUrl}${endPointsEnum[endPoint]}`,JSON.stringify(params)).subscribe(
          async(res:any) => {
            resolve(res.resultado);
          },
          error => {
            console.log(error)
           reject(error);
          }
        )
      })
    }
  }