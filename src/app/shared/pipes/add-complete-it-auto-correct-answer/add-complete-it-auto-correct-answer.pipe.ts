import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addCompleteItAutoCorrectAnswer'
})
export class AddCompleteItAutoCorrectAnswerPipe implements PipeTransform {

  transform(text: string): string {
    if (!text) {
      return '';
    }

    const regex = /(\(#([^()]+)#\))/g;
    const replacedString = text.replace(regex, (_, word) => {
      const extractedWord = word.replace(/[(#)]/g, '');
      return `<span style="color: green; font-weight: bold; text-decoration: underline;">${extractedWord}</span>`;
    });

    return replacedString;
  }

}
