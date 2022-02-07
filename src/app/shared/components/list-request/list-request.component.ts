import { Component, OnInit, Input } from '@angular/core';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as moment from 'moment';
@Component({
  selector: 'list-request-component',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss'],
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({transform: 'translateY(0)'})),
      state('false', style({transform: 'translateY(100%)' })),
      transition('false <=> true', animate(500))
    ])
  ]
})
export class ListRequest implements OnInit {
  @Input() name: string;
  @Input() item: any;
  @Input() loaded:boolean;
  currentClass:boolean
  constructor(private router:Router) {
    
   }
   getDate(date) {

    return moment(date).format('DD/MM/YYYY');
  }
  ngOnInit() {
   this.currentClass = this.router.url.includes('/home') ;
  }
  getStauts(status){
   return EnumStatus[status]
  }
  goToDetail(requisicaoId){
    this.router.navigate([`/detail-request/${requisicaoId}`]);
  }

}
