import { Component,OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-insumos-cp',
  templateUrl: './list-insumos.component.html',
  styleUrls: ['./list-insumos.component.scss'],

})
export class ListInsumosComponent implements OnInit {
  @Input() item: any;
  @Input() loaded:boolean;
  constructor() { }

  ngOnInit() {}

}
