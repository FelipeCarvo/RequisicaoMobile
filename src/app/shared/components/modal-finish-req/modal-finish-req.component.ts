import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-finish-req',
  templateUrl: './modal-finish-req.component.html',
  styleUrls: ['./modal-finish-req.component.scss'],
})
export class ModalFinishReqComponent implements OnInit {
  hasFinish = false;
  constructor(public modalController: ModalController,) { }

  ngOnInit() {}
  public dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }
  finish(){
    this.hasFinish = !this.hasFinish
  }
}
