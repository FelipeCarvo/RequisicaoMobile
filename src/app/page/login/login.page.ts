import { Component ,OnInit} from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
import {opacityAnimationT} from '@services/animation/custom-animation'
@Component({
  selector: 'app-tab1',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  animations: [opacityAnimationT()]
})
export class LoginPage implements OnInit{
  hasUrl: boolean;
  constructor(public store: Store) {
    this.hasUrl = this.store.selectSnapshot(AuthUser.isAuthenticatedURL)
  }
  ngOnInit(){
    console.log('aqui')
   
  }
  updateCp(){
    this.hasUrl = this.store.selectSnapshot(AuthUser.isAuthenticatedURL)
  }
  ionViewDidEnter(){
    this.hasUrl = this.store.selectSnapshot(AuthUser.isAuthenticatedURL)
  }
}
