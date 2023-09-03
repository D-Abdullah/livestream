import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
// import { SubFooterComponent } from '../sub-footer/sub-footer.component';
import { CountdownModule } from 'ngx-countdown';
// import { SubFooterModule } from '../sub-footer/sub-footer.module';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { MathModule } from 'src/math/math.module';
import { MathShowModule } from '../math-show/math-show.module';
import { ShowQuestionsAnswerdModule } from '../show_questions_answerd/show-questions-answerd.module';
import { ShareSocialModalComponent } from '../share-social-modal/share-social-modal.component';





@NgModule({
  declarations: [
    // SubFooterComponent,
    
    ShareSocialModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    AnimateOnScrollModule.forRoot(),
    ReactiveFormsModule,
    CountdownModule,
    // SubFooterModule,
    NgDynamicBreadcrumbModule,
    MathModule.forRoot(),
    MathShowModule,
  ],
  exports: [
    TranslateModule,
    NgbModule,
    FormsModule,
    AnimateOnScrollModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    // SubFooterModule,
    NgDynamicBreadcrumbModule,
    MathModule,
    MathShowModule,
    
    ShareSocialModalComponent
  ],
})
export class SharedModule {}