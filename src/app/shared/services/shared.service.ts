import { HttpEventType } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() startVideoRecordEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startVoiceRecordEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() VideoRecordFileEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() NewVideosEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() setNewVoiceEvent: EventEmitter<any> = new EventEmitter<any>();

  http: any;
  commonService: any;
  ngZone: any;
  type: string;
  folderName: string;
  files: any;
  constructor() { }


  startRecordVedio(recodedStart: boolean) {
    this.startVideoRecordEvent.emit(recodedStart);
  }


  startRecordVoice(recodedStart: boolean) {
    this.startVoiceRecordEvent.emit(recodedStart);
  }

  VideoRecordFile(data: any) {
    // this.VideoRecordFileEvent.emit({});
    this.VideoRecordFileEvent.emit(data);
  }

  setNewVideos(data: any) {
    this.NewVideosEvent.emit(data);
  }

  setNewVoice(data: any) {
    this.setNewVoiceEvent.emit(data);
  }

  RandomID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLowerCase();
  }

  // console.log(makeid(5));


}


