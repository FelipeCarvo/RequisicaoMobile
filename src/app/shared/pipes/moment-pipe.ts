import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({name: 'momentPipe'})
export class momentPipe implements PipeTransform {
  transform(date:any): any {
    
    return moment(date).format('DD/MM/YYYY')  
  }
}