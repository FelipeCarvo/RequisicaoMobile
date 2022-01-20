import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.page.html',
  styleUrls: ['./detail-request.page.scss'],
})
export class DetailRequestPage implements OnInit {

  constructor(public navCtrl:NavController,) { }

  ngOnInit() {
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
}
