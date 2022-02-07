/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Subject, Subscription, of, Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { switchMap, distinctUntilChanged } from 'rxjs/operators';
import { LoaderState } from './loader.interface';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  private loaderState$ = this.loaderSubject.asObservable();
  private isLoading = false;
  private currentLoading: HTMLIonLoadingElement;
  private _parametro: string;

  public get parametro(): string {
    return this._parametro;
  }
  public set parametro(value: string) {
    this._parametro = value;
  }
  constructor(private loadingController: LoadingController) {}

  show(message?) {
    this.loaderSubject.next({ show: true, message } as LoaderState);
  }

  hide() {
    this.loaderSubject.next({ show: false } as LoaderState);
  }

  initializeLoader(): Subscription {
    const sub = this.loaderState$.pipe(switchMap(state => of(state))).subscribe(data => {
      this.changeLoaderState(data);
    });
    this.hide();
    return sub;
  }

  private async changeLoaderState(show: LoaderState) {
    if (show.show) {
      this.present(show?.message);
    } else {
      this.dismiss();
    }
  }

  private async present(message?) {
    if (!this.isLoading) {
      this.isLoading = true;
      this.currentLoading = await this.loadingController.create({
        // spinner: 'circular',
        duration: 20000,
        message,
        cssClass: 'custom-loading'
      });
      this.currentLoading.present().then(() => {
        if (!this.isLoading) {
          this.currentLoading.dismiss();
        }
      });
      return this.currentLoading;
    }
  }

  private async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      if (this.currentLoading) {
        if (!(await this.currentLoading.dismiss())) {
          const top = await this.loadingController.getTop();
          if (top) {
            top.dismiss();
          }
        }
      }
    }
  }
}
