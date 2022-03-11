import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'imageType'})
export class imageTypepipe implements PipeTransform {
  transform(type:string): string {
    let result
    if(!!type.includes('image') && !type.includes('svg')){
      result = 'image'
    }
    else if(type.includes('svg')){
      result = 'svg'
    }else{
      result = type.split('/')[1];
    }
    return result
  }
}