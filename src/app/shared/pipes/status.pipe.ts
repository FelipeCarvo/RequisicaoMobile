import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
@Pipe({name: 'statusPipe'})
export class statusPipe implements PipeTransform {
  transform(status): any {
    if(status)
    return EnumStatus[status]
  }
}
@Pipe({name: 'statusMoment'})
export class statusMoment implements PipeTransform {
  transform(status): any {
    let desc = EnumStatus[status]
    return `Requisoções ${desc}${desc.slice(-1) == 'a' ? 's':''}`
  }
}