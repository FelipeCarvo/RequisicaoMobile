import { Component, OnInit,Input } from '@angular/core';
import {DocumentModalComponent} from '../../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  @Input() versaoEsperada:Number;
  @Input()requisicaoId:String;
  archives: Array<[]> = [];
  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {}
  async showModal(){
    const modal = await this.modalController.create({
      component: DocumentModalComponent,
      cssClass: 'modalFinishReq',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      componentProps:{versaoEsperada:this.versaoEsperada,requisicaoId:this.requisicaoId}
     
    });
    await modal.present();
  }
  sendArchive(file){
    console.log(file)
  }


}
