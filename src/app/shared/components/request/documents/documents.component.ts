import { Component, OnInit,Input } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
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
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  @Input() versaoEsperada:Number;
  @Input()requisicaoId:String;
  archives:Array<archivesInterface> = [];
  loaded:boolean= false;
  file:any;
  base64textString:string;
  constructor(
    public modalController: ModalController,
    private requestService:RequestService,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private toastController:ToastController,
  ) { }

  ngOnInit() {}
  get archivesValid(){
    return this.archives.length > 0;
  }
  async editDescription(id,i){
    let item = this.archives.find(a => a.id === id);
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
  async showMsg(msg){
    const toast = await this.toastController.create(
      {
        message: msg,
        duration: 2000
      }
    );
    toast.present();
  }
  sendArchive(){
    let msg
    this.loading.present();
    const archives = this.archives.map(el => el.file);
    this.requestService.sendDocument(archives,this.requisicaoId,this.versaoEsperada).subscribe(async(res) =>{
      this.loading.dismiss();
      msg = 'Documento enviado com sucesso'
      await this.showMsg(msg)
    },
    async(error) =>{
      msg = error?.Mensagem
      await this.showMsg(msg)
      this.loading.dismiss();
    })
  }


}
