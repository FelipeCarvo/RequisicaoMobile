import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuFooterComponent } from './menu-footer.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [MenuFooterComponent],
  exports: [MenuFooterComponent]
})
export class MenuComponentFooterModule {}
