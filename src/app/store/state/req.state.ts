import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { setReqFileds } from '../actions/req.actions';
import { ReqIntefaceModel } from '../models/req.model';

@State<ReqIntefaceModel>({
  name: 'ReqState',
  defaults: {
    motivoId: null,
    observacao: null,
    empreendimentoId: null,
    ofDescontoMaterial: null,
    exportadoConstruCompras: null,
    prazoCotacaoConstruCompras:0,
    aprovador: null,
    versaoEsperada: 3
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
  static getReq(state: ReqIntefaceModel) {
    return state;
  }
  @Action(setReqFileds)
  setReqFileds({ patchState }: StateContext<ReqIntefaceModel>, { payload }: setReqFileds) {
      console.log(payload)
    patchState(payload);
  }

}
