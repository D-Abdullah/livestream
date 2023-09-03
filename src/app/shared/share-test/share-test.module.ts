import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareTestComponent } from './share-test.component';
import { SharedModule } from '../shared';
import { DirectivesModule } from '../directives/directives.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [

    ShareTestComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    SharedModule,
    DirectivesModule,

  ],
  exports: [
    ShareTestComponent,
    InfiniteScrollModule
  ]
})
export class ShareTestModule { }
