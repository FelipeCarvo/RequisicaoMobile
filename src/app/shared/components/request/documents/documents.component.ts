import { Component, OnInit,Input } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
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
  ) { }

  ngOnInit() {}
  get archivesValid(){
    console.log(this.archives)
    return this.archives.length > 0;
  }
  async showModal(){
    const modal = await this.modalController.create({
      component: DocumentModalComponent,
      cssClass: 'modalFinishReq',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      componentProps:{archives:this.archives}
     
    });
    await modal.present();
    modal.onDidDismiss().then((response:any) => {
     this.archives = response.data;
    })
  }
  sendArchive(){
    const archives = this.archives.map(el => el.file);
    console.log(archives)
    this.requestService.sendDocument(archives,this.requisicaoId,this.versaoEsperada).subscribe(res =>{
      console.log(res);
    })
  }


}
