
import { Injectable, Inject, EventEmitter, Output } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;


@Injectable({
  providedIn: "root",
})
export class UserService {
  public maxDate: any;
  public Usertoken: any = false;
  //   @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  private _UrlUsers: string = this.common._hostName + "users.php?action=";
  private _UrlReports: string = this.common._hostName + "reports.php?action=";
  private _UrlSubjects: string = this.common._hostName + "subjects.php?action=";
  private _UrlTests: string = this.common._hostName + "tests.php?action=";
  private _UrlStatistics = this.common._hostName + 'statistics.php?action=';
  private _UrlNotifications: string =
    this.common._hostName + "notifications.php?action=";
  private _Urlupload: string = this.common._hostName + "upload.php?";
  private _Urldownload: string = this.common._hostName + "download.php?";
  public userInfo: any;
  public semester = localStorage.getItem('semester') ? localStorage.getItem('semester') : ''
  public lang_code: any =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";
  public _lang_code =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  @Output() getuserNotifactionInList: EventEmitter<any> = new EventEmitter();

  @Output() getLesson: EventEmitter<any> = new EventEmitter();
  // @Output() publishSomeData: EventEmitter<any> = new EventEmitter();
  private fooSubject = new Subject<any>();

  constructor(
    private router: Router,
    private common: CommonService,
    private http: HttpClient
  ) {

  }

  playAnswerSound(){

    // console.log('play sound user info ', this.userInfo);

    if (this.userInfo.student_settings?.answer_question_sound) {
      let audio = new Audio();
      audio.src = "../../../assets/sound.wav";
      audio.load();
      audio.play();
      audio.volume = 0.5;
    }

    
  }

  editStudentSettings(body: any){
    return this.http.post<any>(
      this._UrlUsers + "editStudentSettings",
      JSON.stringify(body)
    );
  }

  downloadFile(folderName, fileName, fileType) {
    console.log("folderName", folderName);
    console.log("fileName", fileName);
    console.log("fileType", fileType);

    return this.http.get<any>(
      this._Urldownload +
      "folder_name=" + folderName + "&file_name=" +
      fileName +
      "&file_type=" +
      fileType
    );
  }

  getUserInfo() {
    return this.http.get<any>(this._UrlUsers + "getUserInfo");
  }

  getUnReadNotificationNum() {
    // setInterval(() => {
    //   this.getUnReadNotificationNum();
    // }, 10000);

    // //console.log("dddddddddd");

    return this.http.get<any>(
      this._UrlNotifications + "getUnReadNotificationNum"
    );
  }

  getNotificationsList(start = 0, itemsPerPage = 10) {
    return this.http.get<any>(
      this._UrlNotifications +
      "getNotificationsList&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage
    );
  }

  // setInterval(getUnReadNotificationNum,1000);

  lessondata(unitname: any, subID: any, subName: any, unitID: any) {
    this.getLesson.emit({
      unitname: unitname,
      subID: subID,
      subName: subName,
      unitID: unitID,
    });
  }
  getUserInfoDataFromStorage() {
    let parser: any = localStorage.getItem("currentUserFront");
    let data = JSON.parse(parser);
    return data;
  }


  setUserDataToLocalStorage(userInfo: any){
    localStorage.setItem("currentUserFront", JSON.stringify(userInfo));
  }


  setuserdata(res) {
    this.userInfo = res.data;
    if (res.data.authentication_code) {
      localStorage.setItem("clientToken", res.data.authentication_code);

      // console.log('token ', res.data.authentication_code);


    }
    localStorage.setItem("clientId", res.data.id);
    localStorage.setItem("currentUserFront", JSON.stringify(res.data));

  }
  getUserToken() {
    var token: any =
      localStorage.getItem("clientToken") != null
        ? localStorage.getItem("clientToken")
        : "";
    return token;
  }

  // getUsersCounts(){
  //   return this.http.get<any>(this._UrlUsers +'getUsersCounts');

  // }

  getStatisticsData() {
    return this.http.get<any>(this._UrlStatistics + "getStatisticsData");
  }





  deleteMyAccount() {
    return this.http.delete<any>(this._UrlUsers + "deleteMyAccount");
  }



  cheackEmailAndMobile(country_code: any, mobile: any) {
    var body = {
      country_code: country_code,
      mobile: mobile,
    };

    return this.http.post<any>(
      this._UrlUsers + "cheackUserByMobile",
      JSON.stringify(body)
    );
  }


  setSelectedSemester(SelectedSemester) {
    var body = {
      selected_semester: SelectedSemester

    };

    return this.http.post<any>(
      this._UrlUsers + "setSelectedSemester",
      JSON.stringify(body)
    );
  }


