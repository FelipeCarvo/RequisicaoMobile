import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
@Pipe({
    name: 'momentPipe',
    standalone: false
})
export class momentPipe implements PipeTransform {
  transform(date: any): any {
    if(date) {
      return format(date, 'dd/MM/yyyy');
    }
  }
}
