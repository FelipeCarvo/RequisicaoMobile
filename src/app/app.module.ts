import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenuComponentComponentModule} from './components/menu-cp/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorModule } from './interceptor/interceptor.module';
import { NgxsModule } from '@ngxs/store';
import {AuthUser} from './store/state/auth.state';
import {environment} from '@environment/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    InterceptorModule,
    FormsModule,
    BrowserModule, 
    IonicModule.forRoot(
      {
        rippleEffect: true,
        animated:true,
        mode: 'md'
      }
    ), 
    AppRoutingModule,
    MenuComponentComponentModule,
    NgxsModule.forRoot([AuthUser], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: ['AuthUser']
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
