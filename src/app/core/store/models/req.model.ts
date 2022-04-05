export interface ReqIntefaceModel  {
    requisicaoId?:string,
    codigoExterno?:Number,
    motivoId?: string,
    observacao?: string,
    empreendimentoId: string,
    ofDescontoMaterial?: string,
    exportadoConstruCompras?: boolean,
    prazoCotacaoConstruCompras?: Number,
    aprovador?: string,
    versaoEsperada: Number
}