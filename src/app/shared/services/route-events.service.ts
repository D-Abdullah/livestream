
import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable()
export class RouteEventsService {
    // save the previous route
  public previousRoutePath = new BehaviorSubject<string>('');
  public fullpath:any = [];
  public mainPath:any;
  public lastActiveIndex:any;

  constructor(
    private router: Router,
    private location: Location
  ) {

    // ..initial prvious route will be the current path for now
    this.previousRoutePath.next(this.location.path());

    // this.fullpath.push(this.previousRoutePath);

    // on every route change take the two events of two routes changed(using pairwise)
    // and save the old one in a behavious subject to access it in another component
    // we can use if another component like intro-advertise need the previous route
    // because he need to redirect the user to where he did came from.
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      pairwise(),
        )
    .subscribe((event: any[]) => {
      for(let i = 0 ; i<event.length; i++){
        let path = event[i].url;
        // //console.log('456456456456456564', path);
        this.fullpath.push(path);
      }
      this.lastActiveIndex = this.fullpath.lastIndexOf(this.mainPath);
      // //console.log('==========',this.lastActiveIndex);
        this.previousRoutePath.next(event[0].urlAfterRedirects);
        // //console.log('====================================55555555',this.fullpath);
    });

  }
}