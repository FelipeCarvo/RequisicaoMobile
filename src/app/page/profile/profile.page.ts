import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
@Component({
  selector: 'app-tab3',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  hasEditProfile = false;
  userName: String = null;
  constructor(
    public navCtrl:NavController,
    private store:Store
  ) {}
  ngOnInit() {
    this.userName = this.store.selectSnapshot(AuthUser.getUserName)
  }
  setEdit(){
    this.hasEditProfile = !this.hasEditProfile;
  }
  onBack(){
    this.navCtrl.back(); 
  }
}
