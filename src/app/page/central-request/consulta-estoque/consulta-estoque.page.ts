import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-consulta-estoque',
  templateUrl: './consulta-estoque.page.html',
  styleUrls: ['./consulta-estoque.page.scss'],
})
export class ConsultaEstoquePage implements OnInit {

  constructor(public navCtrl:NavController,) { }
  centralEstoque:boolean = true;
  ngOnInit() {
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  setEstoque(estoque:boolean){
    this.centralEstoque = estoque;
  }

}
