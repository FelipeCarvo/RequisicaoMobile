import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
@Injectable({
    providedIn: 'root'
  })
  export class InsumosRequest {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}/sieconwebsuprimentos/api`;

    constructor(private http:HttpClient){}

    sendNewInsumo(form:any){
      return new Promise((resolve, reject) => {
     
        this.http.post(`${this.apiUrl}/ItemRequisicao`,form).subscribe(
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