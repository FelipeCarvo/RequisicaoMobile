import { Component, OnInit, Input } from '@angular/core';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'list-request-component',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss'],
})
export class ListRequest implements OnInit {
  @Input() name: string;
  @Input() item: any;
  currentClass:boolean
  constructor(private router:Router) {
    
   }

  ngOnInit() {
   this.currentClass = this.router.url.includes('/home') ;
  }
  getStauts(status){
   return EnumStatus[status]
  }
  goToDetail(id){
    this.router.navigate([`/detail-request/${id}`]);
  }

}
