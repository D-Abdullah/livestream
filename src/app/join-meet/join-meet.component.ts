import {
  Component,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnInit,
  Optional,
  Self,
  SkipSelf,
  ElementRef,
} from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
// import { CommonService } from "../shared/services/common.service";
// import { UserService } from "../shared/services/user.service";
import { ScriptLoaderService } from "../shared/script-loader.service";
import * as moment from "moment";
@Component({
  selector: "app-join-meet",
  templateUrl: "./join-meet.component.html",
  styleUrls: ["./join-meet.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class JoinMeetComponent implements OnInit, AfterViewInit {
  @ViewChild("url") meetingUrl!: ElementRef<HTMLInputElement>;
  fullUrl: string = document.URL;
  localImgUrl: string | undefined;
  stopLoader: boolean = true;
  meetId: any;
  MeetDetail: any = {};
  userdata: any;
  usersubscription: any = {};
  status = true;
  teacherData: any;
  pathImageUrl: any;
  MySubscriptionLog: any = [];
  data: any;
  flagLoader = true;
  renewSubscriptiondata: any = {};
  id: any;
  displayControls = true;
  currentLangue: string | null = "en";
  defaultSettings: any;
  noMeetIdFlag = false;
  MeetDetailFlage = false;
  constructor(
    private clipboard: Clipboard,
    private activatedRoute: ActivatedRoute,
    // public comomenServ: CommonService,
    private tosterServ: ToastrService,
    private modalService: NgbModal,
    // private userServ: UserService,
    private router: Router,
    private Script: ScriptLoaderService
  ) {}
  ngOnInit(): void {
      window as any["stopLoader"] == false;
      
      let handleLoad = setInterval(() => {
      this.stopLoader = window as any["stopLoader"] ;
      if (this.stopLoader) {
        clearInterval(handleLoad);
      }
    }, 20);

    // this.localImgUrl = `${this.comomenServ._ImageUrl}/users/${
    //   JSON.parse(<string>localStorage.getItem("currentUserFront"))?.img
    // }`;

    this.currentLangue = "en";
    if (this.currentLangue == "ar") {
      this.defaultSettings = "assets/js/js/defaultSettings-ar.js";
    }
    if (this.currentLangue == "en") {
      this.defaultSettings = "assets/js/js/defaultSettings-en.js";
    }
  }
  ngAfterViewInit() {
    this.activatedRoute.params.subscribe((parameter: any) => {
      console.log("parameter", parameter);
      // this.meetId = parameter.meetId;
      this.getMeetDetails(this.meetId);
    });
  }

  copyUrl(): void {
    let input: HTMLInputElement = this.meetingUrl.nativeElement;
    input.select();
    navigator.clipboard.writeText(input.value);
    this.tosterServ.success(`success copy invitation url`, "copy invitation");
    return;
  }

  scheduledDate(scheduled_date: any) {
    return moment(scheduled_date).format("hh:mm A");
  }
 


  getMeetDetails(meetId: any) {


    this.MeetDetailFlage = true;
    this.MeetDetail ={"id":"117","teacher_id":"3","meeting_serial":"xzjiwxapurx7mb3p5k85ag","is_paid":"0","title":"Create now","price":"0","is_scheduled":"0","scheduled_date":null,"set_from":"web","date_added":"2023-02-26 14:04:44","owner":true};
    
    
    setTimeout(() => {
      this.fetchAllJs();
    }, 100);
  
    // this.comomenServ.getMeetDetails(meetId).subscribe((res) => {
    //   console.log(res);
    //   if (res.success) {
    //     this.MeetDetailFlage = true;
    //     this.MeetDetail = res.data;
    //     window as any["meetingId"] ==meetId;
    //     window as any["isModerator"] == this.MeetDetail.owner;
        
    //   } else {
    //     this.stopLoader = true;
    //     window as any["stopLoader"] == true;
    //     this.noMeetIdFlag = true;
    //   }
    // });
  }

  fetchAllJs() {
    this.Script.loadScripts("app-join-meet", [
      "assets/js/js/defaultSettings-en.js",
      "assets/js/js/jquery.min.js",
      "assets/js/js/bootstrap.min.js",
      "assets/js/js/app.min.js",
      "assets/js/js/toastr.min.js",
      "assets/js/js/main.js",
      "assets/js/js/socket.io.min.js",
      "assets/js/js/bundle.min.js",
      "assets/js/js/easytimer.min.js",
      "assets/js/js/siofu.min.js",
      "assets/js/js/MultiStreamsMixer.min.js",
      "assets/js/js/opentok-layout.min.js",
      "assets/js/js/canvas-designer-widget.js",
      "assets/js/js/meeting.js",
      // "assets/js/js/widget.js",
      "assets/js/js/pdf.min.js",
    ]);
  }

  meetingPay(addmempers: any, id: any) {
    this.id = id;
    this.modalService.open(addmempers, {
      scrollable: true,
      centered: true,
    });
  }

  renewSubscription(type: any = "fawry") {
    // this.renewSubscriptiondata.type = type;
    // this.renewSubscriptiondata.semester = this.subscription_type_customized

    // this.comomenServ.paidMeet(this.id).subscribe((res: any) => {
    //   if (res.success) {
    //     //console.log(res);
    //     // window.location.href(res.fawryURL);
    //     window.open(res.fawryURL, "_self");
    //   } else {
    //     this.tosterServ.warning(res.message);
    //   }
    //   // //console.log(this.SubscriptionCosts);
    // });
  }
}
function fetchAllJs() {
  throw new Error("Function not implemented.");
}

