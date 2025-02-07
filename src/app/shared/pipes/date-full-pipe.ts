import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
@Pipe({
    name: 'fullDate',
    standalone: false
})
export class fullDate implements PipeTransform {
  transform(date: any): any {
    if(date) {
      return format(date, 'dd/MM/yyyy,h:mm:ss');
    }
  }
}
