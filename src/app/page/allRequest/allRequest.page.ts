import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service';
import { NavController } from '@ionic/angular';
import {translateAnimation} from '@services/animation/custom-animation'
@Component({
  selector: 'app-allRequest',
  templateUrl: './allRequest.page.html',
  styleUrls: ['./allRequest.page.scss'],
  animations: [translateAnimation()]
})
export class AllRequestPage implements OnInit {
  listReq: Array<any>;
  load = false;
  constructor(private router:Router,private rquestService:RequestService, private navCtrl: NavController,) { }

  ngOnInit() {
    this.rquestService.getReq().subscribe((res:any) =>{
      this.listReq = res;
      setTimeout(()=>{
        this.load = true;
      })
    })
  }
  public onBack(event) {
    this.navCtrl.back();
  }
 
}
