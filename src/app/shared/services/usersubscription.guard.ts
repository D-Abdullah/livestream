import { CommonService } from './common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UsersubscriptionGuard implements CanActivate {
  usersubscription: any;
  constructor(private userServ: UserService, private commonServ: CommonService, private router: Router, private tostarServ: ToastrService, private translateService: TranslateService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {




    // this.userServ.getUserInfo().subscribe((res: any) => {
    //   if (res.success) {
    //     if (res.data.subscription.is_finished == false) {
    //       this.usersubscription = res.data.subscription;

    //     } else {

    //       this.usersubscription = [];

    //     }

    //   }



    //   if (this.usersubscription.length == 0) {

    //     this.router.navigate(['/subscription']);
    //     return false;
    //   } else {

    //     return true;

    //   }


    // }, err => {


    //   if (err.status == 0) {
    //     this.tostarServ.error(this.translateService.instant('L_errorConnection'));
    //   } else if (err.status == 401) {
    //     let publishData = { 'event_type': 'Unauthenticated' }
    //     this.userServ.publishSomeData(publishData);
    //   } else {
    //     if (err.error.message) {
    //       this.tostarServ.error(err.error.message);
    //     } else {

    //       this.tostarServ.error(this.translateService.instant('L_someErrorHappen'));
    //     }
    //   }





    // });







    let data = this.userServ.userInfo ? this.userServ.userInfo : '';
    //console.log('dsadasdasdasdas',data);

    if (data.id) {
      if (data.subscription.end_date >= this.commonServ.getDateTimetoSetFormat()) {
        //console.log("RouterStateSnapshot");
        return true
      } else {
        this.tostarServ.error(this.translateService.instant('Please subscribe to follow'))
        this.router.navigate(['/Subscriptionsprices']);

      }
    } else {
      this.router.navigate(['/login']);

    }


    return false;








    // return true;
  }

}
