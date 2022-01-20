import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  hasEditProfile = false;
  constructor() {}
  setEdit(){
    this.hasEditProfile = !this.hasEditProfile;
  }
}
