import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {LookupsEndPoints} from '../utils/enums/EnumLockup';
import { Observable,} from 'rxjs';
import { AuthUser } from '@core/store/state/auth.state';
  @Injectable({
    providedIn: 'root'
  })
  export class LoockupstService {
    sieconwebwebapi = `${environment.sieconwebwebapi}`;
    constructor(private http:HttpClient, private store:Store,){
      // this.sieconwebsuprimentos = this.getUrlParams.urlAPISuprimentos;
      this.sieconwebwebapi = this.getUrlParams.urlAPISP7;
    }
    filterLockup(el){
      el = el.split(' ')[0];
      el = el.replace(/[^0-9]/g,'');
      return parseInt(el);
    }
    public get getUrlParams(){
      return this.store.selectSnapshot(AuthUser.geturlParams);
    }


    getLookUp(params = null, endPoint = 'Empreendimentos') {
      return new Promise((resolve, reject) => {
        this.buscaDados(params, endPoint).subscribe(
          async (res: any) => {
            const result = res;
            resolve(result);
          },
          error => {
            console.log(error);
            reject(error);
          }
        );
      });
    }

    getLookUpOb(params = null, endPoint = 'Empreendimentos'): Observable<any> {
      return new Observable((observer) => {
        this.buscaDados(params, endPoint).subscribe(
          async (res: any) => {
            observer.next(res);
          },
          error => {
            console.log(error);
            observer.error(error);
          },
          () => {
            observer.complete();
          }
        );
      });
    }

    private buscaDados(params = null, endPoint = 'Empreendimentos') {
      console.log('buscaDados: ' + endPoint);
      if(endPoint === 'colaboradorCod') {
        params.tipoPessoa = 'Funcionário';
        params.somenteFiliaisDoSelecionado = false;
      }
      console.log(params);
      return this.http.post(`${this.sieconwebwebapi}${LookupsEndPoints[endPoint]}`, JSON.stringify(params));
    }
  }
