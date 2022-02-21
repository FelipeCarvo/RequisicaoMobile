import { State, Action, StateContext, Selector } from '@ngxs/store';
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
    patchState({
      token:payload.token,
      userName:payload.userName,
      refreshToken:payload.refreshToken
    })
  }
  @Action(Logout)
  logout(context: StateContext<AuthUserStateModel>) {
    context.setState({ ...defaults });
  }
}
