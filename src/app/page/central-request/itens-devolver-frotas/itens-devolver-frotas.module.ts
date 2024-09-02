import { NgModule,Component } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { ItensDevolverFrotasPageRoutingModule } from './itens-devolver-frotas-routing.module';
import { ItensDevolverFrotasPage } from './itens-devolver-frotas.page';
import {SharedModules} from '@components/components.module';


@NgModule({
  imports: [
    IonicModule,
    ItensDevolverFrotasPageRoutingModule,
    SharedModules
  ],
  declarations: [ItensDevolverFrotasPage]
})
export class ItensDevolverFrotasPageModule {}
