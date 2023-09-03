import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  public _UrlTests: string = '';
  public _lang_code = localStorage.getItem('CurrentLang') != null ? localStorage.getItem('CurrentLang') : 'ar';
  public _UrlReports: string = '';
  public _UrlStatistics: string = '';
  public _ImageUrlCertificate: string = this.common._ImageUrl + 'certifications/';
  constructor(public common: CommonService, private http: HttpClient, public userService: UserService) {
    this._UrlTests = this.common._hostName + 'tests.php?action=';
    this._UrlReports = this.common._hostName + 'reports.php?action=';
    this._UrlStatistics = this.common._hostName + 'statistics.php?action=';
  }


  printCertificate(testAnswerId: string){
    return this.http.get(
      this._UrlTests + 'printCertificate' +'&student_tests_answers_id=' + testAnswerId
    );
  }
  getTestStudentResultForSharingCertificatie(testAnswerId: string, testAnswerIdHashed: string){
    return this.http.get(
      this._UrlTests + 'getTestStudentResultForSharingCertificatie' + '&student_tests_answers_id_hash=' + testAnswerIdHashed + '&student_tests_answers_id=' + testAnswerId
    );
  }


  getOneTestDetails(test_id: any) {
    var token: any = localStorage.getItem('clientToken');
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'User-Token': token
    });
    let id = localStorage.getItem('clientId');
    let body = {
      "user_id": id,
      "test_id": test_id
    };
    return this.http.post(this._UrlTests + 'getOneTestDetails', JSON.stringify(body), { 'headers': headers });

  }

  getWrongsFrequentToPrint(subjectIdHashed: any, subjectId: any, userIdHashed : string, userId: any, studentIdHashed?: any, studentId?: any ){
   
    return this.http.get(
      this._UrlReports +
        "getWrongsFrequentToPrint" +
        "&student_id_hash=" +
        studentIdHashed +
        "&student_id=" +
        studentId +
        "&subject_id_hash=" +
        subjectIdHashed +
        "&subject_id=" +
        subjectId +
        "&user_id_hash=" +
        userIdHashed +
        "&user_id=" +
        userId
    );
  }






  repeateTest(ans_id: any) {
    let body = {
      'student_tests_answers_id': ans_id
    };
    return this.http.post(this._UrlTests + 'repeateTest', JSON.stringify(body));

  }




  finishTestDuration(info: any) {

    return this.http.post(this._UrlTests + 'finishTestDuration', JSON.stringify(info));

  }



  checkTestStatus(test_id: any, share_id: any) {
    return this.http.get(this._UrlTests + 'checkTestStatus&test_id=' + test_id + '&share_id=' + share_id);

  }

  getTestDetails(test_id: any) {
    return this.http.get(this._UrlTests + 'getTestDetails&test_id=' + test_id);
  }


  getTestDetailsPrint(testIdHashed: string, testId: any, userIdHashed: string, userId: any) {
    // console.log("userTokenHashedddd", userTokenHashed);
    
    return this.http.get(
      this._UrlTests +
        'getTestDetailsPrint' + 
        '&test_id_hash=' + 
        testIdHashed +
        '&test_id=' + 
        testId +
        "&user_id_hash=" + 
        userIdHashed +
        "&user_id=" + 
        userId
    );
  }







  getTestToEdit(test_id: any) {
    return this.http.get(this._UrlTests + 'getTestToEdit&my_test_id=' + test_id);
  }



  getAllQ_BankByParams(subID: any, start = 0, itemsPerPage = 50, searchKey = '') {
    return this.http.get(this._UrlTests +
      'getAllQ_BankByParams&subject_id=' + subID
      + '&start=' + start + '&itemsPerPage=' + itemsPerPage + '&searchKey=' + searchKey);

  }


  getAllQuestionsBankByParams(subID: any, start = 0, itemsPerPage = 50, searchKey = '', bank_id = 0) {
    return this.http.get(this._UrlTests +
      'getAllQuestionsBankByParams&subject_id=' + subID
      + '&start=' + start + '&itemsPerPage=' + itemsPerPage + '&searchKey=' + searchKey + '&bank_id=' + bank_id);

  }





  addStudentQuestionAnswer(ans_id: any, question_id: any, option_id: any, answer: any, answer_attachments?: any, questions_match_items?, questions_sort_words?, questions_complete_it?) {

    let body = {
      "student_tests_answers_id": ans_id,
      // "answer": answer
      "question_id": question_id,
      "student_option": option_id,
      "article_answer": answer ? answer : "",
      "answer_attachments": answer_attachments ? answer_attachments : [
        {
          "attachment_type": "",
          "file": ""
        }
      ],
      "questions_sort_words": questions_sort_words ? questions_sort_words : [],
      "questions_complete_it": questions_complete_it ? questions_complete_it : [],
      "questions_match_items": questions_match_items ? questions_match_items : [
        {
          "righte_index1": "",
          "student_answer_item": ""
        }
      ]
    };
    return this.http.post(this._UrlTests + 'setQuestionAnswer', JSON.stringify(body));

  }


  setStudentQuestionAnswer(question_answer) {


    return this.http.post(this._UrlTests + 'setQuestionAnswer', JSON.stringify(question_answer));

  }


  
  toggleFavoriteImportantArticleQuestions(question_id) {
     let body={
      question_id:question_id
     }

    return this.http.post(this._UrlTests + 'toggleFavoriteImportantArticleQuestions', JSON.stringify(body));

  }

  toggleFavoriteExamineQuestions(question_id) {

    let body={
      question_id:question_id
     }
    return this.http.post(this._UrlTests + 'toggleFavoriteExamineQuestions', JSON.stringify(body));

  }

  setQuestionExamineAnswer(question_answer) {


    return this.http.post(this._UrlTests + 'setQuestionExamineAnswer', JSON.stringify(question_answer));

  }


  deleteQuestionExamineAnswer(ans_id: any, question_id: any) {

    return this.http.delete(this._UrlTests + 'deleteQuestionExamineAnswer&question_id=' + question_id);

  }


  deleteQuestionAnswer(ans_id: any, question_id: any) {

    return this.http.delete(this._UrlTests + 'deleteQuestionAnswer&student_tests_answers_id=' + ans_id + '&question_id=' + question_id);

  }


  checkTestEnd(ans_id: any, test_id: any) {

    let body = {
      "student_tests_answers_id": ans_id,
      "test_id": test_id
    };
    return this.http.post(this._UrlTests + 'checkTestEnd', JSON.stringify(body));

  }







  solveTest(testdataofAns) {
    let body = {
      "student_tests_answers_id": testdataofAns.student_tests_answers_id,
      "questions": testdataofAns.questions
    }
    return this.http.post(this._UrlTests + 'solveTest', JSON.stringify(body));

  }










  createCustomizedTest(addCustomizedTestdata: any) {
    return this.http.post(this._UrlTests + 'createCustomizedTest', JSON.stringify(addCustomizedTestdata));
  }

  addQuestionToCustomizedTest22(addCustomizedTestdata: any) {
    return this.http.post(this._UrlTests + 'addQuestionToCustomizedTest', JSON.stringify(addCustomizedTestdata));
  }
  editQuestionToCustomizedTest(addCustomizedTestdata1111: any) {
    return this.http.post(this._UrlTests + 'editQuestionToCustomizedTest', JSON.stringify(addCustomizedTestdata1111));
  }


  deleteQuestionFromCustomizedTest(my_test_id: any, question_id: any) {
    return this.http.delete(this._UrlTests + 'deleteQuestionFromCustomizedTest&my_test_id=' + my_test_id + '&question_id=' + question_id);
  }
  deleteTest(my_test_id: any) {
    return this.http.delete(this._UrlTests + 'deleteTest&my_test_id=' + my_test_id);
  }

  editCustomizedTest(addCustomizedTestdata: any) {
    return this.http.post(this._UrlTests + 'editCustomizedTest', JSON.stringify(addCustomizedTestdata));
  }









  shareTest(shareData: any) {

    let body = {
      message: shareData.content,
      test_id: shareData.my_test_id,
      students: shareData.students,
      groups: shareData.groups,
      target: shareData.target,
      test_duration: shareData.test_duration ? shareData.test_duration : 0,
      is_duration: shareData.test_duration ? true : false,
      scheduled_date: shareData.scheduled_date ? shareData.scheduled_date : 0,
      scheduled_test: shareData.scheduled_date ? true : false,
      show_result_to_student: shareData.show_result_to_student
    }

    return this.http.post(this._UrlTests + 'shareTest', JSON.stringify(body));



  }


  getAllStudentResultOnShareTest(start: any = 0, itemsPerPage: any = 50, share_id: any, post_id = 0, sort_by = 'id', sort_type = 'desc') {


    http://localhost/testat/api/app-api/tests.php?action=getAllStudentResultOnShareTest&start=0&itemsPerPage=10&share_id=26&post_id=36&sort_by=id&sort_type=desc


    return this.http.get(this._UrlTests + 'getAllStudentResultOnShareTest&start=' + start + '&itemsPerPage=' + itemsPerPage + '&share_id=' + share_id + '&post_id=' + post_id + '&sort_by=' + sort_by + '&sort_type=' + sort_type);

  }






  getAllimportantArticleQuestions(subject_id: any, category_id = 0, start: any = 0, itemsPerPage: any = 50, sort_by = 'sort', sort_type = 'asc') {
    return this.http.get(this._UrlTests + 'getAllimportantArticleQuestions&start=' + start + '&itemsPerPage=' + itemsPerPage + '&subject_id=' + subject_id + '&category_id=' + category_id + '&sort_by=' + sort_by + '&sort_type=' + sort_type);

  }


  getAllExamineQuestions(subject_id: any, category_id = 0, start: any = 0, itemsPerPage: any = 50, sort_by = 'sort', sort_type = 'asc') {
    return this.http.get(this._UrlTests + 'getAllExamineQuestions&start=' + start + '&itemsPerPage=' + itemsPerPage + '&subject_id=' + subject_id + '&category_id=' + category_id + '&sort_by=' + sort_by + '&sort_type=' + sort_type);

  }

  getMySharing_tests(start: any = 0, itemsPerPage: any = 50) {
    return this.http.get(this._UrlTests + 'getMySharing_tests&start=' + start + '&itemsPerPage=' + itemsPerPage);

  }




  getStudentTestAnswer(answer_id: any) {

    return this.http.get(this._UrlTests + 'getTestStudentResult&student_tests_answers_id=' + answer_id);

  }



  getPerformanceReportByParams(subject_id: any, type: any, student_id = 0) {

    return this.http.get(
      this._UrlReports +
      "getPerformanceReportByParams&type=" +
      type +
      "&subject_id=" +
      subject_id +
      "&student_id=" +
      student_id
    );

  }





  getAllPerformanceReport(student_id = 0) {
    return this.http.get(
      this._UrlReports + "getAllPerformanceReport" + "&student_id=" + student_id
    );
  }


  getStatisticsStudent() {

    return this.http.get(this._UrlStatistics + 'getStatisticsStudent');

  }







  getWrongsReport(subject_id: any, type: any, studentId = 0) {

    if (studentId == 0) {
      return this.http.get(
        this._UrlReports +
        "getWrongsReport&type=" +
        type +
        "&subject_id=" +
        subject_id
      );
    }
    return this.http.get(
      this._UrlReports +
      "getWrongsReport&type=" +
      type +
      "&subject_id=" +
      subject_id +
      "&student_id=" +
      studentId
    );
  }




  getWrongsFrequent(subject_id: any, start = 0, itemsPerPage = 10, studentId = '') {
    return this.http.get(
      this._UrlReports +
      "getWrongsFrequent&start=" +
      start +
      "&itemsPerPage=" +
      itemsPerPage +
      "&subject_id=" +
      subject_id +
      "&student_id=" +
      studentId
    );
  }




  getAllQuestionsReadyByParams(type: any, subject_id: any = '', unit_id = '', lesson_id = '', start = 0, itemsPerPage = 10) {

    return this.http.get(this._UrlTests + 'getAllQuestionsReadyByParams&start=' + start + '&itemsPerPage=' + itemsPerPage + '&type=' + type + '&' + 'subject_id=' + subject_id + '&unit_id=' + unit_id + '&lesson_id=' + lesson_id);


  }



  addTestFromReadyTests(Readytestdata: any) {

    let body = {
      "name": Readytestdata.name,
      "description": Readytestdata.description,
      "questions": Readytestdata.questions,
      "subject_id": Readytestdata.subject_id ? Readytestdata.subject_id : '',
      "unit_id": Readytestdata.unit_id ? Readytestdata.unit_id : '',
      "lesson_id": Readytestdata.lesson_id ? Readytestdata.lesson_id : '',
      "type": Readytestdata.type ? Readytestdata.type : ''

    };
    return this.http.post(this._UrlTests + 'addTestFromReadyTests', JSON.stringify(body));


  }











  addCustomizedTest(addCustomizedTestdata: any) {

    let body = {
      "name": addCustomizedTestdata.name,
      "description": addCustomizedTestdata.description,
      "questions": addCustomizedTestdata.questions,
      "subject_id": addCustomizedTestdata.subject_id ? addCustomizedTestdata.subject_id : '',
      "unit_id": addCustomizedTestdata.unit_id ? addCustomizedTestdata.unit_id : '',
      "lesson_id": addCustomizedTestdata.lesson_id ? addCustomizedTestdata.lesson_id : '',
      "type": addCustomizedTestdata.type ? addCustomizedTestdata.type : ''

    };
    return this.http.post(this._UrlTests + 'addCustomizedTest', JSON.stringify(body));


  }






  addQuestionToCustomizedTest(addCustomizedTestdata: any) {

    let body = {
      "name": addCustomizedTestdata.name,
      "description": addCustomizedTestdata.description,
      "questions": addCustomizedTestdata.questions,
      "subject_id": addCustomizedTestdata.subject_id ? addCustomizedTestdata.subject_id : '',
      "unit_id": addCustomizedTestdata.unit_id ? addCustomizedTestdata.unit_id : '',
      "lesson_id": addCustomizedTestdata.lesson_id ? addCustomizedTestdata.lesson_id : '',
      "type": addCustomizedTestdata.type ? addCustomizedTestdata.type : ''

    };
    return this.http.post(this._UrlTests + 'addQuestionToCustomizedTest', JSON.stringify(body));


  }



  addTestFromBankQuestions(addTestFromBankQuestions: any) {

    let body = {
      "name": addTestFromBankQuestions.name,
      "description": addTestFromBankQuestions.description,
      "questions": addTestFromBankQuestions.questions,
      "subject_id": addTestFromBankQuestions.subject_id ? addTestFromBankQuestions.subject_id : '',
      "unit_id": addTestFromBankQuestions.unit_id ? addTestFromBankQuestions.unit_id : '',
      "lesson_id": addTestFromBankQuestions.lesson_id ? addTestFromBankQuestions.lesson_id : '',
      "type": addTestFromBankQuestions.type ? addTestFromBankQuestions.type : ''

    };
    return this.http.post(this._UrlTests + 'addTestFromBankQuestions', JSON.stringify(body));


  }






  editTestFromBankQuestions(EditTestFromBankQuestions: any) {

    let body = {
      "name": EditTestFromBankQuestions.name,
      "description": EditTestFromBankQuestions.description,
      "questions": EditTestFromBankQuestions.questions,
      "subject_id": EditTestFromBankQuestions.subject_id ? EditTestFromBankQuestions.subject_id : '',
      "unit_id": EditTestFromBankQuestions.unit_id ? EditTestFromBankQuestions.unit_id : '',
      "lesson_id": EditTestFromBankQuestions.lesson_id ? EditTestFromBankQuestions.lesson_id : '',
      "type": EditTestFromBankQuestions.type ? EditTestFromBankQuestions.type : '',
      "my_test_id": EditTestFromBankQuestions.my_test_id
    };
    return this.http.post(this._UrlTests + 'editTestFromBankQuestions', JSON.stringify(body));


  }






  editTestReady(EditTestFromTestReady: any) {

    let body = {
      "name": EditTestFromTestReady.name,
      "description": EditTestFromTestReady.description,
      "questions": EditTestFromTestReady.questions,
      "subject_id": EditTestFromTestReady.subject_id ? EditTestFromTestReady.subject_id : '',
      "unit_id": EditTestFromTestReady.unit_id ? EditTestFromTestReady.unit_id : '',
      "lesson_id": EditTestFromTestReady.lesson_id ? EditTestFromTestReady.lesson_id : '',
      "type": EditTestFromTestReady.type ? EditTestFromTestReady.type : '',
      "my_test_id": EditTestFromTestReady.my_test_id
    };
    return this.http.post(this._UrlTests + 'editTestReady', JSON.stringify(body));


  }













}
