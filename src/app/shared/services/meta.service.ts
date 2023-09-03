import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: "root",
})
export class MetaService {
  siteDomain = "https://testat-app.com";
  public siteNameMeta: string;
  public siteName =
    localStorage.getItem("CurrentLang") != "ar" ? "Testat" : "تستات";

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private translateService: TranslateService,
    public commonService: CommonService,
    private http: HttpClient,
    @Inject(DOCUMENT) private dom
  ) {
    this.commonService.getAllSocialMedia().subscribe({
      next: (res: any) => {
        // console.log('all settings ', res);
        if (res.success) {
          this.siteName = res.data.site_name
        }
        
      },
    })
    
    

  }

  

  

  createCanonicalURL(url?: string) {
    const urlNew = this.siteDomain + url;
    let canURL = url == undefined ? this.dom.URL : urlNew;
    let link: HTMLLinkElement = this.dom.createElement("link");
    link.setAttribute("rel", "canonical");
    this.dom.head.appendChild(link);
    link.setAttribute("href", canURL);
    // console.log("canonical", canURL);
  }

  createCanonicalUrlAlt(url?: string) {
    const urlNew = url?.normalize('NFC');;
    // console.log('canonical url ', urlNew);
    
    // let canURL = url == undefined ? this.dom.URL : urlNew;
    // let canURL = url == undefined ? this.dom.URL : urlNew;
    let link: HTMLLinkElement = this.dom.createElement("link");
    link.setAttribute("rel", "canonical");
    this.dom.head.appendChild(link);
    link.setAttribute("href", urlNew ? urlNew : '');
    // console.log("canonical", canURL);
  }

  setMeta(name: string, content: string) {
    this.meta.addTag({
      name: name,
      content: content,
    });
  }

  setOgMeta(property: string, content: string) {
    this.meta.addTag({
      property: "og:" + property,
      content: content,
    });
  }

  setDescription(content) {
    this.setMeta("description", content);
    this.setOgMeta("description", content);
    this.setMeta("twitter:description", content);
  }

  setKeywords(content: string) {
    // let keywords = content?.replace(/ /g, ", ");
    const keywords = content;
    // console.log("keywords", keywords);
    this.meta.addTag({
      name: "keywords",
      content: keywords,
    });
  }

  setTitleMeta(title: string){
    this.setOgMeta("title", title);
    this.setMeta("title", title);
    this.setMeta("twitter:title", title);
  }

  setTitlePage(title: string){
    
    this.title.setTitle(title + " | " + this.siteName);
  }

  setTitleOnly(title: string){
    
    
    this.title.setTitle(title);
  }

  setTitle(title: string, isTranslate = false, urlKeyword = "") {
    
    if (isTranslate) {
      title = this.translateService.instant(title);
    }

    if (urlKeyword) {
      if (this.router.url.includes(urlKeyword)) {
        this.title.setTitle(title + " | " + this.siteName);
        this.setOgMeta("title", title);
        this.setMeta("title", title);
        this.setMeta("twitter:title", title);
      }
    } else {
      this.title.setTitle(title + " | " + this.siteName);
      this.setOgMeta("title", title);
      this.setMeta("title", title);
      this.setMeta("twitter:title", title);
    }
    // console.log(title);
  }

  setImageMeta(url, width = "380", height = "200") {
    this.setOgMeta("image", url);
    this.setMeta("image", url);
    this.setMeta("twitter:image", url);
    this.setOgMeta("image:width", width);
    this.setOgMeta("image:height", height);

    // GET & SET IMAGE TYPE META
    const url1 = url.split("/");
    const lastIndex = url1[url1.length - 1];
    let type1 = lastIndex.split(".")[1];
    type1 = type1 == "jpg" ? "jpeg" : type1;

    this.setOgMeta("image:type", type1);
  }

  setSiteName() {
    
    this.setMeta("site_name", this.siteName);
    this.setOgMeta("site_name", this.siteName);
  }
}
