export interface insumosModel {
    id?: string;
    requisicaoId?: String,
    empresaId?: String,
    etapaId?: String,
    planoContasId?: String,
    servicoId?: String,
    insumoId?: String,
    quantidade?: number,
    prazo?: number,
    prazoDevolucao?: Date,
    insumoSubstituicaoId?: String,
    complemento?: string,
    estoque?: boolean,
    blocoId?: String,
    unidadeId?: String,
    observacoes?: string,
    ordemServicoId?: String,
    equipamentoId?: String,
    versaoEsperada?: number,
    gerarAtivoImobilizado?: boolean

}