import { Component, OnInit,Input,Injectable } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
  return zoneOriginalInstance || fileReader;
}
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
@Injectable({
  providedIn: 'root'
})
export class DocumentsComponent implements OnInit {
  @Input() versaoEsperada:Number;
  @Input()requisicaoId:String;
  archives:Array<archivesInterface> = [];
  file:any;
  loadButton:Boolean = false;
  loadingDocument:boolean = false;
  documentList:Array<any> = [];
  private downloadedFile;
  constructor(
    private fileServe:File,
    private platform: Platform,
    public modalController: ModalController,
    private requestService:RequestService,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private toastController:ToastController,
    private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    this.getDocument()

  }
  get archivesValid(){
    return this.archives.length > 0;
  }
  getDocument(){
    this.requestService.getDocument(this.requisicaoId).subscribe(async(res:any) =>{
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
      descricao: descripition.fileName
    }
   this.putRequest(sendItem)
   }
  }
  async deleteItem(item){
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
    this.loadButton = true;
    this.file = (e.target as HTMLInputElement).files[0];
    const {fileName,role} = await this.alertServices.alertDescription();
   
    if(role === 'cancel'){
      return;
    }
    if(!!fileName){
      this.file.fileName = fileName;
    }
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

  viewDocument(item){
    const obj = {
      documentoId: item.id,
      versaoEsperada:this.versaoEsperada,
      id:this.requisicaoId

    }
    this.requestService.viewDocument(obj,item.nomeArquivoOriginal).subscribe(async(res:any) =>{
      let resultado = await Filesystem.checkPermissions();
      if (resultado.publicStorage != 'granted') {
        let resultadoPermissao = await Filesystem.requestPermissions();
      }
      let fileName = item.nomeArquivoOriginal;
      // let {body} = res;
      // let type = this.requestService.retornaMIME(fileName)
      // let blob = new Blob([body], { type: type })
   
      await this.writeAndOpenFile(res,fileName)
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
      setTimeout(()=>{
        this.getDocument();
      },200)

    },
    async(error) =>{
      msg = error?.Mensagem
      await this.showMsg(msg)
      this.loading.dismiss();
    })
  }
  async writeAndOpenFile(data: Blob, fileName: string) {
    var reader = getFileReader();

    reader.readAsDataURL(data);
    reader.onloadend = async function () {
        var base64data = reader.result;
        try {
            const result = await Filesystem.writeFile({
                path: fileName,
                data: <string>base64data,
                directory: Directory.Data,
                recursive: true
            });
            let fileOpener: FileOpener = new FileOpener();
            fileOpener.open(result.uri, data.type)
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));

            console.log('Wrote file', result.uri);
        } catch (e) {
            console.error('Unable to write file', e);
        }
    }
}

}
