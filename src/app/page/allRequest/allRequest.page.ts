import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-allRequest',
  templateUrl: './allRequest.page.html',
  styleUrls: ['./allRequest.page.scss'],
})
export class AllRequestPage implements OnInit {
  listReq: Array<any>;
  constructor(private router:Router,private rquestService:RequestService, private navCtrl: NavController,) { }

  ngOnInit() {
    this.rquestService.getAllReq().subscribe((res:any) =>{
      this.listReq = res;
    })
  }
  public onBack(event) {
    console.log(event);
    this.navCtrl.back();
  }
 
}
