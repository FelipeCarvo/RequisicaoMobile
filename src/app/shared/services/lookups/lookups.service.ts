import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {LookupsEndPoints} from '../utils/enums/EnumLockup'

@Injectable({
    providedIn: 'root'
  })
  export class LoockupstService {
    sieconwebwebapi = `${environment.sieconwebwebapi}`;

    constructor(private http:HttpClient, private store:Store){}
    filterLockup(el){
      el = el.split(" ")[0];
      el = el.replace(/[^0-9]/g,'');
      return parseInt(el);
    }
    getLookUp(params = null, endPoint = 'Empreendimentos'){
      return new Promise((resolve, reject) => {
     
        this.http.post(`${this.sieconwebwebapi}${LookupsEndPoints[endPoint]}`,JSON.stringify(params)).subscribe(
          async(res:any) => {
            let result = res
            resolve(result);
          },
          error => {
            console.log(error)
           reject(error);
          }
        )
      })
    }
  }