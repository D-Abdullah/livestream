import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { CommonService } from "./common.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ToastrService } from "ngx-toastr";

import { DatePipe } from "@angular/common";
import { UserService } from "./user.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  public _lang_code =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";

  public message: any = null;
  public _Urlnotifications: string = "";
  public NotificationsList: any = [];
  public getUnReadNotificationCount: any;

  constructor(
    private common: CommonService,
    private http: HttpClient,
    private toastrService: ToastrService,
    public datepipe: DatePipe,
    public userServ: UserService,
    private router: Router
  ) {
    this._Urlnotifications =
      this.common._hostName + "notifications.php?action=";
  }

  setDeviceToken(deviceToken) {
    let body = {
      token: deviceToken,
      type: "web",
      lang_code: this._lang_code,
    };
    return this.http.post(this._Urlnotifications + "setDeviceToken", body);
  }




  sendNotficationAfeterCompleteSharingTest(student_tests_answers_id: any) {
    let body = {
      student_tests_answers_id: student_tests_answers_id
    };
    return this.http.post(this._Urlnotifications + "SendNotifcationAfterِCompleteSharingTest", body);
  }




  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          // console.log("Hurraaa!!! we got the token.....");
          // console.log(currentToken);
          localStorage.setItem("deviceToken", currentToken);
          this.setDeviceToken(currentToken).subscribe((data) => {
            // console.log("fb-token device", data);
          });
        } else {
          // console.log(
          //   "No registration token available. Request permission to generate one."
          // );
        }
      })
      .catch((err) => {
        //console.log("An error occurred while retrieving token. ", err);
      });
  }
  listen() {
    let latestNotification = {};



    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      //console.log("Message received. ", payload);
      this.message = payload;

      this.userServ.getNotificationsList().subscribe((data) => {
        let newList = data.data.notifications;
        this.NotificationsList = newList;
        //console.log("after list sss", this.NotificationsList);

        latestNotification = this.NotificationsList[0];
        //console.log("Latest Message", latestNotification);

        let contentHtml = `<div class="toast-class-custom1"><div class="img-container"><img width="50px" height="50px" src="${this.common._ImageUrl}users/${latestNotification["sender_img"]}" /></div><div><span>${latestNotification["content"]}</span></div></div>`;
        //console.log("contentHTML", contentHtml);

        this.toastrService
          .info(
            // latestNotification["content"],
            contentHtml,
            latestNotification["sender_full_name"],
            {
              timeOut: 5000,
              enableHtml: true,
            }
          )
          .onTap.pipe()
          .subscribe(() =>
            this.goToNotification(
              latestNotification["type"],
              latestNotification["redirect_data"]
            )
          );


        this.getUnReadNotificationCount =
          parseInt(this.getUnReadNotificationCount) + 1;
      });





      // let nowDate = this.datepipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
      // //console.log("DATE :", nowDate);

      // let notificationObj = {
      //   content: this.message.notification.body,
      //   sender_full_name: this.message.notification.title,
      //   is_push: this.message.data.push == "true" ? "1" : "0",
      //   is_read: "0",
      //   id: this.message.data.id,
      //   date_added: nowDate,
      // };

      // this.NotificationsList.unshift(notificationObj);

      // this.getUnReadNotificationCount =
      //   parseInt(this.getUnReadNotificationCount) + 1;

      // //console.log("NOTIFICATION LIST :", this.NotificationsList);
      // //console.log("NOTIFICATION count :", this.getUnReadNotificationCount);
    });
  }

  delete(id) {
    // //console.log("Notification List Before Delete :", this.NotificationsList);

    this.http
      .delete(
        this._Urlnotifications + "deleteNotification" + "&notification_id=" + id
      )
      .subscribe((response) => {
        if (response["success"]) {
          this.userServ.getNotificationsList().subscribe((data) => {
            // //console.log("after delete", data.data.notifications);
            let notificationList = data.data.notifications;
            this.NotificationsList = notificationList;
            this.getUnReadNotificationCount =
              this.getUnReadNotificationCount - 1;
            // //console.log(
            //   "New Counter :",
            //   this.getUnReadNotificationCount
            // );
          });
        }
      });
  }

  goToNotification(type, redirectData) {
    console.log("Notification Type is :", type);
    //console.log("Notification Data is :", redirectData);
    if (
      type == "addMemberToGroup" ||
      type == "joinGroupRequest" ||
      type == "exitGroup" ||
      type == "acceptJoinGroupRequest" ||
      type == "rejectJoinGroupRequest"


    ) {
      //console.log("Going to group");
      let groupId = redirectData.group_id;
      this.router.navigateByUrl("group/" + groupId);
    } else if (type == "shareTestOnGroup" || type == "addNewPost" ||
      type == "shareMeetOnGroup") {
      let post_id = redirectData.post_id;
      let group_id = redirectData.group_id;
      //console.log("Going to post");

      this.router.navigate(["/postDetails", group_id, post_id]);

    }

    else if (type == "shareMeetForStudent") {

      this.router.navigate(["/meeting", redirectData.meeting_serial]);

    }




    else if (

      type == "shareTestForStudent"

    ) {
      let testId = redirectData.test_id;
      //console.log("Goint To Test");
      this.router.navigate(["/studentExam", testId, redirectData.share_id]);

    } else if (type == "testFinished") {
      let student_tests_answers_id = redirectData.student_tests_answers_id;
      let testId = redirectData.test_id;

      //console.log("Goint To testFinished");
      this.router.navigate(["/SolvedExam", testId, student_tests_answers_id]);

    } else if (type == "testCorrected") {
      //console.log("Goint To testCorrected");
      let student_tests_answers_id = redirectData.student_tests_answers_id;
      let testId = redirectData.test_id;
      this.router.navigate(["/examResult", testId, student_tests_answers_id]);
    } else if (
      type == "subscriptionTermination2days" ||
      type == "subscriptionTermination7days"
    ) {
      //console.log("Goint To Prices");
      this.router.navigateByUrl("subscription");
    } else {
      //console.log("NOT Going to group");
    }
  }
}
