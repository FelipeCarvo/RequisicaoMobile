import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'list-insumos',
    loadChildren: () => import('./page/central-request/list-insumos/list-insumos.module').then( m => m.ListInsumosPageModule)
  },

];
@NgModule({
  imports: [
    BrowserModule, CommonModule,RouterModule.forRoot(routes, {  onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
