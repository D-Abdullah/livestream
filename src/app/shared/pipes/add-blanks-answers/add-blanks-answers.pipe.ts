import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addBlanksAnswers'
})
export class AddBlanksAnswersPipe implements PipeTransform {

  transform(text: string, replacements: { math_type_view_title: string }[]): string {
    if (!text || !replacements || replacements.length === 0) {
      return text;
    }

    let index = 0;
    const replacedString = text.replace(/testat_blank/g, () => {
      const replacement = replacements[index]?.math_type_view_title || '';
      index = (index + 1) % replacements.length;
      return `<span style="text-decoration: underline; color: green; font-weight: bold;">${replacement}</span>`;
    });

    return replacedString;
  }

}
