import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphabetIndexPipe } from './alphabet-index.pipe';



@NgModule({
  declarations: [
    AlphabetIndexPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlphabetIndexPipe
  ]
})
export class AlphabetIndexModule { }
