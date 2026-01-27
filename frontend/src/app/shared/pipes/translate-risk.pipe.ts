import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateRisk',
  standalone: true
})
export class TranslateRiskPipe implements PipeTransform {

  transform(value: 'low' | 'medium' | 'high'): string {
    switch (value) {
      case 'low':
        return 'Низкий риск';
      case 'medium':
        return 'Средний риск';
      case 'high':
        return 'Высокий риск';
      default:
        return value;
    }
  }
}
