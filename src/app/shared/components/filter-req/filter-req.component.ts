import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoockupstService } from '@services/lookups/lookups.service';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { formatISO, isSameDay } from 'date-fns';
@Component({
  selector: 'app-filter-req',
  templateUrl: './filter-req.component.html',
  styleUrls: ['./filter-req.component.scss']
})
export class FilterReqComponent implements OnInit {
  public filterForm: UntypedFormGroup;
  @Input() statusRequisicao: number;
  @Input() dataInicial: any;
  @Input() dataFinal: any;
  @Input() empreendimento: string;
  @Output() setParams: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) inputAutoComplete: MatAutocompleteTrigger;
  listGroup: any = [];
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  listItemFilter: Observable<any[]>;
  noSearchResult = false;
  //showInput = false;
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
  ];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private loockupstService: LoockupstService,
  ) {

  }
  get _status() {
    return this.filterForm.get('status').value;
  }
  get _dataInicio(){

    return this.filterForm.get('dataInicio').value;
  }
  get _dataFim(){
    return this.filterForm.get('dataFim').value;
  }
  get hasValueEmpreendimento(){

    return this.filterForm.get('empreendimento').value;
  }
  get _disabledButton(){
    const validOne = isSameDay(this._dataInicio, this.dataInicial);
    const validTwo = isSameDay(this._dataFim, this.dataFinal);
    const validThree = this.statusRequisicao === this._status;
    const validFour = this.empreendimento === this.hasValueEmpreendimento;
    const validation = !validOne || !validTwo || !validThree || !validFour;
    return !validation;
  }
  ngOnInit() {
    this.initForm();
    this.getLookUp();
  }
  formatDate(date){
    return  formatISO(date, { representation: 'complete' });
  }
  clearField(){
    this.filterForm.controls['empreendimento'].setValue('');
  }
  apllyFilter(){
    const payload = this.filterForm.getRawValue();
    payload.dataInicio = new Date(payload.dataInicio);
    payload.dataFim = new Date(payload.dataFim);

    this.setParams.emit(payload);
  }
  selectedTextOption() {
    return this.filterStatus.filter(option => option.id === this._status)[0]?.status;
  }

  async getLookUp(){
    const params = {pesquisa:''};
    const enumName = 'empreendimentoId';
    if(this.listGroup.length === 0){
      this.listGroup = await this.loockupstService.getLookUp(params,enumName);
    }
    //this.showInput = true;
    this.listItemFilter = this.filterForm.get('empreendimento').valueChanges.pipe(
      startWith(''),
      map((value) => {

        const filterValue = this._filter(value,this.listGroup);
        this.noSearchResult = filterValue.length === 0;
        return filterValue;
      }),
    );
  }
  showPanel(){
    this.inputAutoComplete.openPanel();
  }
  displayFn(value = this.hasValueEmpreendimento) {
    if(!!value && this.listGroup.length > 0){
      const desc =  this.listGroup.filter(option => option.id === value)[0]?.descricao;
      return desc;
    }
  }
  private _filter(value: string, res): string[] {
    const filterValue = value;
    return this.listGroup.filter(option => option.descricao.toLowerCase().includes(filterValue.toLowerCase()));
  }


  private initForm(): void {
    this.filterForm = this.formBuilder.group({
      empreendimento:  [this.empreendimento, [Validators.required]],
      status: [this.statusRequisicao, [Validators.required]],
      dataInicio: [this.dataInicial.toISOString(), [Validators.required]],
      dataFim: [this.dataFinal.toISOString(), [Validators.required]]
    });
  }

}
