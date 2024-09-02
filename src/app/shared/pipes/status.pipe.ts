import { Pipe, PipeTransform } from '@angular/core';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
@Pipe({name: 'statusPipe'})
export class statusPipe implements PipeTransform {
  transform(status): any {
    if (status) {
      return EnumStatus[status];
    }
  }
}
@Pipe({name: 'statusMoment'})
export class statusMoment implements PipeTransform {
  transform(status): any {
    const desc = EnumStatus[status];
    return `Requisições ${desc}${desc.slice(-1) === 'a' ? 's':''}`;
  }
}
