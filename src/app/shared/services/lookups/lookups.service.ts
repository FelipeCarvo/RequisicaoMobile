import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {LookupsEndPoints} from '../utils/enums/EnumLockup'

@Injectable({
    providedIn: 'root'
  })
  export class LoockupstService {
    apiUrl = `https://cors-anywhere.herokuapp.com/${environment.BASE_URL}/sieconwebwebapi/api/`;

    constructor(private http:HttpClient, private store:Store){}

    getLookUp(params = null, endPoint = 'Empreendimentos'){
      return new Promise((resolve, reject) => {
     
        this.http.post(`${this.apiUrl}${LookupsEndPoints[endPoint]}`,JSON.stringify(params)).subscribe(
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