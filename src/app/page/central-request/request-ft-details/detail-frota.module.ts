import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DetailRequestPageRoutingModule } from './detail-routing-frota.module';
import { DetailRequestPage } from './detail-frota.page';
import {SharedModules} from '@components/components.module';
import { ModalExcluiReqDevPageModule } from './modal-exclui-req-dev/modal-exclui-req-dev.module';
import { ModalAlteraQtdItemPageModule } from './modal-altera-qtd-item/modal-altera-qtd-item.module';


@NgModule({
  imports: [
    IonicModule,
    DetailRequestPageRoutingModule,
    ModalExcluiReqDevPageModule,
    ModalAlteraQtdItemPageModule,
    SharedModules
  ],
  declarations: [DetailRequestPage]
})
export class DetailRequestPageModule {}
