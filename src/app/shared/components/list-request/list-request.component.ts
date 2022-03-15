import { Component, OnInit, Input } from '@angular/core';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as moment from 'moment';
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation'
@Component({
  selector: 'list-request-component',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss'],
  animations: [translateAnimation()]
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
    this.router.navigate([`tabs/detail-request/${requisicaoId}`]);
  }

}
