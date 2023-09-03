// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { HttpClient, HttpInterceptor } from '@angular/common/http';
// import { HttpResponse, HttpHeaders } from '@angular/common/http';
// import { CommonService } from './common.service';
// import { environment } from '../../../environments/environment';
// const state = {
//   checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {

//   public _ordersUrl = this.common._hostName +'web-api/orders.php?action=';
//   public _invoicesUrl = this.common._hostName +'web-api/invoices.php?action=';

//   constructor(private router: Router, private http:HttpClient, private common: CommonService) { }

//   addOrder(data){
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
//       let body=JSON.stringify(data)
//     return this.http.post<any>(this._ordersUrl + 'addOrder',body,{ 'headers': headers });
//   }
//   addInvoice(data){
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
//       let body=JSON.stringify(data)
//     return this.http.post<any>(this._invoicesUrl + 'addInvoice',body,{ 'headers': headers });
//   }

//  deleteOrder(data){
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

//       let body=JSON.stringify(data)
//     return this.http.post<any>(this._ordersUrl + 'deleteOrder',body,{ 'headers': headers });
//   }
//  deleteInvoice(data){
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

//       let body=JSON.stringify(data)
//     return this.http.post<any>(this._invoicesUrl + 'deleteInvoice',body,{ 'headers': headers });
//   }

//   getMyOrders(){
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


//     return this.http.get<any>(this._ordersUrl + 'getOrders&start=0'+'&aItemsPerPage='+500+'&searchDateFrom=&searchDateTo=&searchStatus=',{ 'headers': headers });
//   }
//    getMyInvoices(){
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

//     return this.http.get<any>(this._invoicesUrl + 'getInvoices&start=0'+'&aItemsPerPage='+500+'&searchDateFrom=&searchDateTo=&searchStatus=&searchId=',{ 'headers': headers });
//   }

//   getOrderDetails(order_id){

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
//     return this.http.get<any>(this._ordersUrl + 'getOneOrderDetails&order_id='+order_id,{ 'headers': headers });
//   }

//   getOneInvoice(invoice_id){
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
//     return this.http.get<any>(this._invoicesUrl + 'getOneInvoice&invoice_id='+invoice_id+'&front-lang='+localStorage.getItem('front-lang'),{ 'headers': headers });
//   }

//   // Get Checkout Items
//   public get checkoutItems(): Observable<any> {
//     const itemsStream = new Observable(observer => {
//       observer.next(state.checkoutItems);
//       observer.complete();
//     });
//     return <Observable<any>>itemsStream;
//   }

//   // Create order
//   public createOrder(product: any, details: any, orderId: any, amount: any) {
//     var item = {
//         shippingDetails: details,
//         product: product,
//         orderId: orderId,
//         totalAmount: amount
//     };
//     state.checkoutItems = item;
//     localStorage.setItem("checkoutItems", JSON.stringify(item));
//     localStorage.removeItem("cartItems");
//     this.router.navigate(['/shop/checkout/success', orderId]);
//   }

// }
