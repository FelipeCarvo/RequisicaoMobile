import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import { Store } from '@ngxs/store';
import {RequestsEndPoints} from '../utils/enums/EnumRequest';
import {tap,switchMap} from 'rxjs/operators';
import {ReqState} from '@core/store/state/req.state';
import {setReqFileds} from '@core/store/actions/req.actions';
import { AuthUser } from '@core/store/state/auth.state';
import { formatISO } from 'date-fns';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
  // sieconwebsuprimentos;
  //sieconwebwebapi;
  constructor(private http: HttpClient, private store: Store){
    // this.sieconwebsuprimentos = this.getUrlParams.urlAPISuprimentos;
    //this.sieconwebwebapi = this.getUrlParams.urlAPISP7;
  }
  getInitialParams(){
    const currentDatecurrentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const beforeDay = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    return {
      dataInicial: formatISO(beforeDay, { representation: 'date' }),
      dataFinal: formatISO(currentDatecurrentDate),
      retificada: 'Todos',
      vistada: 'Todos',
      situacao: 'Todas',

      filtrarComprador: true,
      exportadoConstruCompras: 'Todos'
    };
  }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  public get sieconwebsuprimentos(){
    return this.store.selectSnapshot(AuthUser.geturlParams).urlAPISuprimentos;
  }
  public get sieconwebwebapi(){
    return this.store.selectSnapshot(AuthUser.geturlParams).urlAPISP7;
  }
  public get getUrlParams(){
    return this.store.selectSnapshot(AuthUser.geturlParams)
  }
  get getStore(){
    return this.store.selectSnapshot(ReqState.getReq)
  }
  getReq(params = null, endPoint = 'PesquisaRequisicoes'){
    return new Observable((observer) => {
      if(!!params === false){
        params = this.getInitialParams();
      }
      this.http.post(`${this.sieconwebwebapi}${RequestsEndPoints[endPoint]}`,params).subscribe(
        async (res: any) => {
          observer.next(res.sort(this.sortFunction));
        },
        error => {
          console.log(error);
          observer.error(error);
        }
      );
    });
  }
  getCurrentReq(id = null, endPoint = 'GetVersion'){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
        async (res: any) => {
          const result = res;
          result.empreendimentoId =  result.empreendimentoID;
          result.requisicaoId = result.id ?? id;
          result.versaoEsperada = result.version;
          delete result["id"];
          delete result["empreendimentoID"];
          delete result["version"];
          this.store.dispatch(new setReqFileds(result));
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  getVersion(id = null, endPoint = 'GetVersion'){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
        async (res: any) => {
          this.store.dispatch(new setReqFileds({versaoEsperada:res.version,codigoExterno:res.codigoExterno,status:res.status}));
          observer.next(res.version);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      )
    })
  }
  getInsumosById(id = null, endPoint = 'getIsumosId'){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}`).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      )
    })
  }
  postReq(params , type){
    const url = `${this.sieconwebsuprimentos}${RequestsEndPoints['RequisicaoId']}`;
    const req = type === 'POST' ? this.http.post(url,params) : this.http.put(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postExcluirItemTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/excluirItemTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postExcluirItemEpi(params ){
    const url = `${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/excluirItemBaixaEpi`;
    let req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postAlterarStatusTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/alterarStatusTermoResponsabilidade`;
    let req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postAlterarStatusTermoEpi(params ){
    const url = `${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/alterarStatusEpiBaixa`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }


  postInsereAssinaturaTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/inserirAssinaturaTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }

  postConfirmarEntregaItemTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/confirmaEntregaItemTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postConfirmarDevolucaoItemTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/baixaDevolucaodoItemTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  getNumeroLoteDevolucao(){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebwebapi}/frotas/TermoResponsabilidade/NovoNumeroLoteDevulucaoTermorResponsabilidade`).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      )
    })
  }
  postConfirmarEntregaTotalTermo(params ){
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/confirmaEntregaTotalTermoResponsabilidade`;
    let req = this.http.post(url,params);
    return new Observable((observer) => {
      req.subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }



  postReqTwo(params , type){
    const {requisicaoId,versaoEsperada} = this.getStore;
    const url = `${this.sieconwebsuprimentos}${RequestsEndPoints['RequisicaoId']}`
    console.log(url)
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
        tap((response: any) => {


        }),
        switchMap((postReRes: any) => {
          const resultado = postReRes;
          let res;
          if(typeof resultado === 'string'){
            if(!!resultado  && requisicaoId != resultado){
              res = resultado;
            }else if(!!requisicaoId && !resultado){
              res = requisicaoId;
            }
            if(!!res && res != requisicaoId){
              this.store.dispatch(new setReqFileds({requisicaoId:resultado}))
            }
          }else{
            res = requisicaoId
          }

          if(!!res)
          return this.getVersion(res)
        })
      ).subscribe(
        async (res: any) => {


          observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  getJustifcativa(id = null){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}/Requisicao/${id}/Justificativas`).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  getJustifcativaDetail(id = null){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}/Requisicao/Justificativa?id=${id}`).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }

  getEstoque(params){
    return new Observable((observer) => {
      this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ConsultaEstoque`,params).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  consultaEstoqueItem(params){
    return new Observable((observer) => {
      this.http.post(`${this.sieconwebwebapi}/suprimentos/Requisicao/ConsultaItensEstoque`,params).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  consultaEstoqueItemEquipamento(params) {
    return new Observable((observer) =>{
      this.http.post(`${this.sieconwebwebapi}/frotas/Lookups/EquipamentoDisponiveisEmpreendimentoTermoResp`,params)
        .subscribe(
          async (res: any) => {
            observer.next(res);
          },
          error => {
            console.log(error);
            observer.error(error);
          },
          () => {
            observer.complete();
          }
        );
    });
  }
  consultaEstoqueItemEpi(empreendimentoId, insumoId) {
    return new Observable((observer) =>{
      this.http.get(`${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/SaldoEstoqueEmprdEpi/${empreendimentoId}/${insumoId}`)
        .subscribe(
          async (res: any) => {
            observer.next(res.map(e => {
              const r = e;
              r.itemRi = r.itemCodigo + '-' + r.riBaixaCodigo;
              return r;
            }));
          },
          error => {
            console.log(error);
            observer.error(error);
          },
          () => {
            observer.complete();
          }

        );
    });
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
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
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
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.log(error)
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }

  getDocumentByEntidadeId(entidadeId,id,endPoint ='posDocument'){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${entidadeId}/${id}/` )
      .subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  getDocument(id,endPoint ='posDocument'){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}` )
      .subscribe(
        async (res: any) => {
          observer.next(res.sort(this.sortFunction));
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  getTest(url){
    return new Observable((observer) => {
      this.http.get(`${url}`).subscribe(
        async (res: any) => {

        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  viewDocument(obj,fileName,endPoint ='posDocument'){
    return new Observable((observer) => {
      this.http.post(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}`,obj,{  responseType: 'blob',observe: 'response' } )
      .subscribe(
        async (res: HttpResponse<any>) => {
          let type = this.retornaMIME(fileName)
          let blob = new Blob([res.body], { type: type })

          observer.next(blob);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
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
    return new Observable((observer) => {
      this.http.delete(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}?DocumentoId=${form.documentoId}&Id=${form.id}&VersaoEsperada=${form.versaoEsperada}`
      ).pipe(switchMap(res =>{
        return this.getVersion(this.requisicaoId)
      })).subscribe(
        async (res: any) => {
          // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
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
        async (res: any) => {
          // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  sendDocument(form,id,version,endPoint ='posDocument'){
    const {fileName,name} = form;
    let fd = new FormData();
    let currentName = fileName ||name
    fd.append(currentName, form,name);
    return new Observable((observer) => {
      this.http.post(`${this.sieconwebsuprimentos}${RequestsEndPoints[endPoint]}/${id}/${version}`,
      fd,
      {}
      ).pipe(switchMap(res =>{
        return this.getVersion(this.requisicaoId)
      })).subscribe(
        async (res: any) => {
          // this.store.dispatch(new setReqFileds({versaoEsperada:res}))
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      )
    })
  }
  sortFunction(a,b){
    let dateA = new Date(a.dataHora).getTime();
    let dateB = new Date(b.dataHora).getTime();
    return dateA < dateB ? 1 : -1;
  }
  postReqEpi(params , type){
    const {requisicaoId,versaoEsperada} = this.getStore;
    const url = `${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/inserirEpiBaixaEstoque`;
    let req;
    if(type === 'POST'){
      delete params["versaoEsperada"];
      req = this.http.post(url,params);
    }else{
      params.versaoEsperada = versaoEsperada;
      req = this.http.put(url,params);
    }
    return new Observable((observer) => {
      req.pipe(
        tap((response: any) => {
          console.log('TAP');
          console.log(response);
        }),
        switchMap((postReRes: any) => {
          const resultado = postReRes;
          let res;
          if(typeof resultado === 'string'){
            if(!!resultado  && requisicaoId !== resultado){
              res = resultado;
            }else if(!!requisicaoId && !resultado){
              res = requisicaoId;
            }
            if(!!res && res !== requisicaoId){
              this.store.dispatch(new setReqFileds({requisicaoId:resultado}));
            }
          }else{
            res = requisicaoId ;
          }

          // if(!!res){
          //   return this.getVersion(res);
          // }
          return type;
        })
      ).subscribe(
        async (res: any) => {
          observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  postReqFrota(params , type){
    const {requisicaoId,versaoEsperada} = this.getStore;
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/inserirTermoResponsabilidade`;
    let req;
    if(type === 'POST'){
      delete params["versaoEsperada"];
      req = this.http.post(url,params);
    }else{
      params.versaoEsperada = versaoEsperada;
      req = this.http.put(url,params);
    }

    return new Observable((observer) => {
      req.pipe(
        tap((response: any) => {
          console.log('TAP');
          console.log(response);
        }),
        switchMap((postReRes: any) => {
          const resultado = postReRes;
          let res;
          if(typeof resultado === 'string'){
            if(!!resultado  && requisicaoId !== resultado){
              res = resultado;
            }else if(!!requisicaoId && !resultado){
              res = requisicaoId;
            }
            if(!!res && res !== requisicaoId){
              this.store.dispatch(new setReqFileds({requisicaoId:resultado}));
            }
          }else{
            res = requisicaoId ;
          }

          // if(!!res){
          //   return this.getVersion(res);
          // }
          return type;
        })
      ).subscribe(
        async (res: any) => {
          observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  postInsertItemReq(params ){
    const {requisicaoId,versaoEsperada} = this.getStore;
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/inserirItemTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.pipe(
        tap((response: any) => {
          console.log('TAP');
          console.log(response);
        }),
        switchMap((postReRes: any) => {
          const resultado = postReRes;
          console.log(postReRes);
          return resultado;
        })
      ).subscribe(
        async (res: any) => {
          observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  postInsertItemReqEpi(params ){
    const url = `${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/inserirEpiItemBaixaEstoque`;
    return this.http.post(url,params);
  }

  postAlterQtdtemReq(params ){
    const {requisicaoId,versaoEsperada} = this.getStore;
    const url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/alteraQuantidadeItemTermoResponsabilidade`;
    const req = this.http.post(url,params);
    return new Observable((observer) => {
      req.pipe(
        tap((response: any) => {
          console.log('TAP');
          console.log(response);
        }),
      ).subscribe(
        async (res: any) => {
          observer.next({versaoEsperada:res,requisicaoId:this.getStore.requisicaoId});
        },
        error => {
          console.log(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  getTermosEmpr(params){
    return new Observable((observer) => {
      let url = `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/`;
      console.log(params);
      var qtdparam = 0;
      url =url + `termoResponsabilidade/listaTermodeResponsabilidade?`;
      if (params.empreendimentoId !== null && params.empreendimentoId !== undefined){
        qtdparam++;
        url =url + `&EmpreedimentoId=${params.empreendimentoId}`;
      }
      if (params.colaboradorId !== null && params.colaboradorId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `ColaboradorId=${params.colaboradorId}`;
      }
      if (params.equipamentoId !== null && params.equipamentoId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `EquipamentoId=${params.equipamentoId}`;
      }
      if (params.statusId !== null && params.statusId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `StatusTermo=${params.statusId}`;
      }
      if (params.somenteComSaldoDevedor !== null && params.somenteComSaldoDevedor !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `SomenteComSaldoDevolver=${params.somenteComSaldoDevedor}`;
      }
      if (params.dataInicio !== null && params.dataInicio !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `DataIni=${params.dataInicio}`;
      }
      if (params.dataFim !== null && params.dataFim !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `DataFim=${params.dataFim}`;
      }
      if(params.termoResponsabilidadeId !== null && params.termoResponsabilidadeId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `termoResponsabilidadeId=${params.termoResponsabilidadeId}`;
      }
      this.http.get(url).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }

      );
    });
  }
  getTermosEmprEpi(params){
    return new Observable((observer) => {
      let url = `${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/epiBaixaEstoque/baixasEstoqueEpi?`;
      var qtdparam = 0;
      if (params.empreendimentoId !== null && params.empreendimentoId !== undefined){
        qtdparam++;
        url =url + `EmpreedimentoId=${params.empreendimentoId}`;
      }
      if (params.colaboradorId !== null && params.colaboradorId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `ColaboradorId=${params.colaboradorId}`;
      }
      if (params.statusId !== null && params.statusId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `StatusBaixaEpi=${params.statusId}`;
      }
      if (params.dataInicio !== null && params.dataInicio !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `DataIni=${params.dataInicio}`;
      }
      if (params.dataFim !== null && params.dataFim !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `DataFim=${params.dataFim}`;
      }
      if(params.baixaEstoqueId !== null && params.baixaEstoqueId !== undefined){
        if(qtdparam>0) {
          url =url+'&';
        }
        qtdparam++;
        url =url + `baixaEstoqueId=${params.baixaEstoqueId}`;
      }
      this.http.get(url).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  objetoParaUrlParams(obj: any): URLSearchParams {
    const params = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === undefined) {
          continue;
        }
        params.set(key, obj[key]);
      }
    }
    return params;
  }
  getItensTermosEmpr(filtro: FiltroItensTermo){
    return new Observable((observer) => {
      const params = this.objetoParaUrlParams(filtro);
      const options = params.toString();
      this.http.get(
        `${this.sieconwebwebapi}/frotas/TermoResponsabilidade/termoResponsabilidadeItens/listaItensTermoResponsabilidade?${options}`
      ).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          console.error(error);
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  getItensEpiEmpr(termoId){
    return new Observable((observer) => {
      this.http.get(`${this.sieconwebwebapi}/Epi/EpiBaixaEstoque/ItensEpiBaixaEstoque/${termoId}`
      ).subscribe(
        async (res: any) => {
          observer.next(res);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  getItensParaDevolver(filtro: FiltroItensDevolucao) {
      const params = this.objetoParaUrlParams(filtro);
      const options = params.toString();
      return this.http.get(
        `${this.sieconwebwebapi}/frotas/termoResponsabilidade/termoResponsabilidade/listaTermoResponsabilidadeDevolver?${options}`
      );
  }
}

export class FiltroItensTermo {
  public termoResponsabilidadeId: string;
  public equipamentoId: string;
  get filtrarComSaldoDevolver(): boolean {
    return this.somenteComSaldoDevolver === 1;
  }
  set filtrarComSaldoDevolver(value: boolean) {
    this.somenteComSaldoDevolver = value
      ? 1
      : 0;
  }
  public somenteComSaldoDevolver: number;
}

export class FiltroItensDevolucao {
  public empreendimentoId: string;
  public dataIni: Date;
  public dataFim: Date;
  public colaboradorId: string;
  public equipamentoId: string;
  get filtrarComSaldoDevolver(): boolean {
    return this.somenteComSaldoDevolver === 1;
  }
  set filtrarComSaldoDevolver(value: boolean) {
    this.somenteComSaldoDevolver = value
      ? 1
      : 0;
  }
  public somenteComSaldoDevolver: number;
}
