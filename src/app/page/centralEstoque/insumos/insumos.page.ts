import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.page.html',
  styleUrls: ['./insumos.page.scss'],
})
export class InsumosPage{

  constructor(public navCtrl:NavController, private router:Router) { }

  ngOnInit() {}
  public dismiss(): void {
    this.navCtrl.back();
  }
  public goCentralEstoque(){
    this.router.navigate(['/central-estoque/consulta-estoque']);
  }
}
