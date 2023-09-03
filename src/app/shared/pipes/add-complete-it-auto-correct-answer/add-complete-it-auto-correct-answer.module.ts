import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCompleteItAutoCorrectAnswerPipe } from './add-complete-it-auto-correct-answer.pipe';



@NgModule({
  declarations: [
    AddCompleteItAutoCorrectAnswerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddCompleteItAutoCorrectAnswerPipe
  ]
})
export class AddCompleteItAutoCorrectAnswerModule { }
