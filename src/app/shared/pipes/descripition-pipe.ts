import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'descripitionpipe'})
export class Descripitionpipe implements PipeTransform {
  transform(name:string): string {
    var numsStr = name.replace(/[^0-9]/g,'');
    return numsStr  
  }
}