import { Injectable } from '@angular/core';
import {environment} from '@environment/environment';
import { 
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient 
}  
from '@angular/common/http';
import { Observable,throwError, } from 'rxjs';
import { catchError ,switchMap,debounceTime,tap} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
import {setAuthData,Logout} from '@core/store/actions/auth.actions';
import { Router } from '@angular/router';
import {LoginService} from '@services/login/login.service'
import { ToastController } from '@ionic/angular';
@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private store: Store,private http:HttpClient,private router:Router,private loginService:LoginService,private toastController:ToastController){}
  intercept( request: HttpRequest<any>, next: HttpHandler, ):Observable<HttpEvent<any>> {
    let errorMsg = '';
    let tokenUrl = request.url.includes('/connect/token');
    let documentUrl  = request.url.includes('/api/RequisicaoDocumentos');
    let isAuthenticated = this.store.selectSnapshot(AuthUser.isAuthenticated);
    
    if(tokenUrl){
      request = request.clone(
        {
          setHeaders: { 'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*'},
        }
      )
    }
    else if(!documentUrl && !tokenUrl && isAuthenticated){
      let token = this.store.selectSnapshot(AuthUser.getToken);
      request = request.clone( {
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
    }
   
    else if(documentUrl  && isAuthenticated){
      let token = this.store.selectSnapshot(AuthUser.getToken);
      request = request.clone( {
        setHeaders: {
           Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
        
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let noContaisUrl = this.store.selectSnapshot(AuthUser.noUrls);
        if(noContaisUrl){
         this.redirecToLogin(error.error.error_description).then();
          return throwError(`Error: ${error}`);
        }
      
        if(error.status === 401){
  
          return this.handle401Error(request, next)
        }else{
          'error_description'
          let invalidToken = error.status && error?.error.error == 'invalid_grant';
          if(invalidToken){
            if(error.error.error_description !='Usuário ou senha inválidos!' && isAuthenticated){
              this.redirecToLogin(error.error.error_description).then();
            }

            errorMsg = error.error.error_description;
          }
          else if (error.error instanceof ErrorEvent) {
            console.log('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            console.log('this is server side error',error);
            const err = error.error
            let msg = err.mensagem ??  'erro interno'
            errorMsg = `${err?.error_description ? err.error_description : msg}`;
            console.log(errorMsg)
          }
          return throwError(errorMsg);
        }
      })
    );
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler):Observable<any> {
    let refresh_token = this.store.selectSnapshot(AuthUser.getRefreshToken);
    let userName = this.store.selectSnapshot(AuthUser.getUserName);

    return this.loginService.getAuthToken(refresh_token).pipe(
      switchMap((res) =>{
        let {access_token,refresh_token} = res;
        let authData = {
          token:access_token,
          refreshToken:refresh_token,
          userName
        }
        this.store.dispatch(new setAuthData(authData));
          const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${access_token}`
          }
        });
        return next.handle(newRequest);
      }),
      catchError(async(err: HttpErrorResponse) => {
        const {error} = err;
        await this.redirecToLogin(error.mensagem ?? error)

        return throwError(`Error: ${error}`);
      })
    )
  }
  async redirecToLogin(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
    setTimeout(()=>{
      this.store.dispatch(new Logout())
      this.router.navigate([ `/tabs/login`]);
    },1000)
  }
}