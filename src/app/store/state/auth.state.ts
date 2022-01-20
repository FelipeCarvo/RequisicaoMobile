import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetToken,setAuthData } from '../actions/auth.actions';
import { AuthUserStateModel } from '../models/auth.model';
@State<AuthUserStateModel>({
  name: 'AuthUser',
  defaults: {
    userName:null,
    Password:null,
    token: null,
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
    patchState({
      token:payload.token,
      userName:payload.userName,
      Password:payload.Password
    })
  }
}
