import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '@services/request/request.service'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage {
  listReq: Array<any>;
  constructor(private router:Router,private rquestService:RequestService) {}
  ngOnInit() {
    this.rquestService.getAllReq().subscribe((res:any) =>{
      this.listReq = res;
      console.log(res)
    })
  }
  newRequest(){
    this.router.navigate(['/tabs/request']);
  }
  viewAllRequest(){
    this.router.navigate(['/tabs/all-request']);
    
  }

}
