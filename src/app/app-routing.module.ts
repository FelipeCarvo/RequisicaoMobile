import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'list-insumos',
    loadChildren: () => import('./page/central-request/list-insumos/list-insumos.module').then( m => m.ListInsumosPageModule)
  },
  // {
  //   path: 'edit-justificativa',
  //   loadChildren: () => import('./page/central-request/edit-justificativa/edit-justificativa.module').then( m => m.EditJustificativaPageModule)
  // }


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
