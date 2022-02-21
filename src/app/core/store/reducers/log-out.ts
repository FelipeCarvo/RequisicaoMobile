import { State, Action, StateContext, Selector,Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetToken,setAuthData,Logout } from '../actions/auth.actions';
import { AuthUserStateModel } from '../models/auth.model';
const defaults: AuthUserStateModel = {
  userName: null,
  token:null,
  refreshToken:null
};
@State<AuthUserStateModel>({
  name: 'AuthUser',
  defaults: defaults
})
@Injectable({
  providedIn: 'root'
})
export class LogoutStore {
  constructor(
    private store: Store,
  
  ){
   
  }
  logOut(){
    this.store.reset(defaults);
  }
}