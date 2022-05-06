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
  file:any;
  loadButton:Boolean = false;
  loadingDocument:boolean = false;
  documentList:Array<any> = [];
  constructor(
    public modalController: ModalController,
    private requestService:RequestService,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private toastController:ToastController,
  ) { }

  ngOnInit() {
    this.getDocument()
    console.log(this.versaoEsperada)
  }
  get archivesValid(){
    return this.archives.length > 0;
  }
  getDocument(){
    this.requestService.getDocument(this.requisicaoId).subscribe(async(res:any) =>{
      console.log(res); 
      this.documentList = res;
      this.loadingDocument = true;
    })
  }
  async editDescription(item,i){
    let itemDesc = this.documentList.find(a => a.id === item.id && a.entidadeId === item.entidadeId);
    const descripition = await this.alertServices.alertDescription(item.descricao);
   if(descripition){
   
    const sendItem = {
      id: item.entidadeId,
      versaoEsperada: this.versaoEsperada,
      documentoId: item.id,
      descricao: descripition
    }
    console.log(sendItem);
   this.putRequest(sendItem)
   }
  }
  async deleteItem(item){
    console.log(this.versaoEsperada)
    this.loadButton = true;
    const sendItem = {
      id: item.entidadeId,
      versaoEsperada: this.versaoEsperada,
      documentoId: item.id,
    }
    let msg
    this.requestService.deleteDocument(sendItem).subscribe(async(res) =>{
      this.loading.dismiss();
      msg = 'Documento excluido com sucesso'
      await this.showMsg(msg);
      this.getDocument()
    },
    async(error) =>{
      msg = error?.Mensagem
      await this.showMsg(msg)
      this.loading.dismiss();
    })
  }
  async changeListener(e) : Promise<void> {
    console.log('change',e)
    this.loadButton = true;
    this.file = (e.target as HTMLInputElement).files[0];
    const {fileName,role} = await this.alertServices.alertDescription();
   
    if(role === 'cancel'){
      return;
    }
    if(!!fileName){
      this.file.fileName = fileName;
    }

    console.log(fileName)
    this.sendArchive(this.file);
    
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
  putRequest(item){
    let msg
    this.loading.present();
    this.requestService.editDocument(item).subscribe(async(res) =>{
      this.loading.dismiss();
      msg = 'Documento editado com sucesso'
      await this.showMsg(msg);
      this.getDocument()
    },
    async(error) =>{
      msg = error?.Mensagem
      await this.showMsg(msg)
      this.loading.dismiss();
    })
  }
  convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  viewDocument(item){
    const obj = {
      documentoId: item.id,
      versaoEsperada:this.versaoEsperada,
      id:this.requisicaoId

    }
    
    this.requestService.viewDocument(obj).subscribe(async(res:any) =>{
      var file = new File([res], "file_name");
      console.log(file)
    const base64String:any = await this.convertBlobToBase64(res);
    var file2 = new File([base64String], "file_name");
    console.log(file2);
    window.open(base64String); 
    },
    async(error) =>{
     
    })
  }
  sendArchive(item){
  
    let msg
    this.loading.present();
    this.requestService.sendDocument(item,this.requisicaoId,this.versaoEsperada).subscribe(async(res) =>{
      this.loading.dismiss();
      msg = 'Documento enviado com sucesso'
      await this.showMsg(msg);
      this.getDocument()
    },
    async(error) =>{
      msg = error?.Mensagem
      await this.showMsg(msg)
      this.loading.dismiss();
    })
  }


}
