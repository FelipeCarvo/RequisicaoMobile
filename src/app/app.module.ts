import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenuComponentComponentModule} from './shared/components/menu-cp/menu.module';
import {MenuComponentFooterModule} from './shared/components/menu-footer/menu-footer.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InterceptorModule } from './core/interceptor/interceptor.module';
import { NgxsModule } from '@ngxs/store';
import {AuthUser} from '@core/store/state/auth.state';
import {ReqState} from '@core/store/state/req.state';
import {InsumoState} from'@core/store/state/inusmos.state';
import {environment} from '@environment/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import {SharedModules} from '@components/components.module';
//import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [ReactiveFormsModule,
        InterceptorModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModules,
        IonicModule.forRoot({
            rippleEffect: true,
            animated: true,
            mode: 'md'
        }),
        AppRoutingModule,
        MenuComponentComponentModule,
        MenuComponentFooterModule,
        NgxsModule.forRoot([AuthUser, ReqState, InsumoState], { developmentMode: !environment.production }),
        NgxsStoragePluginModule.forRoot({
            keys: ['AuthUser', 'ReqState', 'InsumoState']
        })], providers: [/*File, AndroidPermissions, Base64ToGallery, */ FileOpener,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(withInterceptorsFromDi()),] })
export class AppModule {}
