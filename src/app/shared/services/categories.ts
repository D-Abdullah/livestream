
// import { Injectable, Inject ,EventEmitter,Output} from '@angular/core';

// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';

// import { HttpClient, HttpInterceptor } from '@angular/common/http';
// import { Title, Meta } from '@angular/platform-browser';
// import { HttpResponse, HttpHeaders } from '@angular/common/http';
// import { TranslateService } from '@ngx-translate/core';
// import {CommonService} from './common.service';
// import { environment } from '../../../environments/environment';
// // import { Http, Headers, RequestOptions } from '@angular/http';

// declare var jquery: any;
// declare var $: any;


// @Injectable({
// 	providedIn: 'root'
// })

// export class CategoriesService {
//     private _url: string = this.common._hostName + 'web-api/services.php?action=';
//   constructor(private router: Router,private common:CommonService, private http:HttpClient) {

//   }


//   retriveData(PAGE_PHP, temp, action) {
//     // const options = new RequestOptions({
//     //   headers: new Headers({
//     //     'Content-Type': 'application/json',
//     //     'Accept': 'application/json',
//     //     'Token': '70f5854a281a51a8108b98696d4ef6d3-70f5854a281a51a8108b98696d4ef6d3'
//     //     // 'Authorization': userInfo.authentication_code,

//     //   })
//     // });

//     // // Building Data in JSON Format
//     // const data = JSON.stringify(Object.assign({ 'date_offeset': moment.tz.guess() }, {}, temp));
//     // const url = this.API_URL + PAGE_PHP + '?action=' + action;
//     // return this.http.post(url, data, options)
//     //   .map(res => res.json())
//     //   .catch(error => Observable.throw(error));
//   }



//   getMainCategories(){


// if(localStorage.getItem("clientToken") !=null && localStorage.getItem("clientToken") !='' ){
//   var headers= new HttpHeaders({
//     'Content-Type': 'application/json',
//     'front-lang': localStorage.getItem('front-lang'),
//     'affiliator-token': environment.affiliator_token,
//     'user-token':localStorage.getItem("clientToken")
//   });
// }else{
//   var headers= new HttpHeaders({
//     'Content-Type': 'application/json',
//     'front-lang': localStorage.getItem('front-lang'),
//     'affiliator-token': environment.affiliator_token,
//   });
// }


//     return this.http.get<any>(this._url + 'getTreeCategories&start=0'+'&aItemsPerPage='+50+'&parent_id='+0,{ 'headers': headers });
//   }

//   getChildCategories(parent_id){
//     if(localStorage.getItem("clientToken") !=null && localStorage.getItem("clientToken") !='' ){
//       var headers= new HttpHeaders({
//         'Content-Type': 'application/json',
//         'front-lang': localStorage.getItem('front-lang'),
//         'affiliator-token': environment.affiliator_token,
//         'user-token':localStorage.getItem("clientToken")
//       });
//     }else{
//       var headers= new HttpHeaders({
//         'Content-Type': 'application/json',
//         'front-lang': localStorage.getItem('front-lang'),
//         'affiliator-token': environment.affiliator_token,
//       });
//     }



//     return this.http.get<any>(this._url + 'getCategories&start=0'+'&aItemsPerPage='+50+'&parent_id='+parent_id,{ 'headers': headers });
//   }


// }
