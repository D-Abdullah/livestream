import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, ParamMap, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ArticlesService } from './articles.service';
import { CommonService } from './common.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: "root",
})
export class MetaGuard implements CanActivate {
  constructor(
    private userServ: UserService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    public articlesService: ArticlesService,
    private commonService: CommonService,
    private meta:Meta
  ) {}
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> | Promise<boolean> | boolean {
  //   // fetching id  from the url

  //   this.activedRoute.paramMap.subscribe((params: ParamMap) => {
  //     const articleSlug = params.get("articleSlug");

  //     this.articlesService.getArticleDetails(articleSlug).pipe(
  //       map((result) => {
  //         this.commonService.setMeta(
  //           "description",
  //           result.data.meta_description
  //         );
  //         return true;
  //       })
  //     );
  //   });
  // }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // fetching id  from the url
    // const articleSlug = this.activedRoute.snapshot.params["articleSlug"];
    const articleSlug = route.paramMap.get("articleSlug");
    
    // calling our API service like we would usually do but instead of a subscribe, we do a pipe map.
    return this.articlesService.getArticleDetails(articleSlug).pipe(
      map((result) => {
        // console.log("articleSlug", articleSlug);
        // console.log('resultttt', result);
        const metaDescription = result.data.meta_description;
        const metaKeywords = result.data.meta_keywords;
        console.log("dessc", metaDescription);
        
        // this.commonService.setMeta("description", metaDescription);
        // this.commonService.setOgMeta("description", metaDescription);
        // this.commonService.setKeywords( metaKeywords);
        
        
        // the canActivate expect and Observable<boolean> that's why we have to return true here
        return true;
      })
    );
  }
}
