import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: "root",
})
export class AdvantagesService {
  public _Urlcommon: string = "";
  public _lang_code =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";
  // public _UrlReports: string = "";

  constructor(private common: CommonService, private http: HttpClient) {
    this._Urlcommon = this.common._hostName + "common.php?action=";
  }

  getAllAdvantages() {
    return this.http.get(this._Urlcommon + "getAllAdvantages");
  }

  //  GET ADVANTAGE DETAILS
  getAdvantagesDetails(id) {
    return this.http.get(
      this._Urlcommon + "getAdvantagesDetails&advantage_id=" + id
    );
  }

  getAllExplanations(){
    return this.http.get(this._Urlcommon + "getAllExplanations");
  }
}
