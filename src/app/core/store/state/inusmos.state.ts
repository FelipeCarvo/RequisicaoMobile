import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { setInsumosFileds } from '../actions/insumos.actions';
import { insumosModel } from '../models/inusmos.model';

@State<insumosModel>({
  name: 'InsumoState',
  defaults: {
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
})
@Injectable({
  providedIn: 'root'
})
export class InsumoState {

 
  @Selector()
  static validInsumos(state: insumosModel) {
    return !!state.requisicaoId;
  }
  @Selector()
  static getInsumos(state: insumosModel) {
    return state;
  }
  @Action(setInsumosFileds)
  setInsumosFileds(state: StateContext<insumosModel>, { payload }: setInsumosFileds) {
    console.log(state)
    state.patchState(payload);
  }

}
