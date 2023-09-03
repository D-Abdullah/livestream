import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




import { TranslateModule } from '@ngx-translate/core';
import { TextDirectionDirective } from './text-direction-tag.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  declarations: [TextDirectionDirective],
  exports: [TextDirectionDirective],

})
export class DirectivesModule { }
