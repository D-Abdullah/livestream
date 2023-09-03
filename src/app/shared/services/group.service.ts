import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: "root",
})
export class GroupService {
  public _Urlgroups: string = "";
  public _lang_code =
    localStorage.getItem("CurrentLang") != null
      ? localStorage.getItem("CurrentLang")
      : "ar";


  @Output() progressEmit = new EventEmitter<any>();
  constructor(private common: CommonService, private http: HttpClient) {
    this._Urlgroups = this.common._hostName + "groups.php?action=";
  }

  addGroup(groupInfo: any) {
    let body = {
      name: groupInfo.title,
      description: groupInfo.description ? groupInfo.description : '',
    };
    return this.http.post(this._Urlgroups + "addGroup", body);
  }

  getGroupDetails(group_id: any) {
    return this.http.get(
      this._Urlgroups + "getGroupDetails&p_group_id=" + group_id
    );
  }

  getMyGroupsByParams(start = 0, itemsPerPage = 50, searchKey = "") {
    return this.http.get(
      this._Urlgroups +
      "getMyGroupsByParams&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey
    );
  }

  getGroupsByParams(start = 0, itemsPerPage = 50, searchKey = "") {
    return this.http.get(
      this._Urlgroups +
      "getGroupsByParams&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey
    );
  }

  getPostsByParams(
    start = 0,
    itemsPerPage = 50,
    group_id: any,
    searchKey = ""
  ) {
    return this.http.get(
      this._Urlgroups +
      "getPostsByParams&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey +
      "&group_id=" +
      group_id
    );
  }

  getJoinRequestsByParams(
    start = 0,
    itemsPerPage = 50,
    group_id: any,
    searchKey = ""
  ) {
    return this.http.get(
      this._Urlgroups +
      "getJoinRequestsByParams&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey +
      "&group_id=" +
      group_id
    );
  }

  acceptJoinRequest(reqID, gpID) {
    let body = {
      request_id: reqID,
      group_id: gpID,
    };
    return this.http.post(this._Urlgroups + "acceptJoinRequest", body);
  }


  progessEmitEvent(progress) {
    this.progressEmit.emit(progress);
  }


  rejectJoinRequest(reqID, gpID) {
    let body = {
      request_id: reqID,
      group_id: gpID,
    };
    return this.http.post(this._Urlgroups + "rejectJoinRequest", body);
  }

  deleteJoinRequest(group_id: any) {
    return this.http.delete(
      this._Urlgroups + "deleteJoinRequest&p_group_id=" + group_id
    );
  }

  joinRequest(gpID) {
    let body = {
      p_group_id: gpID,
    };
    return this.http.post(this._Urlgroups + "joinRequest", body);
  }

  deletePost(post_id: any) {
    return this.http.delete(this._Urlgroups + "deletePost&post_id=" + post_id);
  }

  exitFromGroup(gpID) {
    let body = {
      group_id: gpID,
    };
    return this.http.post(this._Urlgroups + "exitFromGroup", body);
  }

  deleteMemberFromGroup(student_id: any, group_id: any) {
    return this.http.delete(
      this._Urlgroups +
      "deleteMemberFromGroup&group_id=" +
      group_id +
      "&student_id=" +
      student_id
    );
  }

  searchStudentsForAddInGroup(
    start = 0,
    itemsPerPage = 50,
    group_id: any,
    searchKey = ""
  ) {
    return this.http.get(
      this._Urlgroups +
      "searchStudentsForAddInGroup&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey +
      "&group_id=" +
      group_id
    );
  }

  getGroupMembersByParams(
    start = 0,
    itemsPerPage = 50,
    searchKey = "",
    p_group_id = '',
    subject_id = '',
    report = 0,
    sort_type='desc',
    sort_by='id'
  ) {
    return this.http.get(
      this._Urlgroups +
      "getGroupMembersByParams&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&searchKey=" +
      searchKey + "&p_group_id=" + p_group_id + "&subject_id=" + subject_id
      + "&report=" + report+ "&sort_by=" + sort_by+ "&sort_type=" + sort_type
    );
  }

  addMemberToGroup(student_id, gpID) {
    let body = {
      student_id: student_id,
      group_id: gpID,
    };
    return this.http.post(this._Urlgroups + "addMemberToGroup", body);
  }

  editGroup(editGroupData) {
    let body = {
      group_id: editGroupData.id,
      name: editGroupData.name,
      description: editGroupData.description,
      image: editGroupData.image,
    };
    return this.http.post(this._Urlgroups + "editGroup", body);
  }

  editPost(editPostData) {
    let body = {
      post_id: editPostData.post_id,
      content: editPostData.content,
      attachments: editPostData.attachments,
      can_download_attachements: editPostData.can_download_attachements


    };
    return this.http.post(this._Urlgroups + "editPost", body);
  }

  deleteGroup(group_id: any) {
    return this.http.delete(
      this._Urlgroups + "deleteGroup&group_id=" + group_id
    );
  }

  addPost(postData) {
    let body = {
      group_id: postData.group_id,
      content: postData.content,
      attachments: postData.attachments,
      can_download_attachements: postData.can_download_attachements
    };
    return this.http.post(this._Urlgroups + "addPost", body);
  }

  getPostDetails(postId: any) {
    return this.http.get(
      this._Urlgroups +
      "getPostDetails" +
      "&post_id=" +
      postId
    );
  }
}
