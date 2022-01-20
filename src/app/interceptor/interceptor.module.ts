import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './interceptor.service';
import { LoadingWithRetryInterceptor } from './loading-with-retry.interceptor';
@NgModule({
 providers: [
  Interceptor,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true,
  },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: LoadingWithRetryInterceptor,
  //   multi: true,
  // },
 ],
})
export class InterceptorModule {}