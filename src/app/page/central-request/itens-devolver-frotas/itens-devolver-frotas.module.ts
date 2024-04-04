import { NgModule,Component } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { ItensDevolverFrotasPageRoutingModule } from './itens-devolver-frotas-routing.module';
import { ItensDevolverFrotasPage } from './itens-devolver-frotas.page';
import {sharedModules} from '@components/components.module';


@NgModule({
  imports: [
    IonicModule,
    ItensDevolverFrotasPageRoutingModule,
    sharedModules
  ],
  declarations: [ItensDevolverFrotasPage]
})
export class ItensDevolverFrotasPageModule {}
