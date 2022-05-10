import { HttpClient,HttpHeaders,HttpResponse } from '@angular/common/http';
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
            observer.next(res.sort(this.sortFunction));
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
            let result = res;
            console.log(result)
            result.empreendimentoId =  result.empreendimentoID;
            result.requisicaoId = result.id;
            result.versaoEsperada = result.version
            delete result["id"];
            delete result["empreendimentoID"];
            delete result["version"];
            this.store.dispatch(new setReqFileds(result))
            observer.next(res);
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
            this.store.dispatch(new setReqFileds({versaoEsperada:res.version,codigoExterno:res.codigoExterno,status:res.status}))
            observer.next(res.version);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
            observer.next(res);
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
        this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}` )
        .subscribe(
          async(res:any) => {
            console.log('res',res)
          
            observer.next(res.sort(this.sortFunction));
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    getTest(url){
      return new Observable((observer) => {
        this.http.get(`${url}`).subscribe(
          async(res:any) => {
            console.log(res)
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    viewDocument(obj,endPoint ='posDocument'){
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}`,obj,{  responseType: 'blob',observe: 'response' } )
        .subscribe(
          async(res:HttpResponse<any>) => {
            
            console.log(res.headers);
            var contentDisposition = res.headers.get('content-disposition');
            console.log(contentDisposition);
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    public retornaMIME(nomeCompleto: string): string {
      if (!nomeCompleto) return '';
      nomeCompleto = nomeCompleto.toLowerCase();
      if (nomeCompleto.endsWith('.doc')) return 'application/msword';
      if (nomeCompleto.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (nomeCompleto.endsWith('.jpeg')) return 'image/jpeg';
      if (nomeCompleto.endsWith('.jpg')) return 'image/jpeg';
      if (nomeCompleto.endsWith('.pdf')) return 'application/pdf';
      if (nomeCompleto.endsWith('.xls')) return 'application/vnd.ms-excel';
      if (nomeCompleto.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (nomeCompleto.endsWith('.txt')) return 'text/plain';
      if (nomeCompleto.endsWith('.png')) return 'image/png';
  
      if (nomeCompleto.endsWith('.aac')) return 'audio/aac';
      if (nomeCompleto.endsWith('.abw')) return 'application/x-abiword';
      if (nomeCompleto.endsWith('.arc')) return 'application/x-freearc';
      if (nomeCompleto.endsWith('.avi')) return 'video/x-msvideo';
      if (nomeCompleto.endsWith('.azw')) return 'application/vnd.amazon.ebook';
      if (nomeCompleto.endsWith('.bin')) return 'application/octet-stream';
      if (nomeCompleto.endsWith('.bmp')) return 'image/bmp';
      if (nomeCompleto.endsWith('.bz')) return 'application/x-bzip';
      if (nomeCompleto.endsWith('.bz2')) return 'application/x-bzip2';
      if (nomeCompleto.endsWith('.csh')) return 'application/x-csh';
      if (nomeCompleto.endsWith('.css')) return 'text/css';
      if (nomeCompleto.endsWith('.csv')) return 'text/csv';
      if (nomeCompleto.endsWith('.eot')) return 'application/vnd.ms-fontobject';
      if (nomeCompleto.endsWith('.epub')) return 'application/epub+zip';
      if (nomeCompleto.endsWith('.gz')) return 'application/gzip';
      if (nomeCompleto.endsWith('.gif')) return 'image/gif';
      if (nomeCompleto.endsWith('.htm')) return 'text/html';
      if (nomeCompleto.endsWith('.html')) return 'text/html';
      if (nomeCompleto.endsWith('.ico')) return 'image/vnd.microsoft.icon';
      if (nomeCompleto.endsWith('.ics')) return 'text/calendar';
      if (nomeCompleto.endsWith('.jar')) return 'application/java-archive';
      if (nomeCompleto.endsWith('.js')) return 'text/javascript';
      if (nomeCompleto.endsWith('.json')) return 'application/json';
      if (nomeCompleto.endsWith('.jsonld')) return 'application/ld+json';
      if (nomeCompleto.endsWith('.mid')) return 'audio/midi ';
      if (nomeCompleto.endsWith('.midi')) return 'audio/x-midi';
      if (nomeCompleto.endsWith('.mjs')) return 'text/javascript';
      if (nomeCompleto.endsWith('.mp3')) return 'audio/mpeg';
      if (nomeCompleto.endsWith('.mpeg')) return 'video/mpeg';
      if (nomeCompleto.endsWith('.mpkg')) return 'application/vnd.apple.installer+xml';
      if (nomeCompleto.endsWith('.odp')) return 'application/vnd.oasis.opendocument.presentation';
      if (nomeCompleto.endsWith('.ods')) return 'application/vnd.oasis.opendocument.spreadsheet';
      if (nomeCompleto.endsWith('.odt')) return 'application/vnd.oasis.opendocument.text';
      if (nomeCompleto.endsWith('.oga')) return 'audio/ogg';
      if (nomeCompleto.endsWith('.ogv')) return 'video/ogg';
      if (nomeCompleto.endsWith('.ogx')) return 'application/ogg';
      if (nomeCompleto.endsWith('.opus')) return 'audio/opus';
      if (nomeCompleto.endsWith('.otf')) return 'font/otf';
      if (nomeCompleto.endsWith('.php')) return 'application/x-httpd-php';
      if (nomeCompleto.endsWith('.ppt')) return 'application/vnd.ms-powerpoint';
      if (nomeCompleto.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      if (nomeCompleto.endsWith('.rar')) return 'application/vnd.rar';
      if (nomeCompleto.endsWith('.rtf')) return 'application/rtf';
      if (nomeCompleto.endsWith('.sh')) return 'application/x-sh';
      if (nomeCompleto.endsWith('.svg')) return 'image/svg+xml';
      if (nomeCompleto.endsWith('.swf')) return 'application/x-shockwave-flash';
      if (nomeCompleto.endsWith('.tar')) return 'application/x-tar';
      if (nomeCompleto.endsWith('.tif')) return 'image/tiff';
      if (nomeCompleto.endsWith('.tiff')) return 'image/tiff';
      if (nomeCompleto.endsWith('.ts')) return 'video/mp2t';
      if (nomeCompleto.endsWith('.ttf')) return 'font/ttf';
      if (nomeCompleto.endsWith('.vsd')) return 'application/vnd.visio';
      if (nomeCompleto.endsWith('.wav')) return 'audio/wav';
      if (nomeCompleto.endsWith('.weba')) return 'audio/webm';
      if (nomeCompleto.endsWith('.webm')) return 'video/webm';
      if (nomeCompleto.endsWith('.webp')) return 'image/webp';
      if (nomeCompleto.endsWith('.woff')) return 'font/woff';
      if (nomeCompleto.endsWith('.woff2')) return 'font/woff2';
      if (nomeCompleto.endsWith('.xhtml')) return 'application/xhtml+xml';
      if (nomeCompleto.endsWith('.xml')) return 'application/xml';
      if (nomeCompleto.endsWith('.xul')) return 'application/vnd.mozilla.xul+xml';
      if (nomeCompleto.endsWith('.zip')) return 'application/zip';
      if (nomeCompleto.endsWith('.3gp')) return 'video/3gpp';
      if (nomeCompleto.endsWith('.3g2')) return 'video/3gpp2';
      if (nomeCompleto.endsWith('.7z')) return 'application/x-7z-compressed';
      return 'text/plain';
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
            // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
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
            // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
            observer.next(res);
          },
          error => {
            observer.error(error);
          }
        )
      })
    }
    sendDocument(form,id,version,endPoint ='posDocument'){
     const {fileName,name} = form;
      let fd = new FormData();
      let currentName = fileName ||name
      fd.append(currentName, form,name);
      console.log(fd  )
      return new Observable((observer) => {
        this.http.post(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}/${version}`,
        fd,
        {}
        ).pipe(switchMap(res =>{
          return this.getVersion(this.requisicaoId)
        })).subscribe(
          async(res:any) => {
            console.log('res',res)
            // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
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