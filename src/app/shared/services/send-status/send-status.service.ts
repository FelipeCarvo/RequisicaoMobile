import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
@Injectable({
    providedIn: 'root'
  })
  export class UpdateRequestStatus {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}/sieconwebsuprimentos/api/Requisicao`;

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
  }