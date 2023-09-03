import { Injectable, Inject, EventEmitter, Output } from "@angular/core";

import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpInterceptor } from "@angular/common/http";
import { Title, Meta } from "@angular/platform-browser";
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { stringify } from "@angular/compiler/src/util";
// import { type } from 'os';

declare var jquery: any;
declare var $: any;

import * as bcrypt from "bcryptjs";
import { UserService } from "./user.service";
import { ToastrService } from "ngx-toastr";

export class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(function (file: any) {
      return new Promise((resolve, reject) => {
        var myReader = new FileReader();
        myReader.onloadend = (e) => {
          resolve({ default: myReader.result });
        };

        myReader.readAsDataURL(file);
      });
    });
  }
}

interface Script {
  src: string;
  loaded: boolean;
}

@Injectable({
  providedIn: "root",
})
export class CommonService {
  // /live
  public _hostName = "https://api.testat-app.com/app-api-v8/";
  public _ImageUrl = "https://api.testat-app.com/uploads/";
  public _ImageUrlQuestionsAttachments = "https://api.testat-app.com/uploads/questions_attachments/";
  public testatSiteUrl = "https://testat-app.com/";
  public _cronJob = "https://api.testat-app.com/api-const/";
  public _hostNamePrint = "https://api.testat-app.com/print/";
  public fawryUrl = "https://api.testat-app.com/api-const-new/fawry-redirect.php?action=";
  public _meetingUrl = "https://testat-app.com/meeting/";

  // develop
  // public _cronJob = "https://develop.testat-app.com/api/api-const/";
  // public _hostName = "https://develop.testat-app.com/api/app-api-v8/";
  // public _ImageUrl = "https://develop.testat-app.com/api/uploads/";
  // public testatSiteUrl = "https://develop.testat-app.com/";
  // public _hostNamePrint = "https://develop.testat-app.com/print/";
  // public _meetingUrl = "https://testat-app.com/meeting/";
  // public fawryUrl = "https://develop.testat-app.com/api/api-const-new/fawry-redirect.php?action=";

  public attatchmentUrl = this._ImageUrl + "questions_attachments/";

  public tests_printable = this._ImageUrl + "tests_printable/";
  public AnswerattatchmentUrl = this._ImageUrl + "answers_attachments/";
  public _scripts: Script[] = [];
  @Output() changeCartUpdated: EventEmitter<any> = new EventEmitter();
  // public loaderimg='assets/img/loading-1.gif';
  public loaderimg = "assets/img/loader2.svg";
  public _lang_code =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";

  public last_metting_id: any;
  public lastMeetingId: any = "";
  public_url = "web-api/common.php?action=";
  private _UrlSubjects: string = this._hostName + "subjects.php?action=";
  public _Urlcommon: string = this._hostName + "common.php?action=";
  private _UrlPages: string = this._hostName + "pages.php?action=";
  private _UrlUsers: string = this._hostName + "users.php?action=";
  private _subscriptions: string = this._hostName + "subscriptions.php?action=";
  private _meets: string = this._hostName + "meets.php?action=";
  private _subscription_redirect: string = this.fawryUrl;
  public country_id = localStorage.getItem("country_id");
  innerWidth: number;
  downloadLink: string;
  constructor(
    private router: Router, 
    private http: HttpClient,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {}

  getPageStaticInfoMeta(pageId: number) {
    return this.http.get<any>(
      this._UrlPages + "getPageStaticInfoMeta&page_id=" + pageId
    );
  }

  getDateTimetoSetFormat() {
    let da = new Date();
    let d: any = da.getDate();
    let m: any = da.getMonth() + 1;
    let y = da.getFullYear();

    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }

    let fullDate = y + "-" + m + "-" + d;
    return fullDate;
  }

  changeSource(event) {
    let fallback_path = "assets/img/avatar.png";
    event.target.src = fallback_path;
  }

