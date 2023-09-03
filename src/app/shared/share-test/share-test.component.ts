import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';
import { GroupService } from '../services/group.service';
import { TestService } from '../services/test.service';
import { UserService } from '../services/user.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-share-test',
  templateUrl: './share-test.component.html',
  styleUrls: ['./share-test.component.scss']
})
export class ShareTestComponent implements OnInit {
  @Input('subjectID') subjectID: any = 0;
  @Input('addshare') addshare: any;

  @Input() shareType: any;
  // @Input('addshareWithStudents') addshareWithStudents: any;
  @Input('addshareWithStudents') addshareWithStudents: ElementRef<HTMLInputElement>;

  @Input('test_id') test_id: any;

  flagLoader = true;
  exercisesUnits: any = {};
  scheduled_date: any
  test_duration: any
  flag = false;
  group: any = {};
  specifiedExercisesFlage = false;
  specifiedUnitTestsFlage = false;
  nodataFlage = false;
  specifiedGeneralTestsFlage = false;
  public userID = localStorage.getItem("clientId");

  flagSherchdata = false;
  searchedGroups: any = [];
  searchedStudents: any = [];
  flagSherch = false;
  groups: any = [];
  students: any = [];
  groupimagePath: any;
  shareData: any = {}
  loaderCreatePost = false;

  scheduling: false;
  testTime: false;
  today: any;
  viewResult: any;

  constructor(private translateServ: TranslateService, private testServ: TestService, public commonServ: CommonService, private userServ: UserService, private tosterServ: ToastrService, private groupServ: GroupService, private modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.today = new Date().toISOString().slice(0, 16);
    this.groupimagePath = this.commonServ._ImageUrl + 'groups/'
    this.getMyGroupsByParams();
    this.getGroupMembersByParams();
    this.viewResult = true;

  }







  // getGroupMembersByParams(key = '') {

  //   this.groupServ.getGroupMembersByParams(0, 20, key, '', this.subjectID).subscribe((res: any) => {
  //     if (res.success && res.data.members.length > 0) {
  //       this.flagSherch = false;
  //       this.searchedStudents = res.data.members;
  //       //console.log('searchedStudents', this.searchedStudents);

  //       for (let i = 0; i < this.searchedStudents.length; i++) {
  //         this.searchedStudents[i].flag = true;
  //       }
  //       this.flagSherchdata = false;
  //     } else {
  //       this.flagSherchdata = true;
  //       this.searchedStudents = [];
  //       this.flagSherch = false;
  //       // //console.log(res.data.groups);

  //     }
  //   })
  // }

  onScroll(): void {
    this.getGroupMembersByParams();
  }


  getGroupMembersByParams(key = '') {
    console.log('on key up get students ', key);
    
    // this.students = [];
    this.flagSherch = true
    if (this.searchedStudents.length <=19) {
      this.groupServ.getGroupMembersByParams(0, 20, key, '', this.subjectID).subscribe((res: any) => {
        if (res.success && res.data.members.length > 0) {
          this.flagSherch = false;
          this.searchedStudents = res.data.members;
          //console.log('searchedStudents', this.searchedStudents);

          for (let i = 0; i < this.searchedStudents.length; i++) {

            if (this.students.length > 0) {
              let index2 = this.students.map(function (item) {
                return item.student_id
              }).indexOf(this.searchedStudents[i].student_id);
              if (index2 > -1) {
                this.searchedStudents[i].flag = false
              } else {
                this.searchedStudents[i].flag = true
              }

            } else {
              this.searchedStudents[i].flag = true
            }


          }
          this.flagSherchdata = false;
        } else {
          this.flagSherchdata = true;
          this.searchedStudents = [];
          this.flagSherch = false;
          // //console.log(res.data.groups);

        }
      })
    } else {
      this.groupServ.getGroupMembersByParams(this.searchedStudents.length, 20, key, '', this.subjectID).subscribe((res: any) => {
        if (res.success) {
          this.flagSherch = false;
          // this.searchedStudents = res.data.members;
          //console.log('searchedStudents', this.searchedStudents);
          if(res.data.members.length > 0){
            for (let i = 0; i < res.data.members.length; i++) {
              this.searchedStudents.push(res.data.members[i]);
            }
  
  
  
            for (let i = 0; i < this.searchedStudents.length; i++) {
              // this.searchedStudents[i].flag = true;
  
              // if (this.searchedStudents[i].flag) {
              //   this.searchedStudents[i].flag = false
              // } else {
              //   this.searchedStudents[i].flag = true
              // }
              if (this.students.length > 0) {
                let index2 = this.students.map(function (item) {
                  return item.student_id
                }).indexOf(this.searchedStudents[i].student_id);
                if (index2 > -1) {
                  this.searchedStudents[i].flag = false
                } else {
                  this.searchedStudents[i].flag = true
                }
  
              } else {
                this.searchedStudents[i].flag = true
              }
  
  
  
            }
          }
  
          this.flagSherchdata = false;
        } else {
          this.flagSherchdata = true;
          // this.searchedStudents = [];
          this.flagSherch = false;
          // //console.log(res.data.groups);

        }
      })
    }

    //console.log('this.questionList', this.questionList);
  }



