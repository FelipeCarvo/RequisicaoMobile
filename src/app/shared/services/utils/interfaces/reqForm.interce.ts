export interface empreendimento{
  pesquisa?: string,
  valorSelecionado?: string

}
export interface motivos {
  pesquisa?: string,
  valorSelecionado?: string
}
export interface RequestFormInterface{
  empreendimento?:empreendimento,
  motivos?:motivos,
}