import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private _UrlStages:string='';
  public _lang_code=localStorage.getItem('CurrentLang') !=null?localStorage.getItem('CurrentLang'):'ar';
  public _Urlcommon: string ;

  constructor(private common:CommonService,private http:HttpClient) {
  this. _UrlStages=this.common._hostName+'stages.php?action=';
   this._Urlcommon = this.common._hostName+ 'common.php?action=';

   
  }



  getStagesWithCountryId(cID = '1')
  {
   return this.http.get<any>(this._Urlcommon +'getAllStages'+'&country_id='+cID);
 }



 





 getSubjectsWithStageIDAndGradeID(stage_id:any,grade_id:any){
  return this.http.get<any>(this._UrlStages +'getSubjectsWithStageIDAndGradeID'+'&lang_code='+this._lang_code+'&stage_id='+stage_id+'&grade_id='+grade_id);
 }



}
