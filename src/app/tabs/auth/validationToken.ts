import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthUser } from '@core/store/state/auth.state';
@Injectable({
  providedIn: 'root'
})
export class RouterTokenValidation implements CanActivate {
  constructor(public router: Router, public store: Store) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isAuthenticated = this.store.selectSnapshot(AuthUser.isAuthenticated)
    let { url } = state;
    let includes = url.includes('/login');
    if(!isAuthenticated && includes){
      isAuthenticated = !isAuthenticated
    }
    else if(!isAuthenticated && !includes){
      this.router.navigate(['/tabs/login']);
    }
    else if(includes && isAuthenticated){
      this.router.navigate(['/tabs/home']);
    } 
    // if(includes && isAuthenticated)
    return isAuthenticated;
  }
}


