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
import { catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthUser } from '@store/state/auth.state';
import {SetToken} from '@store/actions/auth.actions'
@Injectable()
export class Interceptor implements HttpInterceptor {
 constructor(private store: Store,private http:HttpClient){}
 intercept( request: HttpRequest<any>, next: HttpHandler, ):Observable<HttpEvent<any>> {
    let errorMsg = '';
    let tokenUrl = request.url.includes('/connect/token');
    let {body} = request;
    let {grantTypeLogin,client_id,scope} = environment;
    let isAuthenticated = this.store.selectSnapshot(AuthUser.isAuthenticated);
    if(tokenUrl){
      request = request.clone({
        setHeaders: {'Content-Type': 'application/x-www-form-urlencoded'},
        body:`userName=${body.userName}&Password=${body.password}&grant_type=${grantTypeLogin}&scope=${scope}&client_id=${client_id}`
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
          const arr = {
            userName:"suporte",
            password:"Pass123$"
          }
        
          this.http.post(`${environment.BASE_URL}/sieconsts/connect/token`,arr).subscribe(
            async(res:any) => {
              const {access_token} = res;
              this.store.dispatch(new SetToken(access_token));
              request = request.clone( {
                setHeaders: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access_token}`
                }
              });
              return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                  errorMsg = `Error: ${error.error.message}`;
                  return throwError(errorMsg);
                })
              );
                
            },
            error => {
              errorMsg = `Error: ${error.error.message}`;
              return throwError(errorMsg);
            }
          )
        }
       
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        }
        else {
          console.log('this is server side error');
          let err = error.error
          errorMsg = `${err.error_description}`;
        }
        return throwError(errorMsg);
      })
    );
 }

}
