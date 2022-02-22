import { Component, OnChanges, Input, OnInit,ViewContainerRef,ViewChild,ChangeDetectorRef } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith,switchMap} from 'rxjs/operators';
// import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {RequestFormInterface} from '@services/utils/interfaces/reqForm.interce'

export class HashDirective  {
  @Input() hash: string;

  constructor(public vcRef: ViewContainerRef) {}
}
@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],

})

export class InputSearchComponent implements OnInit {
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) inputAutoComplete: MatAutocompleteTrigger;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() controlName: any;
  @Input() parentForm:FormGroup;
  @Input() listItemFilter:any;
  @Input() pesquisa:any;
  @Input() disabledCondition:any;
  @Input() disabledFieldName:string;
  @Input() formName:string;
  msgDisabled:string;
  listGroup:any = [];
  loading = false;
  refreshLoad= false;
  noSearchResult = false;
  constructor(private loockupstService:LoockupstService,
    private cdr: ChangeDetectorRef){

  }
  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
  ngOnInit() {

    if(!!this.getValue()){
      this.refreshLoad = true;
      this.getLoockups();
     
    }
  }
   
  displayFn(value = this.getValue()) {
    if(!!value && this.listGroup.length > 0){
      return this.listGroup.filter(option => option.id == value)[0]?.descricao
    }
  
  }
  viewDisabled():boolean{
    let type = !!this.disabledCondition ? this.getValidInput(this.disabledCondition) : false;
    let type1 = !!this.controlName ? this.getValidInput(this.controlName) : false;
    console.log(type)
    if(!!type){
      this.msgDisabled = `Preencha primeiramente o ${this.disabledFieldName}`
      this.parentForm.get(this.controlName).disable();
    }else if(type){
      this.parentForm.get(this.controlName).enable();
    }
     if(!!type1){
      this.msgDisabled = `${this.placeholder} é um campo obrigatório`
    }
    return type || type1 || this.refreshLoad
  }
  getValidInput(FormControl){
    return this.parentForm.get(FormControl).invalid
  }
  getValue(){
    return this.parentForm.get(this.controlName).value 
  }
  focusout(){
    if(this.noSearchResult){
      this.parentForm.controls[this.controlName].setValue(null)
    }
  }
  async getLoockups(){
    if (!this.listItemFilter){
      this.loading = true;
      const params = this.pesquisa;
      let enumName = this.controlName
      if(this.formName == 'insumos' && this.controlName == 'empresaId'){
        enumName = 'EmpresasDoEmpreendimento'
      }
      // if(!!this.getValue()){
      //   params.valorSelecionado = this.getValue();
      // }
      // const test:RequestFormInterface = {motivos: {pesquisa:'',valorSelecionado:this.getValue()}};
      this.listGroup = await this.loockupstService.getLookUp(params,enumName);
      this.listItemFilter = this.parentForm.get(this.controlName).valueChanges.pipe(
        startWith(''),
        map((value) => {
          let filterValue = this._filter(value,this.listGroup);
          this.noSearchResult = filterValue.length == 0;

          return filterValue
        }),
      );
      setTimeout(()=>{
        this.loading = false;
        if(this.refreshLoad){
          this.parentForm.controls[this.controlName].setValue(this.getValue());
          this.refreshLoad = false;
        }else{
          this.inputAutoComplete.openPanel();
        }
      },300)
    }
  }
  private _filter(value: string,res): string[] {
    const filterValue = value;
    return this.listGroup.filter(option => option.id.includes(filterValue));
  }

}