  addEditUser(data: any) {
    let body: any = data;
    var token: any = localStorage.getItem("clientToken");
    if (token != null) {
      var headers = new HttpHeaders({
        "Content-Type": "application/json",
        "User-Token": token,
      });
      return this.http.post<any>(
        this._UrlUsers + "addEditUser",
        JSON.stringify(body),
        { headers: headers }
      );
    }
    return this.http.post(this._UrlUsers + "addEditUser", JSON.stringify(body));
  }

  uploadAttachment(formData, fileType = "", uploadFolderName = "") {
    // //console.log(fileType);

    return this.http.post<any>(
      this._Urlupload +
      "uploadFolderName=" +
      uploadFolderName +
      "&file_type=" +
      fileType,
      formData
    );
  }



  uploadAttachmentWithPipe(formData, fileType = "", uploadFolderName = "") {
    // //console.log(fileType);

    return this.http.post<any>(
      this._Urlupload +
      "uploadFolderName=" +
      uploadFolderName +
      "&file_type=" +
      fileType,
      formData
      , {
        observe: 'events', reportProgress: true
      });
  }







  removeMyFileFromServer(file_name = "", folder_name = "") {
    return this.http.delete(this._UrlUsers + "removeMyFileFromServer&file_name=" + file_name + "&folder_name=" + folder_name);
  }


  signUp(data: any) {
    let body: any = data;
    return this.http.post(this._UrlUsers + "signUp", JSON.stringify(body));
  }





  editProfile(data: any) {
    let body: any = data;
    return this.http.post(this._UrlUsers + "editProfile", JSON.stringify(body));
  }
  editStudentsForParent(data: any) {
    let body: any = data;
    return this.http.post(
      this._UrlUsers + "editStudentsForParent",
      JSON.stringify(body)
    );
  }






  restpassword(data: any) {
    let body: any = data;
    return this.http.post(
      this._UrlUsers + "restpassword",
      JSON.stringify(body)
    );
  }










  editTeacherSubjects(data: any) {
    let body: any = data;
    return this.http.post(
      this._UrlUsers + "editTeacherSubjects",
      JSON.stringify(body)
    );
  }
  editPassword(data: any) {
    let body: any = data;
    return this.http.post(
      this._UrlUsers + "editPassword",
      JSON.stringify(body)
    );
  }

  login(data: any) {
    let body = data;
    // //console.log(data);
    return this.http.post(this._UrlUsers + "login", JSON.stringify(body));
  }

  getMySubjects(full_category = '0') {
    return this.http.get(this._UrlSubjects + "getMySubjects&full_category=" + full_category + "&semester=" + this.semester);
  }

  getMyStudents() {
    return this.http.get(this._UrlUsers + "getMyStudents");
  }
  getTeacherSubjects(full_category = '0') {
    return this.http.get(this._UrlSubjects + "getMySubjects&full_category=" + full_category + "&semester=" + this.semester);
  }

  getStudentSubjectsRelatedToTeacher(studentId: any) {
    return this.http.get(
      this._UrlSubjects +
      "getStudentSubjectsRelatedToTeacher" +
      "&student_id=" +
      studentId
    );
  }


  getStudentSubjects(studentId: any) {
    return this.http.get(
      this._UrlSubjects +
      "getStudentSubjects" +
      "&student_id=" +
      studentId
    );
  }



