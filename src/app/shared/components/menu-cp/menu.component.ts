import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
import { Uteis } from '@core/Uteis';
@Component({
    selector: 'menu-root',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
    standalone: false
})
export class MenuComponent {
  userName: String = null;
  constructor(private menu: MenuController,private router:Router,private store:Store) {}
  openFirst() {
    this.userName = this.store.selectSnapshot(AuthUser.getUserName)
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  redirect(route){
    this.router.navigate([ `/tabs/${route}`]);
    this.menu.close()
  }
  exit(){
    this.menu.close()

    setTimeout(() =>{
      Uteis.ZerarLogin(this.store);
      this.router.navigate([ `/tabs/login`]);
    },200)

  }
}
