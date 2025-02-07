import { Component,OnInit, Input,Output,EventEmitter } from '@angular/core';;

@Component({
    selector: 'app-list-req-frota',
    templateUrl: './list-insumos.component.html',
    styleUrls: ['./list-insumos.component.scss'],
    standalone: false
})
export class ListInsumosComponent implements OnInit {
  @Input() item: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Input() itemId: Number;
  @Output()goToInsumoEmpreendimento: EventEmitter<any> = new EventEmitter();;
  constructor() { }
  public get disabled(): boolean {
    return !!this.itemId && this.itemId === this.item.item;};
  ngOnInit() {

  }

}
