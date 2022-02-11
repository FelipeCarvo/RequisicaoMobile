import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetToken,setAuthData } from '../actions/auth.actions';
import { AuthUserStateModel } from '../models/auth.model';
@State<AuthUserStateModel>({
  name: 'AuthUser',
  defaults: {
    userName:null,
    token: null,
    refreshToken:null
  }
})
@Injectable({
  providedIn: 'root'
})
export class AuthUser {
  @Selector()
  static getToken(state: AuthUserStateModel) {
    return state.token;
  }
  @Selector()
  static getRefreshToken(state: AuthUserStateModel) {
    console.log(state)
    return state.refreshToken;
  }
  @Selector()
  static isAuthenticated(state: AuthUserStateModel) {
    return !!state.token;
  }
  @Action(SetToken)
  SetToken({ patchState }: StateContext<AuthUserStateModel>, { payload }: SetToken) {
    patchState({
      token: payload
    });
  }
  @Action(setAuthData)
  setAuthData({patchState}:StateContext<AuthUserStateModel>,{payload}:setAuthData){
    console.log("aqui",payload)
    patchState({
      token:payload.token,
      userName:payload.userName,
      refreshToken:payload.refreshToken
    })
  }
}
