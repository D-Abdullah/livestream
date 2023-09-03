import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addBlanks'
})
export class AddBlanksPipe implements PipeTransform {

  transform(text: string): string {
    if (!text) {
      return '';
    }
    
    const searchString = 'testat_blank';
    const replacement = '............';
    return text.replace(new RegExp(searchString, 'g'), replacement);
  }

}
