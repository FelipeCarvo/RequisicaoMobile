import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {setAuthData} from '@core/store/actions/auth.actions'
@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
    constructor(private http:HttpClient, private store:Store){}
    login(obj){

      return new Observable((observer) => {
        this.http.post(`${environment.BASE_URL}/sieconsts/connect/token`,obj).subscribe(
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
  }