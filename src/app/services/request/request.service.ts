import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
export enum endPointsEnum{
  'PesquisaRequisicoes' = '/sieconwebwebapi/api/suprimentos/Requisicao/PesquisaRequisicoes',
  'RequisicaoId' ='/sieconwebsuprimentos/api/Requisicao',
  'RelatorioRequisicao' ='/sieconwebwebapi/api/suprimentos/Requisicao/RelatorioRequisicao',
  'Empreendimentos'= '/sieconwebwebapi/api/cadastros/Lookups/Empreendimentos',
  'newReq' = 'sieconwebwebapi/api/suprimentos/Requisicao/NovaRequisicaoCriada',
  'UpateReq' = 'sieconwebwebapi/api/suprimentos/Requisicao/RequisicaoAtualizada'
}
@Injectable({
    providedIn: 'root'
  })
  export class RequestService {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}`;
    constructor(private http:HttpClient, private store:Store){}
    getInitialParams(){
      const currentDatecurrentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      const beforeDay = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      return {
        dataInicial: moment(beforeDay).format(),
        dataFinal: moment(currentDatecurrentDate).format(),
        retificada: "Todos",
        vistada: "Todos",
        situacao: "Todas",
        filtrarComprador: true,
        exportadoConstruCompras: "Todos"
      }
    }
    getReq(params = null, endPoint = 'PesquisaRequisicoes'){
      return new Observable((observer) => {
        if(!!params == false){
          params = this.getInitialParams();
        }
        this.http.post(`${this.apiUrl}${endPointsEnum[endPoint]}`,params).subscribe(
          async(res:any) => {
            observer.next(res.resultado.sort(this.sortFunction));
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    postReq(params , type){
      const url = `${this.apiUrl}${endPointsEnum['RequisicaoId']}`
      let req = type == 'POST' ? this.http.post(url,params) : this.http.put(url,params);
      return new Observable((observer) => {
        req.subscribe(
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
    sortFunction(a,b){  
      let dateA = new Date(a.dataHora).getTime();
      let dateB = new Date(b.dataHora).getTime();
      console.log(dateA,dateB)
      return dateA < dateB ? 1 : -1;  
    }
  }