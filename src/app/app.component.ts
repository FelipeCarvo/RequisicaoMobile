import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hiddenMenu:true;
  constructor(private menu: MenuController, private router:Router) {
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd && event.snapshot.children.length == 0))
      .subscribe((event: ActivationEnd) => {
        const { noHeader} = event.snapshot.data;
        this.hiddenMenu = noHeader
       
      });
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
