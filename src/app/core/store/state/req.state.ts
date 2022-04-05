import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { setReqFileds,ResetStateReq } from '../actions/req.actions';
import { ReqIntefaceModel } from '../models/req.model';
const defaults:ReqIntefaceModel = {
  requisicaoId:null,
  motivoId: null,
  codigoExterno:null,
  observacao: null,
  empreendimentoId: null,
  ofDescontoMaterial: null,
  exportadoConstruCompras: false,
  prazoCotacaoConstruCompras:0,
  aprovador: null,
  versaoEsperada: null
}
@State<ReqIntefaceModel>({
  name: 'ReqState',
  defaults: defaults
})
@Injectable({
  providedIn: 'root'
})
export class ReqState {
  @Selector()
  static getNumberValue(state: ReqIntefaceModel): Number {
    return state.codigoExterno
  }
  @Selector()
  static validEmpreendimentoId(state: ReqIntefaceModel) {
    return !!state.empreendimentoId;
  }
  @Selector()
  static validReqId(state: ReqIntefaceModel) {
    return !!state.requisicaoId;
  }
  @Selector()
  static getReqId(state: ReqIntefaceModel) {
    return state.requisicaoId;
  }
  @Selector()
  static getVersaoEsperada(state: ReqIntefaceModel) {
    return state.versaoEsperada;
  }
  @Selector()
  static getReq(state: ReqIntefaceModel) {
    return state;
  }
  @Action(setReqFileds)
  setReqFileds(context: StateContext<ReqIntefaceModel>, { payload }: setReqFileds) {
    context.patchState(payload);
  }
  @Action(ResetStateReq)
  resetStateReq(context: StateContext<ReqIntefaceModel>){
    context.setState({ ...defaults });
  }

}
