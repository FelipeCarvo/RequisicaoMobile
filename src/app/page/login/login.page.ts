import { Component ,OnInit} from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';

@Component({
  selector: 'app-tab1',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit{
  hasUrl: boolean;
  constructor(public store: Store) {
   this.hasUrl = this.store.selectSnapshot(AuthUser.isAuthenticatedURL)
  }
  ngOnInit(){

  }


}
