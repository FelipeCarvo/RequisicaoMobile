import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'central-estoque',
    loadChildren: () => import('./page/centralEstoque/centeal-estoque/centeal-estoque.module').then( m => m.CentealEstoquePageModule)
  },
  {
    path: 'detail-request/:requisicaoId',
    loadChildren: () => import('./page/detail-request/detail-request.module').then( m => m.DetailRequestPageModule),
    data:{noHeader:true},
  },

  // {
  //   path: 'request',
  //   loadChildren: () => import('./page/request/request.module').then( m => m.RequestPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
