import { Component, OnInit,Input,Output,EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-filter-req',
  templateUrl: './filter-req.component.html',
  styleUrls: ['./filter-req.component.scss']
})
export class FilterReqComponent implements OnInit {
  public filterForm: FormGroup;
  @Input() statusRequisicao: Number;
  @Input() dataInicial:any;
  @Input() dataFinal:any;
  @Output() setParams:EventEmitter<any> = new EventEmitter();
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  filterStatus = [
    {status:'Reprovada',id:1},
    {status:'Não Concluída',id:2},
    {status:'Em Aprovação',id:3},
    {status:'Aprovada para Cotação',id:4},
    {status:'Aprovada para OF',id:5},
    {status:'Cancelada',id:6},
    {status:'Aprovação Cancelada',id:7},
    {status:'Aprovada para OF Transferência',id:8},
    {status:'Aprovada para BT',id:9}
  ]
  constructor(
    private formBuilder: FormBuilder,
  ) { 
    
  }
  private initForm(): void {
    this.filterForm = this.formBuilder.group({
      status: [this.statusRequisicao, [Validators.required]],
      dataInicio: [this.dataInicial.toISOString(), [Validators.required]],
      dataFim: [this.dataFinal.toISOString(), [Validators.required]]
    });
  }
  get _status() {
    return this.filterForm.get("status").value;
  }
  get _dataInicio(){
    return this.filterForm.get("dataInicio").value;
  }
  get _dataFim(){
    return this.filterForm.get("dataFim").value;
  }    
  ngOnInit() {
    this.initForm()
  }
  apllyFilter(){
    const payload = this.filterForm.getRawValue();
    this.setParams.emit(payload);
  }
  selectedTextOption() {
    return this.filterStatus.filter(option => option.id == this._status)[0]?.status
  }

}
