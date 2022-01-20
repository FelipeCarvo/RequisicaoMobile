import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { Store } from '@ngxs/store';
import {RouterTokenValidation} from './auth/validationToken'
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../page/login/login.module').then(m => m.LoginPagePageModule),
        data:{noHeader:true},
        canActivate:[RouterTokenValidation]
       
      },
      {
        path: 'home',
        loadChildren: () => import('../page/home/home.module').then(m => m.homePageModule),
        data:{noHeader:false},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'profile',
        loadChildren: () => import('../page/profile/profile.module').then(m => m.ProfilePageModule),
        data:{noHeader:true}
      },
      {
        path: 'request',
        loadChildren: () => import('../page/request/request.module').then(m => m.RequestPageModule),
        data:{noHeader:true}
      },
      {
        path: 'all-request',
        loadChildren: () => import('../page/allRequest/allRequest.module').then(m => m.AllRequestPageModule),
        data:{noHeader:true}
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
