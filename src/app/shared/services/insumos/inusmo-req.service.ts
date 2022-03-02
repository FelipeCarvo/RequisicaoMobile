import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
export interface InsumoInterface {
  requisicaoId: String,
  empresaId: String,
  etapaId: String,
  planoContasId: String,
  servicoId: String,
  insumoId: String,
  quantidade: Number,
  prazo: String,
  prazoDevolucao: String,
  insumoSubstituicaoId: String,
  complemento: String,
  estoque: boolean,
  blocoId: String,
  unidadeId: String,
  observacoes: String,
  ordemServicoId: String,
  equipamentoId: String,
  versaoEsperada: number,
  gerarAtivoImobilizado: Boolean
}
@Injectable({
    providedIn: 'root'
  })
  export class InsumosRequest {
    sieconwebsuprimentos = `https://cors-anywhere.herokuapp.com/${environment.sieconwebsuprimentos}`;
    sieconwebwebapi = `https://cors-anywhere.herokuapp.com/${environment.sieconwebwebapi}`;
    constructor(private http:HttpClient,private store:Store,){}
    getObject(form){
      const{requisicaoId,versaoEsperada}=this.store.selectSnapshot(ReqState.getReq);
      const obj:InsumoInterface = <InsumoInterface>{requisicaoId,versaoEsperada, ...form};
      let params = Object.assign({}, obj);
      for (const key in params) {
        if (!params[key]) {
          delete params[key];
        }
      }
      return params;
    }
    sendNewInsumo(form){
      return new Promise((resolve, reject) => {
        const params = this.getObject(form);
        this.http.post(`${this.sieconwebsuprimentos}/ItemRequisicao`,params).subscribe(
          async(res:any) => {
            resolve(res.resultado);
          },
          error => {
            let errorMsg:string = ''
            const {camposComErro,Mensagem} = error;
            console.log(error)
            if(!!camposComErro && !Mensagem){
              camposComErro.forEach((el,i) =>{
                let msg = el.mensagem;
                errorMsg = errorMsg + `${msg}${ i < camposComErro.length - 1 ? ',':''} `;
              })
            }
            else{
              errorMsg = Mensagem;
            }
            reject(errorMsg);
          }
        )
      })
    }
    getInsumoById(id){
      return new Promise((resolve, reject) => {

        this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ItensRequisicao/${id}`,{}).subscribe(
          async(res:any) => {
            resolve(res.resultado);
          },
          error => {
           
            reject(error);
          }
        )
      })
    }
  }