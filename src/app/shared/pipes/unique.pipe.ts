import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'unique',
  pure: false
})

export class UniquePipe implements PipeTransform {
  transform(value: any, arg: any): any {
    // //console.log(value, arg)
    return _.uniqBy(value, arg);
  }
}
