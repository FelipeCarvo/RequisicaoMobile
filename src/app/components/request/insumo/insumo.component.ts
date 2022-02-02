import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss'],
})
export class InsumoComponent implements OnInit {
  @Input()validForm;
  constructor(public modalController: ModalController,public router:Router) { }

  ngOnInit() {}
  presentModal(){
    if(this.validForm){
      this.router.navigate(['/central-estoque/insumos']);
    }
  }

}
