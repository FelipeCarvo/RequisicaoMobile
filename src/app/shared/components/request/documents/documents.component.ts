import { Component, OnInit,Input,Injectable } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any).__zone_symbol__originalInstance;
  return zoneOriginalInstance || fileReader;
}
export default interface archivesInterface {
  name: String;
  id: Number;
  type: String;
  file: any;
  simpleType: String;
  size: Number;
  filePath?: any;
  descripition?: String;
}
@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    standalone: false
})
@Injectable({
  providedIn: 'root'
})
export class DocumentsComponent implements OnInit {
  @Input() versaoEsperada: number;
  @Input() requisicaoId: string;
  archives: Array<archivesInterface> = [];
  file: any;
  loadingDocument = false;
  documentList: Array<any> = [];
  constructor(
    public modalController: ModalController,
    private requestService: RequestService,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private toastController: ToastController,
    private fileOpener: FileOpener
  ) { }
  //
  ngOnInit() {
    this.getDocument();
  }
  get archivesValid() {
    return this.archives.length > 0;
  }

  getDocument() {
    this.requestService.getDocument(this.requisicaoId).subscribe(async (res: any) => {
      this.documentList = res;
      this.loadingDocument = true;
    });
  }

  async editDescription(item) {
    const descripition = await this.alertServices.alertDescription(item.descricao);
    if (descripition.role !== 'cancel') {

      const sendItem = {
        id: item.entidadeId,
        versaoEsperada: this.versaoEsperada,
        documentoId: item.id,
        descricao: descripition.fileName
      };
      this.putRequest(sendItem);
    }
  }

  async deleteItem(item) {
    //    this.loadButton = true;
    const sendItem = {
      id: item.entidadeId,
      versaoEsperada: this.versaoEsperada,
      documentoId: item.id,
    };
    let msg;
    this.requestService.deleteDocument(sendItem).subscribe(async (res) => {
      this.loading.dismiss();
      msg = 'Documento excluido com sucesso';
      await this.showMsg(msg);
      this.getDocument();
    },
      async (error) => {
        msg = error?.Mensagem;
        await this.showMsg(msg);
        this.loading.dismiss();
      });
  }
  //
  async changeListener(e): Promise<void> {
    //    this.loadButton = true;
    this.file = (e.target as HTMLInputElement).files[0];
    const { fileName, role } = await this.alertServices.alertDescription();

    if (role === 'cancel') {
      return;
    }
    if (!!fileName) {
      this.file.fileName = fileName;
    }
    this.sendArchive(this.file);

  }
  //dismiss() {
  //  this.modalController.dismiss(this.archives);
  //}
  async showMsg(msg) {
    const toast = await this.toastController.create(
      {
        message: msg,
        duration: 2000
      }
    );
    toast.present();
  }
  putRequest(item) {
    let msg;
    this.loading.present();
    this.requestService.editDocument(item).subscribe(async (res) => {
      this.loading.dismiss();
      msg = 'Documento editado com sucesso';
      await this.showMsg(msg);
      this.getDocument();
    },
      async (error) => {
        msg = error?.Mensagem;
        await this.showMsg(msg);
        this.loading.dismiss();
      });
  }
  //
  viewDocument(item) {
    const obj = {
      documentoId: item.id,
      versaoEsperada: this.versaoEsperada,
      id: this.requisicaoId

    };
    this.requestService.viewDocument(obj, item.nomeArquivoOriginal).subscribe(async (res: any) => {
      const resultado = await Filesystem.checkPermissions();
      if (resultado.publicStorage !== 'granted') {
        const resultadoPermissao = await Filesystem.requestPermissions();
      }
      const fileName = item.nomeArquivoOriginal;
      // let {body} = res;
      // let type = this.requestService.retornaMIME(fileName)
      // let blob = new Blob([body], { type: type })

      await this.writeAndOpenFile(res, fileName);
    },
      async (error) => {

      });
  }
  //
  sendArchive(item) {

    let msg;
    this.loading.present();
    this.requestService.sendDocument(item, this.requisicaoId, this.versaoEsperada).subscribe(async (res) => {
      this.loading.dismiss();
      msg = 'Documento enviado com sucesso';
      await this.showMsg(msg);
      setTimeout(() => {
        this.getDocument();
      }, 200);

    },
      async (error) => {
        msg = error?.Mensagem;
        await this.showMsg(msg);
        this.loading.dismiss();
      });
  }
  async writeAndOpenFile(data: Blob, fileName: string) {
    const reader = getFileReader();

    reader.readAsDataURL(data);
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64data as string,
          directory: Directory.Data,
          recursive: true
        });
        const tipoMIME = this.retornaMIME(result.uri);
        const retornoOpener = await this.fileOpener.open(result.uri, tipoMIME);
        console.log('Retorno do Opener: ');
        console.log(retornoOpener);

        console.log('Wrote file', result.uri);
      } catch (e) {
        console.error('Unable to write file', e);
      }
    };
  }

  private retornaMIME(nomeCompleto: string): string {
    if (!nomeCompleto) return '';
    nomeCompleto = nomeCompleto.toLowerCase();
    if (nomeCompleto.endsWith('.doc')) return 'application/msword';
    if (nomeCompleto.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (nomeCompleto.endsWith('.jpeg')) return 'image/jpeg';
    if (nomeCompleto.endsWith('.jpg')) return 'image/jpeg';
    if (nomeCompleto.endsWith('.pdf')) return 'application/pdf';
    if (nomeCompleto.endsWith('.xls')) return 'application/vnd.ms-excel';
    if (nomeCompleto.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (nomeCompleto.endsWith('.txt')) return 'text/plain';
    if (nomeCompleto.endsWith('.png')) return 'image/png';
    if (nomeCompleto.endsWith('.aac')) return 'audio/aac';
    if (nomeCompleto.endsWith('.abw')) return 'application/x-abiword';
    if (nomeCompleto.endsWith('.arc')) return 'application/x-freearc';
    if (nomeCompleto.endsWith('.avi')) return 'video/x-msvideo';
    if (nomeCompleto.endsWith('.azw')) return 'application/vnd.amazon.ebook';
    if (nomeCompleto.endsWith('.bin')) return 'application/octet-stream';
    if (nomeCompleto.endsWith('.bmp')) return 'image/bmp';
    if (nomeCompleto.endsWith('.bz')) return 'application/x-bzip';
    if (nomeCompleto.endsWith('.bz2')) return 'application/x-bzip2';
    if (nomeCompleto.endsWith('.csh')) return 'application/x-csh';
    if (nomeCompleto.endsWith('.css')) return 'text/css';
    if (nomeCompleto.endsWith('.csv')) return 'text/csv';
    if (nomeCompleto.endsWith('.eot')) return 'application/vnd.ms-fontobject';
    if (nomeCompleto.endsWith('.epub')) return 'application/epub+zip';
    if (nomeCompleto.endsWith('.gz')) return 'application/gzip';
    if (nomeCompleto.endsWith('.gif')) return 'image/gif';
    if (nomeCompleto.endsWith('.htm')) return 'text/html';
    if (nomeCompleto.endsWith('.html')) return 'text/html';
    if (nomeCompleto.endsWith('.ico')) return 'image/vnd.microsoft.icon';
    if (nomeCompleto.endsWith('.ics')) return 'text/calendar';
    if (nomeCompleto.endsWith('.jar')) return 'application/java-archive';
    if (nomeCompleto.endsWith('.js')) return 'text/javascript';
    if (nomeCompleto.endsWith('.json')) return 'application/json';
    if (nomeCompleto.endsWith('.jsonld')) return 'application/ld+json';
    if (nomeCompleto.endsWith('.mid')) return 'audio/midi ';
    if (nomeCompleto.endsWith('.midi')) return 'audio/x-midi';
    if (nomeCompleto.endsWith('.mjs')) return 'text/javascript';
    if (nomeCompleto.endsWith('.mp3')) return 'audio/mpeg';
    if (nomeCompleto.endsWith('.mpeg')) return 'video/mpeg';
    if (nomeCompleto.endsWith('.mpkg')) return 'application/vnd.apple.installer+xml';
    if (nomeCompleto.endsWith('.odp')) return 'application/vnd.oasis.opendocument.presentation';
    if (nomeCompleto.endsWith('.ods')) return 'application/vnd.oasis.opendocument.spreadsheet';
    if (nomeCompleto.endsWith('.odt')) return 'application/vnd.oasis.opendocument.text';
    if (nomeCompleto.endsWith('.oga')) return 'audio/ogg';
    if (nomeCompleto.endsWith('.ogv')) return 'video/ogg';
    if (nomeCompleto.endsWith('.ogx')) return 'application/ogg';
    if (nomeCompleto.endsWith('.opus')) return 'audio/opus';
    if (nomeCompleto.endsWith('.otf')) return 'font/otf';
    if (nomeCompleto.endsWith('.php')) return 'application/x-httpd-php';
    if (nomeCompleto.endsWith('.ppt')) return 'application/vnd.ms-powerpoint';
    if (nomeCompleto.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    if (nomeCompleto.endsWith('.rar')) return 'application/vnd.rar';
    if (nomeCompleto.endsWith('.rtf')) return 'application/rtf';
    if (nomeCompleto.endsWith('.sh')) return 'application/x-sh';
    if (nomeCompleto.endsWith('.svg')) return 'image/svg+xml';
    if (nomeCompleto.endsWith('.swf')) return 'application/x-shockwave-flash';
    if (nomeCompleto.endsWith('.tar')) return 'application/x-tar';
    if (nomeCompleto.endsWith('.tif')) return 'image/tiff';
    if (nomeCompleto.endsWith('.tiff')) return 'image/tiff';
    if (nomeCompleto.endsWith('.ts')) return 'video/mp2t';
    if (nomeCompleto.endsWith('.ttf')) return 'font/ttf';
    if (nomeCompleto.endsWith('.vsd')) return 'application/vnd.visio';
    if (nomeCompleto.endsWith('.wav')) return 'audio/wav';
    if (nomeCompleto.endsWith('.weba')) return 'audio/webm';
    if (nomeCompleto.endsWith('.webm')) return 'video/webm';
    if (nomeCompleto.endsWith('.webp')) return 'image/webp';
    if (nomeCompleto.endsWith('.woff')) return 'font/woff';
    if (nomeCompleto.endsWith('.woff2')) return 'font/woff2';
    if (nomeCompleto.endsWith('.xhtml')) return 'application/xhtml+xml';
    if (nomeCompleto.endsWith('.xml')) return 'application/xml';
    if (nomeCompleto.endsWith('.xul')) return 'application/vnd.mozilla.xul+xml';
    if (nomeCompleto.endsWith('.zip')) return 'application/zip';
    if (nomeCompleto.endsWith('.3gp')) return 'video/3gpp';
    if (nomeCompleto.endsWith('.3g2')) return 'video/3gpp2';
    if (nomeCompleto.endsWith('.7z')) return 'application/x-7z-compressed';
    return 'text/plain';
  }

}
