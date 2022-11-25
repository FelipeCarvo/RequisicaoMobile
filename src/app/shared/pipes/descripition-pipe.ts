import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'descripitionpipe'})
export class Descripitionpipe implements PipeTransform {
  transform(content:string,maxCharacters:number):string {
    if (!maxCharacters) return content.replace(/[^0-9]/g,'');
    if (content == null) return "";

    content = "" + content;

    content = content.trim();

    if (content.length <= maxCharacters) return content;

    content = content.substring(0, maxCharacters);

    var lastSpace = content.lastIndexOf(" ");

    if (lastSpace > -1) content = content.substr(0, lastSpace);

    return content + '...';
    // var numsStr = name.replace(/[^0-9]/g,'');
    // return numsStr  
  }
}
@Pipe({name: 'filterType'})
export class filterType implements PipeTransform {
  transform(content:string,name:string,Hasfilter:boolean): String {
    let retorno;
    if(name !='insumoId'){
      retorno = content
    }
    else{
     if(Hasfilter){
      retorno = content.split('-')[0];

     }
     else{
      retorno = content
     }
    }

    return !!retorno ?retorno.trim() : ''
  }
}