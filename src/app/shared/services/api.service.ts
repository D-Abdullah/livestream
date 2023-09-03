import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }
  // doGetStage(link?:string) {
  //   return this.http.get(env.apiRoot + link)
  // }

  doGet(PAGE_PHP: string, params?: any) {
    let httpParams: HttpParams = new HttpParams({});
    if (params) {
      for (let param in params) {
        httpParams = httpParams.set(param, params[param])
      }
    }
    return this.http.get<any>(env.apiRoot + PAGE_PHP , { params: httpParams })
  }
 
}
