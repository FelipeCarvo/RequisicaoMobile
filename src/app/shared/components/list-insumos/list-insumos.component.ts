import { Component,OnInit, Input,Output,EventEmitter } from '@angular/core';;

@Component({
  selector: 'app-list-insumos-cp',
  templateUrl: './list-insumos.component.html',
  styleUrls: ['./list-insumos.component.scss'],

})
export class ListInsumosComponent implements OnInit {
  @Input() item: any;
  @Input() itemId:Number;
  @Output()goToInsumoEmpreendimento:EventEmitter<any> = new EventEmitter();;
  constructor() { }
  public get disabled(): boolean { 
    return !!this.itemId && this.itemId == this.item.item}
  ngOnInit() {

  }

}
