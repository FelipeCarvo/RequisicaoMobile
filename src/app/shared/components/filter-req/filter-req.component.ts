import { Component, OnInit,Input,Output,EventEmitter, OnChanges, SimpleChanges,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {RequestFormInterface} from '@services/utils/interfaces/reqForm.interce';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
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
  @Input()empreendimentoDescricao: String;
  @Output() setParams:EventEmitter<any> = new EventEmitter();
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) inputAutoComplete: MatAutocompleteTrigger;
  listGroup:any = [];
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  listItemFilter: Observable<string[]>;
  noSearchResult = false;
  showInput = false;
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
    private loockupstService:LoockupstService,
  ) { 
    
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
  get hasValueEmpreendimento(){

    return this.filterForm.get('empreendimento').value 
  }
  get _disabledButton(){
    let validOne = moment(this.formatDate(this._dataInicio)).isSame(this.formatDate(this.dataInicial));
    let validTwo = moment(this.formatDate(this._dataFim)).isSame(this.formatDate(this.dataFinal));
    let validThree = this.statusRequisicao == this._status;
    let validFour = this.empreendimentoDescricao == this.hasValueEmpreendimento;
    let validation = !validOne || !validTwo || !validThree || !validFour;
    return !validation
  }
  ngOnInit() {
    this.initForm();
    this.getLookUp();
  }
  private initForm(): void {
    this.filterForm = this.formBuilder.group({
      empreendimento:  [this.empreendimentoDescricao, [Validators.required]],
      status: [this.statusRequisicao, [Validators.required]],
      dataInicio: [this.dataInicial.toISOString(), [Validators.required]],
      dataFim: [this.dataFinal.toISOString(), [Validators.required]]
    });
  }
  formatDate(date){
    return  moment(date).format('YYYY-MM-DD')
  }    
  clearField(){
    this.filterForm.controls['empreendimento'].setValue('');
  }
  apllyFilter(){
    const payload = this.filterForm.getRawValue();
  
    this.setParams.emit(payload);
  }
  selectedTextOption() {
    return this.filterStatus.filter(option => option.id == this._status)[0]?.status
  }

  async getLookUp(){
    const params = {pesquisa:''}
    const enumName = 'empreendimentoId';
    if(this.listGroup.length == 0){
      this.listGroup = await this.loockupstService.getLookUp(params,enumName);
    }
    this.showInput = true;
    this.listItemFilter = this.filterForm.get('empreendimento').valueChanges.pipe(
      startWith(''),
      map((value) => {
        
        let filterValue = this._filter(value,this.listGroup);
        this.noSearchResult = filterValue.length == 0;
        return filterValue
      }),
    );
  }
  showPanel(){
    this.inputAutoComplete.openPanel();
  }
  displayFn(value = this.hasValueEmpreendimento) {
    console.log('display',this.listGroup);
    if(!!value && this.listGroup.length > 0){
      let desc =  this.listGroup.filter(option => option.descricao == value)[0]?.descricao
      return desc
    }
  }
  private _filter(value: string,res): string[] {
    const filterValue = value;
    return this.listGroup.filter(option => option.descricao.toLowerCase().includes(filterValue.toLowerCase()));
  }



}
