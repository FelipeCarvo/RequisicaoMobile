import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({name: 'fullDate'})
export class fullDate implements PipeTransform {
  transform(date:any): any {
    if(date)
    return moment(date).format('DD/MM/YYYY,h:mm:ss')  
  }
}