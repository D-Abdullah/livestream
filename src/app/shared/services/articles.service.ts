import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  private _UrlArticles: string =
    this.commonService._hostName + "articles.php?action=";
  public imageUrl = this.commonService._ImageUrl + "articles/";
  public commentsAvatarImagePath = this.commonService._ImageUrl + "users/";

  constructor(private commonService: CommonService, private http: HttpClient) { }

  getAllArticles(
    itemsPerPage = 10,
    start = 0,
    categoryId = "",
    searchKey = ""
  ) {
    return this.http.get<any>(
      this._UrlArticles +
      "getAllArticles" +
      "&itemsPerPage=" +
      itemsPerPage +
      "&start=" +
      start +
      "&category_id=" +
      categoryId +
      "&searchKey=" +
      searchKey
    );
  }

  getMostPopularArticles(
    itemsPerPage = 10,
    start = 0,
    categoryId = "",
    searchKey = ""
  ) {
    return this.http.get<any>(
      this._UrlArticles +
      "getAllArticles" +
      "&itemsPerPage=" +
      itemsPerPage +
      "&start=" +
      start +
      "&category_id=" +
      categoryId +
      "&searchKey=" +
      searchKey +
      "&sort_type=desc&sort_by=view_count"
    );
  }

  addCommentOnArticle(articleId, comment: string) {
    let body = {
      article_id: articleId,
      content: comment,
    };
    return this.http.post(this._UrlArticles + "addCommentOnArticle", body);
  }

  getArticleDetails(articleSlug) {
    const url1 = this._UrlArticles + "getArticleDetails&slug=" + articleSlug;
    const res1 = encodeURI(url1); 
    return this.http.get<any>(res1);
  }

  getAllCategories(type = "article", itemsPerPage = 100, start = 0, searchKey = "",subject_id='0') {
    return this.http.get<any>(
      this._UrlArticles +
      "getAllCategories" +
      "&itemsPerPage=" +
      itemsPerPage +
      "&start=" +
      start +
      "&searchKey=" +
      searchKey + "&type=" + type +"&subject_id=" + subject_id     
    );
  }

  addReplyOnComment(articleId, commentId, content) {
    let body = {
      article_id: articleId,
      comment_id: commentId,
      content: content,
    };
    return this.http.post(this._UrlArticles + "addReplyOnComment", body);
  }

  getAllCommentsOnArticle(articleId, itemsPerPage = 10, start = 0) {
    return this.http.get<any>(
      this._UrlArticles +
      "getAllCommentsOnArticle&article_id=" +
      articleId +
      "&itemsPerPage=" +
      itemsPerPage +
      "&start=" +
      start
    );
  }

  deleteReplyOrComment(commentId) {

    return this.http.delete(
      this._UrlArticles + "deleteReplyOrComment" + "&id=" + commentId
    );
  }

  getCategoryDetails(categoryTitle) {
    const url1 = this._UrlArticles + "getCategoryDetails&category_title=" + categoryTitle;
    const res1 = encodeURI(url1); 
    return this.http.get(
      res1
    );
  }
}
