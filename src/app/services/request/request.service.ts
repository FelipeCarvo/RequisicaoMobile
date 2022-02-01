import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
export enum endPointsEnum{
  'PesquisaRequisicoes' = '/sieconwebwebapi/api/suprimentos/Requisicao/PesquisaRequisicoes',
  'RequisicaoId' ='/sieconwebsuprimentos/api/Requisicao/',
  'RelatorioRequisicao' ='/sieconwebwebapi/api/suprimentos/Requisicao/RelatorioRequisicao',
  'Empreendimentos'= '/sieconwebwebapi/api/cadastros/Lookups/Empreendimentos'
}
@Injectable({
    providedIn: 'root'
  })
  export class RequestService {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}`;
    initialParams = {
      dataInicial: "2020-01-24T17:44:21.573Z",
      dataFinal: "2022-01-24T17:44:21.573Z"
    };
    constructor(private http:HttpClient, private store:Store){}

    getReq(params = null, endPoint = 'PesquisaRequisicoes'){
      return new Observable((observer) => {
        console.log(!!params)
        if(!!params == false){
          params = this.initialParams;
        }
        this.http.post(`${this.apiUrl}${endPointsEnum[endPoint]}`,JSON.stringify(params)).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getOnlyReq(id,endPoint = 'PesquisaRequisicoes'){
      return new Observable((observer) => {
       
        this.http.get(`${this.apiUrl}${endPointsEnum[endPoint]}/${id}`).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
  }