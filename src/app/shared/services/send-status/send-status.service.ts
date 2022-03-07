import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
@Injectable({
    providedIn: 'root'
  })
  export class UpdateRequestStatus {
    apiUrl = `${environment.sieconwebsuprimentos}/Requisicao`;

    constructor(private http:HttpClient){}

    deleteRequest(id:string,versaoEsperada:Number){
      return new Promise((resolve, reject) => {
     
        this.http.delete(`${this.apiUrl}/${id}/${versaoEsperada}`).subscribe(
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
    reprovarReq(id:string,versaoEsperada:Number){
      const params = {
        id,versaoEsperada
      }
      return new Promise((resolve, reject) => {
     
        this.http.put(`${this.apiUrl}/Reprovar`,params).subscribe(
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
    sendReq(url: string, params:any = {}){

      return new Promise((resolve, reject) => {
     
        this.http.put(`${this.apiUrl}${url}`,params).subscribe(
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