  getMobileOperatingSystem() {
    this.innerWidth = window.innerWidth;
    //console.log("WIDTH OF SCREEN IS = ", this.innerWidth);

    var userAgent =
      navigator.userAgent || navigator.vendor || (<any>window).opera;

    // Windows Phone must come first because its UA also contains "Android"
    // if (/windows phone/i.test(userAgent)) {

    //     return "Windows Phone";
    // }

    // if (/android/i.test(userAgent)) {
    //   downloadLink =
    //     "https://play.google.com/store/apps/details?id=app.zahra.egypt";
    //     return downloadLink;
    // }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !(<any>window).MSStream) {
      this.downloadLink = "https://www.apple.com/eg/app-store/";
      return this.downloadLink;
    } else {
      this.downloadLink =
        "https://play.google.com/store/apps/details?id=app.zahra.egypt";
      return this.downloadLink;
    }
    // return "Android";
  }

  copyToClipboard(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    //console.log('asdasd')
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastrService.success(this.translateService.instant('L_copeDone'))
  }

  encodeString(str) {
    let encryptedString = str + "5R6XD*C$";
    encryptedString = bcrypt.hashSync(encryptedString);
    encryptedString = btoa(encryptedString);

    // encryptedString = encodeURIComponent(encryptedString);
    return encryptedString;
  }
  encodeString1(str) {
    let encryptedString = str + "5R6XD*C$2155";
    // encryptedString = bcrypt.hashSync(encryptedString);
    encryptedString = btoa(encryptedString);

    // encryptedString = encodeURIComponent(encryptedString);
    return encryptedString;
  }

  decodeString(encryptedString: string) {
    const decodedString = atob(encryptedString);
    const originalString = decodedString.replace("5R6XD*C$2155", "");
    return originalString;
  }

  encodeTestId(str) {
    // var encoded = "";
    str = str + "5R6XD*C$";

    str = btoa(str);
    // str = btoa(str);
    // for (let i = 0; i < str.length; i++) {
    //   var a = str.charCodeAt(i);
    //   var b = a ^ 10; // bitwise XOR with any number, e.g. 123
    //   encoded = encoded + String.fromCharCode(b);
    // }
    // encoded = btoa(encoded);
    return str;
  }

  generateTestPDF(test_id: any) {
    let hashid = this.encodeTestId(test_id);
    let URL = this._hostNamePrint + "print.php?id=" + hashid;
    window.open(URL, "_blank");
  }

  playErrorAudio() {
    let audio = new Audio();
    audio.src = "assets/error.mp3";
    audio.load();
    audio.play();
  }

  playSuccessAudio() {
    let audio = new Audio();
    audio.src = "assets/success.mp3";
    audio.load();
    audio.play();
  }

  getHomeSlider(type = "slide ") {
    return this.http.get<any>(this._Urlcommon + "getAllSliders&type=" + type);
  }

  getAllfrequentlQuestions() {
    return this.http.get<any>(this._Urlcommon + "getAllFrequentlQuestions");
  }

  limitString(txt: string, txtLength: number) {
    if (txt?.length > txtLength) {
      const str = txt.substring(0, txtLength);
      return str + " ...";
    } else {
      return txt;
    }
  }

  getAllCountries() {
    return this.http.get<any>(this._Urlcommon + "getAllCountries");
  }

  getAllStageWithSubjectsForHomePage() {
    return this.http.get<any>(
      this._Urlcommon + "getAllStageWithSubjects&country_id=" + "1"
    );
  }

  getStageDetailsWithSubjects(stage_id: any) {
    return this.http.get<any>(
      this._Urlcommon + "getStageDetailsWithSubjects&stage_id=" + stage_id
    );
  }
  getAllSubscriptionCosts(stage_id = "") {
    return this.http.get<any>(
      this._subscriptions +
        "getAllSubscriptionCosts&country_id=" +
        "1" +
        "&stage_id=" +
        stage_id
    );
  }

  getMySubscriptionCosts() {
    return this.http.get<any>(this._subscriptions + "getMySubscriptionCosts");
  }

  getSubscriptionVideos() {
    return this.http.get<any>(this._subscriptions + "getSubscriptionVideos");
  }

  getMySubscriptionLog(start = 0, itemsPerPage = 50) {
    return this.http.get<any>(
      this._subscriptions +
        "getMySubscriptionLog&start=" +
        start +
        "&itemsPerPage=" +
        itemsPerPage
    );
  }

  getSubscriptionCostSteps() {
    return this.http.get<any>(this._subscriptions + "getSubscriptionCostSteps");
  }

  getSubscriptionCostContent() {
    return this.http.get<any>(
      this._subscriptions + "getSubscriptionCostContent"
    );
  }

  renewSubscription(renewSubscriptiondata: any) {
    
    console.log('renewSubscriptiondata',renewSubscriptiondata);
    

    if(renewSubscriptiondata.type == 'fawry') {
      let body = {
        payment_type: renewSubscriptiondata.type,
        subscription_id: renewSubscriptiondata.id,
        semester: renewSubscriptiondata.semester,
      };

      return this.http.post(
        this._subscriptions + "renewSubscription",
        JSON.stringify(body)
      );
    }else{
      let body = {
        payment_type: renewSubscriptiondata.type,
        subscription_id: renewSubscriptiondata.id,
        semester: renewSubscriptiondata.semester,
        wallet_phone_number: renewSubscriptiondata.wallet_phone_number,
        email: renewSubscriptiondata.email,
      };

      return this.http.post(
        this._subscriptions + "renewSubscription",
        JSON.stringify(body)
      );
    }
 
    

    
  }

  createMeet(createMeetdata: any) {
    let body = {
      meeting_serial: createMeetdata.meeting_serial
        ? createMeetdata.meeting_serial
        : "",
      is_paid: createMeetdata.is_paid ? createMeetdata.is_paid : false,
      title: createMeetdata.title ? createMeetdata.title : "",
      price: createMeetdata.price ? createMeetdata.price : 0,
      is_scheduled: createMeetdata.is_scheduled
        ? createMeetdata.is_scheduled
        : false,
      scheduled_date: createMeetdata.scheduled_date
        ? createMeetdata.scheduled_date
        : "",
    };

    return this.http.post(this._meets + "createMeet", JSON.stringify(body));
  }

  shareMeet(shareData: any) {
    let body = {
      message: shareData.content,
      meet_id: shareData.meet_id,
      students: shareData.students,
      groups: shareData.groups,
      target: shareData.target,
    };

    return this.http.post(this._meets + "shareMeet", JSON.stringify(body));
  }

  getMeetsByParams(start: any = 0, itemsPerPage: any = 20) {
    return this.http.get<any>(
      this._meets +
        "getMeetsByParams" +
        "&start=" +
        start +
        "&itemsPerPage=" +
        itemsPerPage
    );
  }

  getMeetDetails(meeting_serial: any) {
    return this.http.get<any>(
      this._meets + "getMeetDetails" + "&meeting_serial=" + meeting_serial
    );
  }

  paidMeet(meet_id: any) {
    let body = {
      meet_id: meet_id,
    };

    return this.http.post(this._meets + "paidMeet", JSON.stringify(body));
  }

  sendMailContactUs(sendMailContactUs: any) {
    return this.http.post(
      this._Urlcommon + "sendMailContactUs",
      JSON.stringify(sendMailContactUs)
    );
  }

  getAllContactInfo() {
    return this.http.get<any>(this._Urlcommon + "getAllContactInfo");
  }

  checkFawryPaymentStauts(user_id: any) {
    return this.http.get<any>(
      this._subscription_redirect + "checkFawryPaymentStauts&user_id=" + user_id
    );
  }

  getAllSocialMedia() {
    return this.http.get<any>(this._Urlcommon + "getAllSettings");
  }

  getOnePageById(pagId: any) {
    return this.http.get<any>(
      this._UrlPages + "getPageDetails" + "&page_id=" + pagId
    );
  }

  getAllStages() {
    return this.http.get<any>(
      this._Urlcommon + "getAllStages" + "&country_id=" + this.country_id
    );
  }
  getAllClasses(stage_id: any) {
    return this.http.get<any>(
      this._Urlcommon + "getAllGradesWithSpecialize" + "&stage_id=" + stage_id
    );
  }

  getAllSubjectSpecialize(grade_id: any, specialize_id: any) {
    return this.http.get<any>(
      this._UrlSubjects +
        "getSubjectsByParams" +
        "&grade_id=" +
        grade_id +
        "&specialize_id=" +
        specialize_id
    );
  }

  // getAllSubjects(grade_id:any){
  //   return this.http.get<any>(this._UrlSubjects +'getSubjectsByParams'+'&grade_id='+grade_id+'&specialize_id=');
  // }

  getAllSubjects(grade_id: any, specialize_id?: any) {
    let params = grade_id ? "&grade_id=" + grade_id : " ";
    params += specialize_id ? "&specialize_id=" + specialize_id : " ";
    return this.http.get<any>(
      this._UrlSubjects + "getSubjectsByParams" + params
    );
  }

  getInfoByIds(subject_id = "", unit_id = "", lesson_id = "") {
    return this.http.get<any>(
      this._UrlSubjects +
        "getInfoByIds&subject_id=" +
        subject_id +
        "&unit_id=" +
        unit_id +
        "&lesson_id=" +
        lesson_id
    );
  }

  getUserByParams(
    searchKey: any,
    start: any,
    itemsPerPage: any,
    country_id: any
  ) {
    return this.http.get<any>(
      this._UrlUsers +
        "getAllStudentsByParams" +
        "&start=" +
        start +
        "&itemsPerPage=" +
        itemsPerPage +
        "&searchKey=" +
        searchKey +
        "&country_id=" +
        country_id
    );
  }

  onlyNumberKey(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
