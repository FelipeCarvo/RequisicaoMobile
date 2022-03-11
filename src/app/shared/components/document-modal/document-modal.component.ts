import { Component, OnInit,Input,Output } from '@angular/core';
export default interface archivesInterface {
  name:String;
  id:Number;
  type:String;
  file:any;
  simpleType:String;
  size:Number;
  filePath?:any
}
@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
})
export class DocumentModalComponent implements OnInit {
  @Input('versaoEsperada') versaoEsperada:Number;
  @Input('requisicaoId') requisicaoId:String;
  archives:Array<{}> = [];
  loaded:boolean= false;
  file:any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  base64textString:string;
  constructor() {
    
   }

  ngOnInit() {
  }
  async changeListener(e) : Promise<void> {

    this.file = (e.target as HTMLInputElement).files[0];
    let simpleType = this.simpleType(this.file.type);
    const obj:archivesInterface = {
      id: this.archives.length + 1,
      name: this.file.name,
      type: this.file.type,
      file:this.file,
      size:this.file.size,
      simpleType

    }
    console.log(obj);
    if(!!this.file.type.includes('image') && !this.file.type.includes('svg')){
      const reader = new FileReader();
      reader.onload = () => {
        obj.filePath = reader.result as string
        setTimeout(()=>{
          this.archives.push(obj);
         
        },200)
      }
      reader.readAsDataURL(this.file)
    }else{
      this.archives.push(obj);
      console.log(this.file)
    }
  }
  simpleType(type){
    let result
    if(!!type.includes('image') && !this.file.type.includes('svg')){
      result = 'image'
    }else{
      result = type.split('/')[1];
    }
    return result
  }
  dismiss(){}

}
