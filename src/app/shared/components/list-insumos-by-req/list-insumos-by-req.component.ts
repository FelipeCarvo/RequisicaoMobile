import { Component, OnInit,Input,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
@Component({
    selector: 'app-list-insumos-by-req',
    templateUrl: './list-insumos-by-req.component.html',
    styleUrls: ['./list-insumos-by-req.component.scss'],
    animations: [
        trigger('grow', [
            transition(':enter', [
                // :enter is alias to 'void => *'
                style({ height: '0', overflow: 'hidden', opacity: 0 }),
                animate(300, style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                // :leave is alias to '* => void'
                animate(500, style({ height: 0, overflow: 'hidden', opacity: 0 }))
            ])
        ])
    ],
    standalone: false
})
export class ListInsumosByReqComponent implements OnInit {
  @Input()item: any;
  @Output() editInsumo: EventEmitter<any> = new EventEmitter();
  @Output() excludeInsumo: EventEmitter<any> = new EventEmitter();
  showButtons = false;
  constructor(
    private cdr: ChangeDetectorRef,
    public router: Router,
  ) { }

  ngOnInit() {}
  editItem(id){
    this.editInsumo.emit(id);
  }
  exludeItem(id){
    this.excludeInsumo.emit(id);
  }
  displayButtons(){
    this.showButtons = !this.showButtons;
    // this.cdr.detectChanges();
  }
  controleEstoque(id){
    this.router.navigate(['tabs/central-req/consulta-estoque/'+id]);
  }

}
