import { Component, OnInit,Input,Output ,EventEmitter} from '@angular/core';

@Component({
    selector: 'app-step-two',
    templateUrl: './step-two.component.html',
    styleUrls: ['./step-two.component.scss'],
    standalone: false
})
export class StepTwoComponent implements OnInit {
  @Input() itemSelect;
  @Input() itemEstoque: any;
  @Output() sendEstoque: EventEmitter<any> = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {

  }
  reservar(){
    const postObj = {
      ri:this.itemSelect.ri,
      itemEstoque:this.itemSelect.item,
      itemRequisicao:this.itemEstoque.itemRequisicao,
      quantidade:this.itemEstoque.quantidadeReservada,
    }
   this.sendEstoque.emit(postObj) //
  }
}