  generateSmsNumber(mobile: any, country_code: any, type?: any) {
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Front-Lang": this._lang_code ? this._lang_code : "ar",
      // 'Front-Lang' : 'en'
    });
    let body = {
      country_code: country_code,
      mobile: mobile,
      type: type,
    };

    return this.http.post(
      this._UrlUsers + "sendSMSMobileCode",
      JSON.stringify(body),
      { headers: headers }
    );
  }
  regenerateCode(phone: any) {
    return this.http.get(this._UrlUsers + "regenerateCode" + "&phone=" + phone);
  }

  checkSMScode(country_code: any, mobile: any, code: any) {
    var body = {
      country_code: country_code,
      mobile: mobile,
      code: code,
    };
    return this.http.post<any>(
      this._UrlUsers + "confirmSignUpCodeMobile",
      JSON.stringify(body)
    );
  }

  getUserSubscriptionDetails() {
    var token: any = localStorage.getItem("clientToken");
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "front-lang": this._lang_code ? this._lang_code : "ar",
      "User-Token": token,
    });
    let id = localStorage.getItem("clientId");
    let body = { user_id: id };
    return this.http.post(
      this._UrlUsers + "getUserSubscriptionDetails",
      JSON.stringify(body),
      { headers: headers }
    );
  }

  getSubjectUnitsAndLessons(subject_id: any) {
    return this.http.get(
      this._UrlSubjects + "getUnitOfSubjectWithLessons&subject_id=" + subject_id
    );
  }

  getUnitOfSubject(subject_id: any) {
    return this.http.get(
      this._UrlSubjects + "getUnitOfSubject&subject_id=" + subject_id
    );
  }

  getSubjectTests(
    subject_id: any = "",
    unit_id: any = "",
    lesson_id: any = "",
    type: any,
    start: any = 0,
    aItemsPerPage: any = 50,
    classification: any = "ready",
    printable?: any
  ) {


    return this.http.get(
      this._UrlTests +
      "getTestsByParams&start=" +
      start +
      "&itemsPerPage=" +
      aItemsPerPage +
      "&subject_id=" +
      subject_id +
      "&type=" +
      type +
      "&unit_id=" +
      unit_id +
      "&lesson_id=" +
      lesson_id +
      "&classification=" +
      classification
      + "&semester=" + this.semester
    );
  }












  getTestsPDFByParamsToPrint(
    category_id = '',
    subject_id: any = "",
    unit_id: any = "",
    lesson_id: any = "",
    classification = 'category',
    type?: any,
    start: any = 0,
    aItemsPerPage: any = 20,
    sort_type: any = 'asc',
    sort_by = 'sort'
  ) {
    return this.http.get(
      this._UrlTests +
      "getTestsPDFByParams&start=" +
      start +
      "&itemsPerPage=" +
      aItemsPerPage +
      "&subject_id=" +
      subject_id +
      "&type=" +
      type +
      "&unit_id=" +
      unit_id +
      "&lesson_id=" +
      lesson_id +
      "&sort_by=" +
      sort_by +
      "&sort_type=" +
      sort_type +
      "&category_id=" +
      category_id +
      "&classification=" +
      classification

    );
  }






  userLoggedIn(name: any, userType: any, userImage: any) {
    this.getLoggedInName.emit([name, userType, userImage]);
  }




  acceptRequestToFollowingStudent(parent_id: any) {
    var body = {
      parent_id: parent_id,
    };
    return this.http.post<any>(
      this._UrlUsers + "acceptRequestToFollowingStudent",
      JSON.stringify(body)
    );
  }

  rejectRequestToFollowingStudent(parent_id: any) {
    var body = {
      parent_id: parent_id,
    };
    return this.http.post<any>(
      this._UrlUsers + "rejectRequestToFollowingStudent",
      JSON.stringify(body)
    );
  }


  // userpublishSomeData(name: any, userType: any, userImage: any) {
  //   this.publishSomeData.emit();
  // }

  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }





  userNotifaction(notificationsList: any) {
    this.getuserNotifactionInList.emit(notificationsList);
  }

  logout(): void {
    let deviceToken = localStorage.getItem("deviceToken");

    let body = {
      token: deviceToken,
    };

    //console.log("LOGOUT BODY", body);

    if (deviceToken) {
      this.http.post(this._UrlUsers + "logOut", body).subscribe((res: any) => {
        //console.log("LOGOUT RESPONSE", res);
        if (res.success) {
          localStorage.clear();
          localStorage.setItem("CurrentLang", this.lang_code);
          this.getLoggedInName.emit(null);
          this.getuserNotifactionInList.emit(null);
          this.Usertoken = false;
          this.router.navigateByUrl("/home");
        }
      }, err => {
        localStorage.clear();
        localStorage.setItem("CurrentLang", this.lang_code);
        this.getLoggedInName.emit(null);
        this.getuserNotifactionInList.emit(null);
        this.Usertoken = false;
        this.router.navigateByUrl("/home");





      });
    } else {
      localStorage.clear();
      localStorage.setItem("CurrentLang", this.lang_code);
      this.getLoggedInName.emit(null);
      this.getuserNotifactionInList.emit(null);
      this.Usertoken = false;
      this.router.navigateByUrl("/home");
    }
  }
  logoutAccount() {
    localStorage.clear();
    localStorage.setItem("CurrentLang", this.lang_code);
    this.getLoggedInName.emit(null);
    this.getuserNotifactionInList.emit(null);
    this.Usertoken = false;
    this.router.navigateByUrl("/home");
  }
  SendNotifcationAfterAddPost(post_id) {
    let body = {
      post_id: post_id,
    };

    return this.http.post(
      this._UrlNotifications + "SendNotifcationAfterAddPost",
      body
    );
  }

  SendNotifcationAfterShareTestOnGroup(share_id) {
    let body = {
      share_id: share_id,
    };

    return this.http.post(
      this._UrlNotifications + "SendNotifcationAfterShareTestOnGroup",
      body
    );
  }



  SendNotifcationAfterShareMeetOnGroup(share_id) {
    let body = {
      share_id: share_id,
    };

    return this.http.post(
      this._UrlNotifications + "SendNotifcationAfterShareMeetOnGroup",
      body
    );
  }

}




