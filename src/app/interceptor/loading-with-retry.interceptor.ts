/* eslint-disable @typescript-eslint/no-shadow */
import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import {  ToastController } from '@ionic/angular';
import { LoaderService } from '@services/loader/loader.service';
import { EMPTY, identity, Observable } from 'rxjs';
import { catchError, delay, finalize, map, retryWhen, tap } from 'rxjs/operators';
import {LoginService} from '@services/login/login.service';
export const THROW_ERROR_ON_RETRY = new HttpContextToken<boolean>(() => false);
export const SHOW_MODAL_ON_ERROR_RETRY = new HttpContextToken<boolean>(() => true);
export const RETRY_REQUESTS = new HttpContextToken<boolean>(() => true);
export const SHOW_LOADER = new HttpContextToken<boolean>(() => false);
import { Store } from '@ngxs/store';
import {SetToken} from '@store/actions/auth.actions'
@Injectable()
export class LoadingWithRetryInterceptor implements HttpInterceptor {
  private requestCount = 0;
  private token = null;

  constructor(
    private toastCtrl: ToastController,
    private loaderService: LoaderService,
    private loginService:LoginService,
    private http:HttpClient,
    private store:Store
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const hideloading = request.headers.get('hideloading');
    if (request.url.indexOf(environment.BASE_URL) > -1) {
      this.requestCount++;
      /*
      if (!hideloading || hideloading === 'false') {
        this.showLoader();
      }
*/
      if (request.context.get(SHOW_LOADER) === true) {
        this.showLoader();
      }

      const retryFunction = (error:any) => {
        let entries = 1;
        return error.pipe(
          delay(1000),
          tap(async(err:any) => {
            
            this.showRetryToast(entries);
          }),
          map((error:any) => {
           
            if(error.status === 401 && entries == 1){
              const arr = {
                userName:"suporte",
                password:"Pass123$"
              }
            
              this.http.post(`${environment.BASE_URL}/sieconsts/connect/token`,arr).subscribe(
                async(res:any) => {
                  const {access_token} = res;
                  this.store.dispatch(new SetToken(access_token));
                  this.token = access_token;
                  console.log(request)
                  request = request.clone( {
                    setHeaders: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${ this.token }`
                    }
                  });
                  
                },
                error => {
                }
              )
            }
           
            this.onEnd();
            if (entries++ === 3) {
              throw error;
            }
            return error;
          })
        );
      };
      const hasToRetryRequest = request.context.get(RETRY_REQUESTS) === true;
      return next.handle(request).pipe(
        hasToRetryRequest ? retryWhen(retryFunction) : identity,
        catchError((err: HttpErrorResponse) => {
          
          this.onEnd();
          // this.presentFailedAlert(err);
          if (request.context.get(SHOW_MODAL_ON_ERROR_RETRY) === true) {
            this.presentFailedModal(err);
          }

          if (request.context.get(THROW_ERROR_ON_RETRY) === true) {
            throw err;
          } else {
            return EMPTY;
          }
        }),
        finalize(() => {
          this.requestCount--;
          this.onEnd();
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private async showRetryToast(retry): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: `Tentar novamente: ${retry} / 3`,
      duration: 1000,
      color: 'dark'
    });

    toast.present();
  }

  private async presentFailedModal(msg: HttpErrorResponse) {
    const toast = await this.toastCtrl.create({
      message: msg.error,
      duration: 2000
    });
    toast.present();
  }
  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
  refresh(obj){
    return new Promise((resolve,reject)=>{
      this.http.post(`${environment.BASE_URL}/sieconsts/connect/token`,obj).subscribe(
        async(res:any) => {
          const {access_token} = res;
          this.store.dispatch(new SetToken(access_token));
          resolve(access_token)
        },
        error => {
        }
      )
    })
   }
}
