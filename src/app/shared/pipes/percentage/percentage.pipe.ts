import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentage' })
export class PercentagePipe implements PipeTransform {
  transform(numerator: number, denominator: number): string {
    if (!numerator || !denominator || numerator === 0 || denominator === 0) {
      return '0%';
    }
    const percentage = Math.round((numerator / denominator) * 100);
    return `${percentage}%`;
  }
}