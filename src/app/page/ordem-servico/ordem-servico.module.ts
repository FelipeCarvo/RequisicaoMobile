import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdemServicoPageRoutingModule } from './ordem-servico-routing.module';
import { OrdemServicoPage } from './ordem-servico.page';
import { CalendarPopoverComponentModule } from '../../components/calendar-popover/calendar-popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdemServicoPageRoutingModule,
    CalendarPopoverComponentModule
  ],
  declarations: [OrdemServicoPage]
})
export class OrdemServicoPageModule {}