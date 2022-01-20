import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        path: 'consulta-estoque',
        loadChildren: () => import('../consulta-estoque/consulta-estoque.module').then( m => m.ConsultaEstoquePageModule),
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
