import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import {environment} from '@environment/environment';
import { Store } from '@ngxs/store';
@Injectable({
    providedIn: 'root'
  })
  export class RequestService {
    constructor(private http:HttpClient, private store:Store){}
    getAllReq(status = null){
      return new Observable((observer) => {
        this.http.get(`${environment.BASE_URL}/sieconwebsuprimentos/api/Requisicao`).subscribe(
          async(res:any) => {
            console.log(res)
            
            observer.next(status ? res.resultado.filter(item => item.status == status) :res.resultado);
          },
          error => {
            console.log(error)
            observer.error(error);
          }
        )
      })
    }
    getRequestById(id){
      return new Observable((observer) => {
        this.http.get(`${environment.BASE_URL}/sieconwebsuprimentos/api/ItemRequisicao${id}`).subscribe(
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
  }