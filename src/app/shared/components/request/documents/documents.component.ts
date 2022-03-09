import { Component, OnInit } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  archives: Array<any> = [];
  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {}
  async showModal(){
    const modal = await this.modalController.create({
      component: DocumentModalComponent,
      cssClass: 'modalFinishReq',
      componentProps:this.archives
     
    });
    await modal.present();
  }


}