  getMyGroupsByParams(key = '') {
    this.groupServ.getMyGroupsByParams(0, 20, key).subscribe((res: any) => {
      //console.log('res.data.groups', res.data);

      if (res.success && res.data.groups.length > 0) {
        this.flagSherch = false;
        this.searchedGroups = res.data.groups;
        for (let i = 0; i < this.searchedGroups.length; i++) {
          this.searchedGroups[i].flag = true;
        }
        this.flagSherchdata = false;
      } else {
        this.flagSherchdata = true;
        this.searchedGroups = [];
        this.flagSherch = false;
        // //console.log(res.data.groups);

      }
    })

  }









  addshareFun(addshare?: any) {
    this.modalService.open(addshare,
      {
        scrollable: true,
        centered: true
      }
    );
  }





  savePost(f: NgForm, addshare, target) {
    var scheduled_date;
    if (this.scheduling) {
      scheduled_date = moment(this.scheduled_date).format("YYYY-MM-DD HH:mm:ss");
    } else {
      scheduled_date = '';
    }


    if (this.testTime) {
      this.shareData.test_duration = this.test_duration;
    } else {
      this.shareData.test_duration = 0;
    }

    this.shareData.scheduled_date = scheduled_date;
    this.shareData.my_test_id = this.test_id;
    this.shareData.show_result_to_student = this.viewResult;

    // return false;
    if (target == 'groups') {
      if (this.groups.length > 0) {
        this.loaderCreatePost = true;
        this.shareData.groups = this.groups;
        this.shareData.students = [];


        this.shareData.target = "groups";
        //console.log(this.scheduled_date);
        //console.log(this.test_duration);

        this.testServ.shareTest(this.shareData).subscribe((res: any) => {
          if (res.success) {
            this.loaderCreatePost = false;

            if (res.data_to_send_notificaion) {
              this.userServ.SendNotifcationAfterShareTestOnGroup(res.data_to_send_notificaion.share_id).subscribe((data: any) => {


              })
            }

            this.tosterServ.success(this.translateServ.instant('share_test_group_done'))

          }
        });



        this.modalService.dismissAll(addshare);
        this.shareData = {}
        this.testTime = false;
        this.scheduling = false;
        this.groups = [];
        this.students = [];


      } else {

        this.tosterServ.warning(this.translateServ.instant('choose_at_least_one_group'))
      }


    } else {
      // && this.shareData.content
      if (this.students.length > 0) {
        this.loaderCreatePost = true;
        this.shareData.groups = [];
        this.shareData.students = this.students;
        this.shareData.target = "students";
        this.testServ.shareTest(this.shareData).subscribe((res: any) => {
          if (res.success) {
            this.loaderCreatePost = false;
            this.tosterServ.success(this.translateServ.instant('share_test_students_done'))


          }

        });



        this.modalService.dismissAll(addshare);
        this.shareData = {}



      } else {

        this.tosterServ.warning(this.translateServ.instant('choose_at_least_one_student'));
      }









    }



  }




  dismissTest(addshare: any) {
    this.modalService.dismissAll(addshare)
  }



  addshareWithStudentsFun(addshareWithStudents: any, test_id: any) {
    this.scheduled_date = 0;
    this.test_duration = '';
    this.test_id = test_id
    this.groups = [];
    this.students = [];
    this.modalService.open(addshareWithStudents,
      {
        scrollable: true,
        centered: true
      }
    );
  }


  addshareFun2(addshare: any, test_id: any) {
    this.scheduled_date = 0;
    this.test_duration = '';
    this.test_id = test_id
    this.groups = [];
    this.students = [];

    this.modalService.open(addshare,
      {
        scrollable: true,
        centered: true
      }
    );
  }


  addGroup(groupid, i) {
    this.groups.push({
      "id": groupid
    })
    this.searchedGroups[i].flag = false;
    // //console.log(this.groups);

  }

  addStudent(StdId, i) {
    let index2 = this.students.map(function (item) {
      return item.student_id
    }).indexOf(StdId);
    if (index2 > -1) {

      this.students.splice(index2, 1);

    }

    this.students.push({
      "student_id": StdId
    })

    let index = this.searchedStudents.map(function (item) {
      return item.student_id
    }).indexOf(StdId);
    if (index > -1) {
      this.searchedStudents[index].flag = false;
    }


    //console.log(this.students);

  }


  removeFromStudents(StdId, i) {
    let index = this.students.map(function (item) {
      return item.student_id
    }).indexOf(StdId);
    if (index > -1) {

      this.students.splice(index, 1);

    }
    let index2 = this.searchedStudents.map(function (item) {
      return item.student_id
    }).indexOf(StdId);
    if (index > -1) {
      this.searchedStudents[index2].flag = true;
    }


    // //console.log(this.groups);
  }


  removeFromAdddata(groupid, i) {
    let index = this.groups.map(function (item) {
      return item.id
    }).indexOf(groupid);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
    this.searchedGroups[i].flag = true;
    // //console.log(this.groups);
  }






  onKeyUp(key: string = '', target: string) {

    this.searchedGroups = [];
    this.searchedStudents = [];
    this.flagSherch = true;
    if (target == 'groups') {
      this.getMyGroupsByParams(key);
    }



    if (target == 'students') {
      this.getGroupMembersByParams(key);

    }
  }













}
