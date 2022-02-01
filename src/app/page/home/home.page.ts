import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service'
import {opacityAnimation} from '@services/animation/custom-animation'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [opacityAnimation()]
})
export class homePage {
  listReq: Array<any>;
  load = false;
  constructor(private router:Router,private rquestService:RequestService) {}
  ngOnInit() {
   this.getReq()
  }
  newRequest(){
    this.router.navigate(['/tabs/request']);
  }
  viewAllRequest(){
    this.router.navigate(['/tabs/all-request']);
  }
  getReq(){
    this.rquestService.getReq().subscribe((res:any) =>{
      this.listReq = res;
      setTimeout(()=>{
        this.load = true;
      },200)
    })
  }

}
