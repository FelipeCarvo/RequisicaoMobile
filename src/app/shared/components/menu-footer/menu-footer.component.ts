import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Logout} from '@core/store/actions/auth.actions';
import { ResetStateInsumos } from '@core/store/actions/insumos.actions';
import {ResetStateReq} from '@core/store/actions/req.actions';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
@Component({
  selector: 'app-menu-footer',
  templateUrl: 'menu-footer.component.html',
  styleUrls: ['menu-footer.component.scss'],
})
export class MenuFooterComponent {
  userName  = null;
  constructor(private menu: MenuController,private router: Router,private store: Store) {}
  openFirst() {
    this.userName = this.store.selectSnapshot(AuthUser.getUserName);
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  redirect(route){
    this.router.navigate([ `/tabs/${route}`]);
    this.menu.close();
  }
  exit(){
    this.menu.close();
    setTimeout(() =>{
      this.store.dispatch(new ResetStateReq());
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new Logout());
      this.router.navigate([ `/tabs/login`]);
    },200);
  }
}
