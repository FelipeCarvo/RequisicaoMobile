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
import {SetToken} from '@core/store/actions/auth.actions'
@Injectable()
export class LoadingWithRetryInterceptor implements HttpInterceptor {


  constructor(
  
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request);
  }


}
