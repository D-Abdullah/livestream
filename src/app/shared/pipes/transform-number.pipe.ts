import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformNumber'
})
export class TransformNumberPipe implements PipeTransform {

  transform(value:any ): number {
    if(!value)
    {
      return  0;
    }
    return Math.floor(value);
  }

}
