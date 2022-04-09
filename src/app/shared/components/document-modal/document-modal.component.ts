import { Component, OnInit,Input,Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
export default interface archivesInterface {
  name:String;
  id:Number;
  type:String;
  file:any;
  simpleType:String;
  size:Number;
  filePath?:any,
  descripition?:String;
}
@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
})
export class DocumentModalComponent implements OnInit {
  @Input('versaoEsperada') versaoEsperada:Number;
  @Input('requisicaoId') requisicaoId:String;
  @Input('archives') archives:Array<archivesInterface> = [];
  loaded:boolean= false;
  file:any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  base64textString:string;
  constructor(
    public modalController: ModalController,
    private alertServices: AlertServices,
  ) {
    
   }

  ngOnInit() {

  }
  async editDescription(id,i){
    let item = this.archives.find(a => a.id === id);
    console.log(i);
    const descripition = await this.alertServices.alertDescription(item.descripition);
    this.archives[i].descripition = descripition;
  }
  async deleteItem(id){
    this.archives =  this.archives.filter(obj => obj.id !== id);
  }
  async changeListener(e) : Promise<void> {
    this.file = (e.target as HTMLInputElement).files[0];
    let simpleType = this.simpleType(this.file.type);
    const descripition = await this.alertServices.alertDescription();
    const obj:archivesInterface = {
      id: this.archives.length + 1,
      name: this.file.name,
      type: this.file.type,
      file:this.file,
      size:this.file.size,
      simpleType,
      descripition

    }
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
  dismiss(){
    this.modalController.dismiss(this.archives);
  }

}
