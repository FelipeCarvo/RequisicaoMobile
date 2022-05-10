import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenuComponentComponentModule} from './shared/components/menu-cp/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorModule } from './core/interceptor/interceptor.module';
import { NgxsModule } from '@ngxs/store';
import {AuthUser} from '@core/store/state/auth.state';
import {ReqState} from '@core/store/state/req.state';
import {InsumoState} from'@core/store/state/inusmos.state';
import {environment} from '@environment/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { File } from '@ionic-native/file/ngx';
import {sharedModules} from '@components/components.module';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    InterceptorModule,
    FormsModule,
    BrowserModule, 
    BrowserAnimationsModule,
    sharedModules,
    IonicModule.forRoot(
      {
        rippleEffect: true,
        animated:true,
        mode: 'md'
      }
    ), 
    AppRoutingModule,
    MenuComponentComponentModule,
    NgxsModule.forRoot([AuthUser,ReqState,InsumoState], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: ['AuthUser','ReqState','InsumoState']
    }),
  ],
  providers: [File,FileOpener,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },],
  bootstrap: [AppComponent]
})
export class AppModule {}
