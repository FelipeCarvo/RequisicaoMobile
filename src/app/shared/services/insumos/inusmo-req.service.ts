import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { Observable,} from 'rxjs';
import {tap,switchMap} from 'rxjs/operators';
import {RequestService} from '../request/request.service';
import { AuthUser } from '@core/store/state/auth.state';
export interface InsumoInterface {
  itemId: any;
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
  gerarAtivoImobilizado: Boolean,
  status?:String,
}
@Injectable({
    providedIn: 'root'
  })
  export class InsumosRequest {
    sieconwebsuprimentos = `${environment.sieconwebsuprimentos}`;
    sieconwebwebapi = `${environment.sieconwebwebapi}`;
    constructor(
      private http:HttpClient,
      private store:Store,
      private requestService:RequestService
      ){
        this.sieconwebsuprimentos = this.getUrlParams.urlAPISuprimentos;
        this.sieconwebwebapi = this.getUrlParams.urlAPISP7;
      }
    public get ReqId(){
      
      return this.store.selectSnapshot(ReqState.getReqId);
    }
    public get getUrlParams(){
      return this.store.selectSnapshot(AuthUser.geturlParams)
    }  
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
    // sendNewInsumo(form){
    //   return new Promise((resolve, reject) => {
    //     const params = this.getObject(form);
    //     this.http.post(`${this.sieconwebsuprimentos}/ItemRequisicao`,params).subscribe(
    //       async(res:any) => {
    //         resolve(res);
    //       },
    //       error => {
    //         let errorMsg:string = ''
    //         const {camposComErro,Mensagem} = error;
    //         console.log(error)
    //         if(!!camposComErro && !Mensagem){
    //           camposComErro.forEach((el,i) =>{
    //             let msg = el.mensagem;
    //             errorMsg = errorMsg + `${msg}${ i < camposComErro.length - 1 ? ',':''} `;
    //           })
    //         }
    //         else{
    //           errorMsg = Mensagem;
    //         }
    //         reject(errorMsg);
    //       }
    //     )
    //   })
    // }
    sendNewInsumo(form,metod,id = null){
      let req;
      let params = this.getObject(form);
      if(metod == 'POST'){
        req = this.http.post(`${this.sieconwebsuprimentos}/ItemRequisicao`,params)
      }else{
        params.itemId =id;
        params.status = 'Ativo';
        req = this.http.put(`${this.sieconwebsuprimentos}/ItemRequisicao`,params)
      }
     
      return new Observable((observer) => {
        req.pipe(
          tap((response:any) => {

          
          }),
          switchMap((res:any) => {
           
            return this.requestService.getVersion(params.requisicaoId)
          })
        ).subscribe(
          async(res) => {

            
            observer.next(res);
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
            observer.error(errorMsg);
          }
        )
      })
    }
    getValidacaoInsumoOrc(obj){
      return new Promise((resolve, reject) => {

        this.http.post(`${this.sieconwebwebapi}/orcamentos/Orcamento/ValidacaoInsumoOrcamento`,obj).subscribe(
          async(res:any) => {
            resolve(res);
          },
          error => {
           
            reject(error);
          }
        )
      })
    }
    getInsumoById(id){
      return new Promise((resolve, reject) => {

        this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ItensRequisicao/${id}`,{}).subscribe(
          async(res:any) => {
            resolve(res);
          },
          error => {
           
            reject(error);
          }
        )
      })
    }
    getItemEdit(id){
      return new Promise((resolve, reject) => {
        this.http.get(`${this.sieconwebsuprimentos}/ItemRequisicao?${id}`)

        .subscribe(
          async(res:any) => {
            resolve(res);
          },
          error => {
           
            reject(error);
          }
        )
      })
    }
    deleteById(params){
      return new Promise((resolve, reject) => {
        this.http.delete(`${this.sieconwebsuprimentos}/ItemRequisicao?${params}`)
        .pipe(
          switchMap((res:any) => { 
            return this.requestService.getVersion(this.ReqId)
          })
        )
        .subscribe(
          async(res:any) => {
            resolve(res);
          },
          error => {
           
            reject(error);
          }
        )
      })
    }
  }