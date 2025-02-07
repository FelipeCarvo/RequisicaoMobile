import { Component, OnInit, Input } from '@angular/core';
import {EnumStatus} from '@services/utils/enums/EnumStatus';
import { Router } from '@angular/router';

import {translateAnimation} from '@services/animation/custom-animation'
@Component({
    selector: 'list-request-component',
    templateUrl: './list-request.component.html',
    styleUrls: ['./list-request.component.scss'],
    animations: [translateAnimation()],
    standalone: false
})
export class ListRequest implements OnInit {
  @Input() name: string;
  @Input() item: any;
  @Input() loaded:boolean;
  currentClass:boolean
  constructor(private router:Router) {
    
   }

  ngOnInit() {
   this.currentClass = this.router.url.includes('/home') ;
  }
  goToDetail(requisicaoId){
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`tabs/detail-request/${requisicaoId}`]);
  }

}
