import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBlanksPipe } from './add-blanks.pipe';



@NgModule({
  declarations: [
    AddBlanksPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddBlanksPipe
  ]
})
export class AddBlanksModule { }
