import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {RouterTokenValidation} from './auth/validationToken';
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
        path: 'new-home',
        loadChildren: () => import('../page/newhome/new-home.module').then(m => m.newHomePageModule),
        data:{noHeader:false},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'home-estoque',
        loadChildren: () => import('../page/home-estoque/home-estoque.module').then(m => m.HomeEstoquePageRoutingModule),
        data:{noHeader:false},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'profile',
        loadChildren: () => import('../page/profile/profile.module').then(m => m.ProfilePageModule),
        data:{noHeader:true},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'all-request',
        loadChildren: () => import('../page/allRequest/allRequest.module').then(m => m.AllRequestPageModule),
        data:{noHeader:true},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'central-req',
        loadChildren: () => import('../page/central-request/central-module/centeal-estoque.module').then( m => m.CentealEstoquePageModule),
        data:{noHeader:true},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'central-req-frota',
        loadChildren: () => import('../page/central-request/central-module/centeal-estoque.module').then( m => m.CentealEstoquePageModule),
        data:{noHeader:true},
        canActivate:[RouterTokenValidation]
      },
      {
        path: 'detail-request/:requisicaoId',
        loadChildren: () => import('../page/detail-request/detail-request.module').then( m => m.DetailRequestPageModule),
        data:{noHeader:true},
      },
      {
        path: 'entrega-req-frota/:termoResponsabilidadeId/:termoResponsabilidadeItemId',
        loadChildren: () => import('../page/central-request/entrega-item-estoque/entrega-frota.module')
              .then( m => m.EntregaRequestPageModule),
        data:{noHeader:true},
      },
      {
        path: 'request-dev-frota/:requisicaoId/:empreendimentoId',
        loadChildren: () => import('../page/central-request/request-dev-frota/request-dev-frota.module')
        .then( m => m.DetailRequestPageModule),
        data:{noHeader:true},
      },
      {
        path: 'detail-request-frota/:requisicaoId/:empreendimentoId',
        loadChildren: () => import('../page/central-request/request-ft-details/detail-frota.module').then( m => m.DetailRequestPageModule),
        data:{noHeader:true},
      },
      {
        path: 'list-in-frota/:requisicaoId/:empreendimentoId',
        loadChildren: () => import('../page/central-request/list-in-frota/list-in-frota.module').then( m => m.ListInsumosFrotaPageModule),
        data:{noHeader:true},
      },
      {
        path: '**',
        redirectTo: '/tabs/new-home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tabs/new-home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
