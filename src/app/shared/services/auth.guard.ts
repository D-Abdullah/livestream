import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userServ: UserService,
    private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    var data = this.userServ.getUserInfoDataFromStorage();
    var token = localStorage.getItem('clientToken');

    var isAuthenticated = token ? token : '';
    var userType = data ? data.user_type : '';
    if (isAuthenticated && userType == "student") {
      //console.log(' if');
      return true;

    } else if (isAuthenticated && userType != "student") {


      this.router.navigate(['/Pagenotfound']);

    } else {


      this.router.navigateByUrl('/login');

    }
    return false;
  }

}
