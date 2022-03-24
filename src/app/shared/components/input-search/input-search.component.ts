import { Component,OnInit, Input,ViewChild,EventEmitter,Output,forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  Validator 
} from '@angular/forms';
@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputSearchComponent),
    multi: true
   }]

})

export class InputSearchComponent implements OnInit {
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) inputAutoComplete: MatAutocompleteTrigger;
  @Output() setUnidadeType:EventEmitter<any> = new EventEmitter();
  @Input() label: string;
  @Input() placeholder: string;
  @Input() controlName: any;
  @Input() parentForm:FormGroup;
  @Input() listItemFilter:any;
  @Input() pesquisa:any;
  @Input() disabledCondition:any;
  @Input() formName:string;
  @Input() msgDisabled?:string;
  listGroup:any = [];
  loading = false;
  refreshLoad= false;
  noSearchResult = false;
  disablebuttonTest = false;
  constructor(private loockupstService:LoockupstService,
  ){

  }
  ngOnInit(): void {
    if(!!this.getValue() || this.formName == 'insumos' && this.controlName == 'empresaId'){
      this.refreshLoad = true;
      this.getLoockups();
    }
  }

  get setDisableButton():boolean{
    let disable = false;
     if(!!this.disabledCondition){
       let obj = this.pesquisa
       let o = Object.keys(obj)
       .filter((a,k) => obj[k] == null && a !='pesquisa')
       .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
       disable = Object.values(o).filter(e => e!=null && e!=``).length == 0
     
     }
    return disable
  } 
  displayFn(value = this.getValue()) {
    if(!!value && this.listGroup.length > 0){
      let desc =  this.listGroup.filter(option => option.id == value)[0]?.descricao
      if(this.controlName === "insumoId"){
        this.setUnidadeType.emit(desc)
      }
      return desc
    }
  }
 
  getValue(){
    return this.parentForm.get(this.controlName).value 
  }
  clearField(){
    this.parentForm.controls[this.controlName].setValue('');
    if(this.controlName === "insumoId"){
      this.setUnidadeType.emit(null)
    }
  }
  focusout(){
    if(this.noSearchResult){
     this.clearField();
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
      this.listGroup = await this.loockupstService.getLookUp(params,enumName);
      if(this.formName == 'insumos' && this.controlName =="empresaId"){
        let value = this.listGroup[0].id;
        this.parentForm.controls[this.controlName].setValue(value);
      }
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
          let value = this.getValue();
          const selectedValue = value;
          //this.parentForm.controls[this.controlName].setValue(value);
          this.refreshLoad = false;
          if(!!selectedValue){
            let testValidation = !!this.listGroup.find(e => e.id == selectedValue);
            if(!testValidation){
              this.parentForm.controls[this.controlName].setValue('')
            }else{
              this.parentForm.controls[this.controlName].setValue(value);
            }
          }
        }else{
          this.inputAutoComplete.openPanel();
        }
      },300)

    }
  }
  private _filter(value: string,res): string[] {
    console.log(value, !!value)
    let filterValue = !!value ? value.toLocaleLowerCase(): value;
    return this.listGroup.filter(option => option.descricao.toLowerCase().includes(filterValue));
  }

}
