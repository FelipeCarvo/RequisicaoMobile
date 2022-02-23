import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import {RequestsEndPoints} from '../utils/enums/EnumRequest'
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
        this.http.post(`${this.apiUrl}${RequestsEndPoints[endPoint]}`,params).subscribe(
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
    getVersion(id = null, endPoint = 'GetVersion'){
      return new Observable((observer) => {
        this.http.get(`${this.apiUrl}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
          async(res:any) => {
            observer.next(res.resultado.version);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getInsumosById(id = null, endPoint = 'getIsumosId'){
      return new Observable((observer) => {
        this.http.get(`${this.apiUrl}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
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
    postReq(params , type){
      const url = `${this.apiUrl}${RequestsEndPoints['RequisicaoId']}`
      let req = type == 'POST' ? this.http.post(url,params) : this.http.put(url,params);
      return new Observable((observer) => {
        req.subscribe(
          async(res:any) => {
            console.log(res)
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
      return dateA < dateB ? 1 : -1;  
    }
  }