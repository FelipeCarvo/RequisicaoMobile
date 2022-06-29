import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {setAuthData,setAuthUrl} from '@core/store/actions/auth.actions'

import { AuthUser } from '@core/store/state/auth.state';
@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
    constructor(private http:HttpClient, private store:Store){}
    login(obj){
      let {grantTypeLogin,client_id,scope} = environment;
      let body = `username=${obj.userName}&password=${obj.password}&grant_type=${grantTypeLogin}&scope=${scope} offline_access&client_id=${client_id}`
      
      let newUrl = this.store.selectSnapshot(AuthUser.geturlLogin);

      return new Observable((observer) => {
        this.http.post(`${newUrl}/connect/token`,body).subscribe(
          async(res:any) => {
            const {access_token,refresh_token} = res;
            const userName =  obj.userName;
            const authData = {
              token:access_token,
              refreshToken:refresh_token,
              userName
            }
            await this.store.dispatch(new setAuthData(authData));
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    getConfig(params){
      return new Observable((observer) => {
        this.http.get(`${environment.BASE_URL}/clientespoliviewapi/api/BuscaConfiguracao/${params}`).subscribe(
          async(res:any) => {
            const {itens} = res;
            let urlLogin = itens.find(item => item.nome == 'urlLogin').valor;
            let urlAPISuprimentos = itens.find(item => item.nome == 'urlAPISuprimentos').valor;
            let urlAPISP7 = itens.find(item => item.nome == 'urlAPISP7').valor;
            let data = {urlLogin,urlAPISuprimentos,urlAPISP7}
            await this.store.dispatch(new setAuthUrl(data));
            observer.next(res);
          },
          error => {
            console.log(error.error);
            observer.error(error);
          }
        )
      })
    }
    public getAuthToken(refresh_token): Observable<any> {
      const newUrl = this.store.selectSnapshot(AuthUser.geturlLogin);
      let {client_id,scope} = environment;
      let body = `client_id=${client_id}&refresh_token=${refresh_token}&grant_type=refresh_token&scope=${scope} offline_access`
      return this.http.post(`${newUrl}/connect/token`,body);
    }
  }