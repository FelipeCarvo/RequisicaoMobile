import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import {RequestsEndPoints} from '../utils/enums/EnumRequest'
import {tap,switchMap} from 'rxjs/operators';
import { ReqIntefaceModel } from '@core/store/models/req.model';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds} from '@core/store/actions/req.actions'
import { NavParams } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
  })
  export class RequestService {
    sieconwebsuprimentos = `${environment.sieconwebsuprimentos}`;
    sieconwebwebapi = `${environment.sieconwebwebapi}`;
    constructor(private http:HttpClient, private store:Store){}
    getInitialParams(){
      const currentDatecurrentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      const beforeDay = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      return {
        dataInicial: moment(beforeDay).format(),
        dataFinal: moment(currentDatecurrentDate).format(),
        retificada: "Todos",
        vistada: "Todos",
        situacao: "Todas",
       
        filtrarComprador: true,
        exportadoConstruCompras: "Todos"
      }
    }
    public get requisicaoId(){
      return this.store.selectSnapshot(ReqState.getReqId);
    }
    get getStore(){
      return this.store.selectSnapshot(ReqState.getReq)
    }
    getReq(params = null, endPoint = 'PesquisaRequisicoes'){
      return new Observable((observer) => {
        if(!!params == false){
          params = this.getInitialParams();
        }
        this.http.post(`${this.sieconwebwebapi}${RequestsEndPoints[endPoint]}`,params).subscribe(
          async(res:any) => {
            observer.next(res.resultado.sort(this.sortFunction));
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getCurrentReq(id = null, endPoint = 'GetVersion'){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
          async(res:any) => {
            let result = res.resultado;
            result.empreendimentoId =  result.empreendimentoID;
            result.requisicaoId = result.id;
            result.versaoEsperada = result.version
            delete result["id"];
            delete result["empreendimentoID"];
            delete result["version"];
            this.store.dispatch(new setReqFileds(result))
            observer.next(res.resultado);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    getVersion(id = null, endPoint = 'GetVersion'){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
          async(res:any) => {
            this.store.dispatch(new setReqFileds({versaoEsperada:res.resultado.version,codigoExterno:res.resultado.codigoExterno}))
            observer.next(res.resultado.version);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    getInsumosById(id = null, endPoint = 'getIsumosId'){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    postReq(params , type){
      const url = `${this.sieconwebsuprimentos}${RequestsEndPoints['RequisicaoId']}`
      let req = type == 'POST' ? this.http.post(url,params) : this.http.put(url,params);
      return new Observable((observer) => {
        req.subscribe(
          async(res:any) => {
            console.log(res)
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    postReqTwo(params , type){
      const {requisicaoId,versaoEsperada} = this.getStore;
      const url = `${this.sieconwebsuprimentos}${RequestsEndPoints['RequisicaoId']}`
      let req;
      if(type === 'POST'){
        req = this.http.post(url,params);
        delete params["versaoEsperada"];
      }else{
        params.versaoEsperada = versaoEsperada;
        req = this.http.put(url,params);
      }
      return new Observable((observer) => {
        req.pipe(
          tap((response:any) => {

          
          }),
          switchMap((postReRes:any) => {
            const {resultado} = postReRes;
            let res;
            if(!!resultado && requisicaoId != resultado){
              res = resultado;
            }else if(!!requisicaoId && !resultado){
              res = requisicaoId;
            }
            if(!!res && res != requisicaoId){
              this.store.dispatch(new setReqFileds({requisicaoId:resultado}))
            }
            console.log(res)
            if(!!res)
            return this.getVersion(res)
          })
        ).subscribe(
          async(res:any) => {

            
            observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getJustifcativa(id = null){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}/Requisicao/${id}/Justificativas`).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getJustifcativaDetail(id = null){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}/Requisicao/Justificativa?id=${id}`).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    
    getEstoque(params){
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ConsultaEstoque`,params).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    consultaEstoqueItem(params){
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ConsultaItensEstoque`,params).subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    sendEstoqueItem(params){
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ReservaEstoqueItem`,params)
        .pipe(
          switchMap(res =>{
            return this.getVersion(this.requisicaoId)
          })
        )
        .subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    editJustifcativa(params){
      return new Observable((observer) => {
        this.http.put(`${this.sieconwebsuprimentos}/Requisicao/AtualizarJustificativa`,params)
        .pipe(
          switchMap(res =>{
            return this.getVersion(this.requisicaoId)
          })
        )
        .subscribe(
          async(res:any) => {
            observer.next(res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    
    getDocumentByEntidadeId(entidadeId,id,endPoint ='posDocument'){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${entidadeId}/${id}/` )
        .subscribe(
          async(res:any) => {
            console.log('res',res)
          
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    getDocument(id,endPoint ='posDocument'){
      return new Observable((observer) => {
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}/` )
        .subscribe(
          async(res:any) => {
            console.log('res',res)
          
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    deleteDocument(form,endPoint ='posDocument'){
      console.log(form,endPoint)
      return new Observable((observer) => {
        this.http.delete(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}?DocumentoId=${form.documentoId}&Id=${form.id}&VersaoEsperada=${form.versaoEsperada}`
        ).pipe(switchMap(res =>{
          return this.getVersion(this.requisicaoId)
        })).subscribe(
          async(res:any) => {
            console.log('res',res)
            this.store.dispatch(new setReqFileds({versaoEsperada:res}))
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    editDocument(form,endPoint ='posDocument'){

      return new Observable((observer) => {
        this.http.put(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}`,
        form
        ).pipe(switchMap(res =>{
          return this.getVersion(this.requisicaoId)
        })).subscribe(
          async(res:any) => {
            console.log('res',res)
            this.store.dispatch(new setReqFileds({versaoEsperada:res}))
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    sendDocument(form,id,version,endPoint ='posDocument'){
      console.log('sendDocument',form,'fileName',form.name)
      let fd = new FormData();
      fd.append('file',form);
      fd.append('name',form.name);
      fd.append('fileName',form.name);
      console.log(fd)
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}/${version}`,
        fd
        ).pipe(switchMap(res =>{
          return this.getVersion(this.requisicaoId)
        })).subscribe(
          async(res:any) => {
            console.log('res',res)
            this.store.dispatch(new setReqFileds({versaoEsperada:res}))
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    sortFunction(a,b){  
      let dateA = new Date(a.dataHora).getTime();
      let dateB = new Date(b.dataHora).getTime();
      return dateA < dateB ? 1 : -1;  
    }
  }