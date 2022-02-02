import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { setReqFileds } from '../actions/req.actions';
import { ReqIntefaceModel } from '../models/req.model';

@State<ReqIntefaceModel>({
  name: 'ReqState',
  defaults: {
    requisicaoId:null,
    motivoId: null,
    observacao: null,
    empreendimentoId: null,
    ofDescontoMaterial: null,
    exportadoConstruCompras: false,
    prazoCotacaoConstruCompras:0,
    aprovador: null,
    //versaoEsperada: 3
  }
})
@Injectable({
  providedIn: 'root'
})
export class ReqState {

  @Selector()
  static validEmpreendimentoId(state: ReqIntefaceModel) {
    return !!state.empreendimentoId;
  }
  @Selector()
  static validReqId(state: ReqIntefaceModel) {
    return !!state.requisicaoId;
  }
  @Selector()
  static getReq(state: ReqIntefaceModel) {
    return state;
  }
  @Action(setReqFileds)
  setReqFileds(state: StateContext<ReqIntefaceModel>, { payload }: setReqFileds) {
    console.log(state)
    state.patchState(payload);
  }

}
