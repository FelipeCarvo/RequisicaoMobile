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
import { catchError ,switchMap,debounceTime} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
import {SetToken,setAuthData,Logout} from '@core/store/actions/auth.actions';
import { Router } from '@angular/router';
@Injectable()
export class Interceptor implements HttpInterceptor {
 constructor(private store: Store,private http:HttpClient,private router:Router){}
 intercept( request: HttpRequest<any>, next: HttpHandler, ):Observable<HttpEvent<any>> {
    let errorMsg = '';
    let tokenUrl = request.url.includes('/connect/token');
    let {body} = request;
    let {grantTypeLogin,client_id,scope} = environment;
    let isAuthenticated = this.store.selectSnapshot(AuthUser.isAuthenticated);
    if(tokenUrl && !isAuthenticated){
      request = request.clone({
        setHeaders: {'Content-Type': 'application/x-www-form-urlencoded'},
        body:`userName=${body.userName}&Password=${body.password}&grant_type=${grantTypeLogin}&scope=${scope} offline_access&client_id=${client_id}`
      });
    }
    else if(isAuthenticated){
      let token = this.store.selectSnapshot(AuthUser.getToken);
      request = request.clone( {
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          return this.handle401Error(request, next);
        }else{
          if (error.error instanceof ErrorEvent) {
            console.log('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            console.log('this is server side error',error);
            const err = error.error
            errorMsg = `${err?.error_description ? err.error_description : err.Mensagem}`;
          }
          return throwError(error.error);
        }
      })
    );
  }
 getNewReq(request: HttpRequest<any>){
  let refresh_token = this.store.selectSnapshot(AuthUser.getRefreshToken);
  let {grantTypeLogin,client_id,scope} = environment;
  const newUrl = {url: `${environment.BASE_URL}/sieconsts/connect/token`};
  let newHeader = {
    setHeaders: { 'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*'},
    body:`client_id=${client_id}&refresh_token=${refresh_token}&grant_type=refresh_token&scope=${scope} offline_access`
  };
  newHeader= Object.assign(newHeader, newUrl);
  return request.clone(newHeader)
 }
 private handle401Error(request: HttpRequest<any>, next: HttpHandler):Observable<any> {
  const newReq = this.getNewReq(request);
  return next.handle(newReq).pipe(
    debounceTime(600),
    switchMap(async (res:any) =>{
      const {access_token,refresh_token} = res?.body;
      const authData = {
        token:access_token,
        refreshToken:refresh_token,
      }
      await this.store.dispatch(new setAuthData(authData));
      const newRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`
        }
      });
      return next.handle(newRequest).toPromise();
    }),
    catchError((error: HttpErrorResponse) => {
      this.store.dispatch(new Logout())
      this.router.navigate([ `/tabs/login`]);
      return throwError(`Error: ${error.error.Mensagem}`);
    })
  )
}
}