import { Component, OnInit,Input,Output, } from '@angular/core';
import {DocumentModalComponent} from '../document-modal/document-modal.component';
import { ModalController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {AlertServices} from '@services/utils/alerts-services/alerts-services';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss'],
})
export class DocumentItemComponent implements OnInit {
  @Input()item:any;
  constructor(
    public modalController: ModalController,
    private requestService:RequestService,
    public loading: LoadingService,
    private alertServices: AlertServices,
    private toastController:ToastController,
  ) { }

  ngOnInit() {
    console.log('',this.item)
  }
  verDetalhes(entidadeId,id){
    this.loading.present();
    this.requestService.getDocumentByEntidadeId(entidadeId,id).subscribe(res => {{
      console.log('res',res)
      this.loading.dismiss();
    }})
  }  
}
