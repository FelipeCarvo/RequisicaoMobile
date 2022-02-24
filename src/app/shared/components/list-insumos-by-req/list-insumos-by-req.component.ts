import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-list-insumos-by-req',
  templateUrl: './list-insumos-by-req.component.html',
  styleUrls: ['./list-insumos-by-req.component.scss'],
})
export class ListInsumosByReqComponent implements OnInit {
  @Input()item: any;
  constructor() { }

  ngOnInit() {}

}
