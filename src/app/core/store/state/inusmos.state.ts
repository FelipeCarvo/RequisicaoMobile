import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetInsumosFileds,ResetStateInsumos } from '../actions/insumos.actions';
import { insumosModel } from '../models/inusmos.model';
const defaults:insumosModel = {
  requisicaoId: null,
  empresaId: null,
  etapaId: null,
  planoContasId: null,
  servicoId: null,
  insumoId: null,
  quantidade: null,
  prazo: null,
  prazoDevolucao: null,
  insumoSubstituicaoId: null,
  complemento: null,
  estoque: null,
  blocoId: null,
  unidadeId: null,
  observacoes: null,
  ordemServicoId: null,
  equipamentoId: null,
  versaoEsperada: null,
  gerarAtivoImobilizado: null
}
@State<insumosModel>({
  name: 'InsumoState',
  defaults: defaults
})
@Injectable({
  providedIn: 'root'
})
export class InsumoState {
  @Selector()
  getIdInsumo(state:insumosModel){
    return state.insumoId;
  }
  @Selector()
  static validInsumos(state: insumosModel) {
    return !!state.requisicaoId;
  }
  @Selector()
  static getInsumos(state: insumosModel) {
    return state;
  }
  @Action(SetInsumosFileds)
  setInsumosFileds(state: StateContext<insumosModel>, { payload }: SetInsumosFileds) {
    state.patchState(payload);
  }
  @Action(ResetStateInsumos)
  resetStateInsumos(context: StateContext<ResetStateInsumos>) {
    context.setState({ ...defaults });
  }

}
