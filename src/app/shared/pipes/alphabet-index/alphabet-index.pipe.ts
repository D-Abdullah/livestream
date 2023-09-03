import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphabetIndex'
})
export class AlphabetIndexPipe implements PipeTransform {
  transform(value: number, language: string = 'en'): string {
    let alphabet: string;
    
    if (language === 'ar') {
      alphabet = 'أبجدهوزحطيكلمنصعفضقرستثخذظغش';
    } else {
      alphabet = 'abcdefghijklmnopqrstuvwxyz';
    }

    return alphabet[value];
  }
}