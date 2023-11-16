import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CentealEstoquePage } from './centeal-estoque.page';

const routes: Routes = [
  {
    path: '',
    component: CentealEstoquePage,
    children: [
      {
        path: 'insumos',
        loadChildren: () => import('../insumos/insumos.page.module').then(m => m.InsumosPageModule),
        data:{noHeader:true},
      },
      {
        path: 'consulta-estoque/:id',
        loadChildren: () => import('../consulta-estoque/consulta-estoque.module').then( m => m.ConsultaEstoquePageModule),
        data:{noHeader:true},
      },
      {
        path: 'nova-req',
        loadChildren: () => import('../request/request.module').then( m => m.RequestPageModule),
        data:{noHeader:true},
      },
      {
        path: 'nova-req-frota/:rota',
        loadChildren: () => import('../request-frota/request-frota.module').then( m => m.RequestFrotaPageModule),
        data:{noHeader:true},
      },
      {
        path: 'dev-frota/:rota',
        loadChildren: () => import('../dev-frota/dev-frota.module').then( m => m.RequestFrotaPageModule),
        data:{noHeader:true},
      },
      {
        path: 'list-req-pesqfrota',
        loadChildren: () => import('../request-frota-list-pesq/list-request-pesq.module').then( m => m.ListRequestFrotaPesqPageModule),
        data:{noHeader:true},
      },
      {
        path: 'list-insumos',
        loadChildren: () => import('../list-insumos/list-insumos.module').then( m => m.ListInsumosPageModule),
        data:{noHeader:true},
      },
      {
        path: 'edit-justificativa/:justificativaId',
        loadChildren: () => import('../edit-justificativa/edit-justificativa.module').then( m => m.EditJustificativaPageModule),
        data:{noHeader:true},
      },
      {
        path: 'reserva-insumo',
        loadChildren: () => import('../reserva-insumo/reserva-insumo.module').then( m => m.ReservaInsumoPageModule),
        data:{noHeader:true},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentealEstoquePageRoutingModule {}
