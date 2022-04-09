import { Component, OnInit,Input } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  @Input() versaoEsperada:Number;
  @Input()requisicaoId:String;
  archives: Array<any> = [];
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
  async showModal(){
    const modal = await this.modalController.create({
      component: DocumentModalComponent,
      cssClass: 'modal-documents',
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.5, 1],
      componentProps:{archives:this.archives}
     
    });
    await modal.present();
    modal.onDidDismiss().then((response:any) => {
     this.archives = response.data;
    })
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
