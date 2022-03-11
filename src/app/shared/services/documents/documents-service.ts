import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
export default class DocumentService{
  sieconwebsuprimentos = `${environment.sieconwebsuprimentos}`;
  sieconwebwebapi = `${environment.sieconwebwebapi}`;
  constructor(private http:HttpClient,private store:Store,){

  }
  sendDocument(file){
    return new Promise((resolve, reject) => {
      this.http.post(`${this.sieconwebsuprimentos}/ItemRequisicao`,file).subscribe(
        async(res:any) => {
          resolve(res.resultado);
        },
        error => {
          let errorMsg:string = ''
          const {camposComErro,Mensagem} = error;
          console.log(error)
          if(!!camposComErro && !Mensagem){
            camposComErro.forEach((el,i) =>{
              let msg = el.mensagem;
              errorMsg = errorMsg + `${msg}${ i < camposComErro.length - 1 ? ',':''} `;
            })
          }
          else{
            errorMsg = Mensagem;
          }
          reject(errorMsg);
        }
      )
    })
  }
}