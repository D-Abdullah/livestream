import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBlanksAnswersPipe } from './add-blanks-answers.pipe';



@NgModule({
  declarations: [
    AddBlanksAnswersPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddBlanksAnswersPipe
  ]
})
export class AddBlanksAnswersModule { }
