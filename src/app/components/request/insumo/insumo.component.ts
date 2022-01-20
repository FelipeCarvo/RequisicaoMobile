import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss'],
})
export class InsumoComponent implements OnInit {

  constructor(public modalController: ModalController,public router:Router) { }

  ngOnInit() {}
  presentModal(){
    this.router.navigate(['/central-estoque/insumos']);
  }

}
