import { Component,OnInit, Input,ViewChild,EventEmitter,Output,forwardRef,ChangeDetectorRef } from '@angular/core';
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
  @Output() setfalseUpdate:EventEmitter<any> = new EventEmitter();
  @Output() emitFieldClean:EventEmitter<any> = new EventEmitter();
  @Input() label: string;
  @Input() placeholder: string;
  @Input() controlName: any;
  @Input() parentForm:FormGroup;
  @Input() listItemFilter:any;
  @Input() pesquisa:any;
  @Input() disabledCondition:any;
  @Input() formName:string;
  @Input()updateInsumos:Boolean;
  @Input() msgDisabled?:string;
  listGroup:any = [];
  loading = false;
  refreshLoad= false;
  noSearchResult = false;
  disablebuttonTest = false;
  filterDesc = false;
  
  constructor(
    private loockupstService:LoockupstService,
    private cdr: ChangeDetectorRef
  ){

  }
  ngOnInit(): void {
    if(!!this.getValue || this.formName == 'insumos' && this.controlName == 'empresaId'){
      this.refreshLoad = true;
      this.getLoockups();
    }
  }
  get getRequerid():boolean{
    return !!this.parentForm.get(this.controlName).errors?.required 
  }
  get getValue(){
    return this.parentForm.get(this.controlName).value 
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
  displayFn(value = this.getValue) {
   
    if(!!value){
      if(this.listGroup.length  == 0){
        this.getLoockups();
      }
      let desc =  this.listGroup.filter(option => option.id == value)[0]?.descricao
      if(this.controlName === "insumoId"){
        this.setUnidadeType.emit(desc)
      }
      return desc
    }
  }
 
  clearField(){
    this.parentForm.controls[this.controlName].setValue(null);
    this.emitFieldClean.emit({[this.controlName]:null});
    if(this.controlName === "insumoId"){
      this.setUnidadeType.emit(null)
    }
  }
  openPanel(){
    setTimeout(()=>{
      this.inputAutoComplete.openPanel();
    },200)
 
  }
  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
  focusout(){
    if(this.noSearchResult){
     this.clearField();
    }
  }
  async getLoockups(){
      this.loading = true;
      const params = this.pesquisa;
      let enumName = this.controlName
      if(this.formName == 'insumos' && this.controlName == 'empresaId'){
        enumName = 'EmpresasDoEmpreendimento'
      }
      if(this.listGroup.length == 0 || this.updateInsumos){
        if(!!this.updateInsumos) this.listGroup = []
        this.listGroup = await this.loockupstService.getLookUp(params,enumName);
        if(this.updateInsumos){
          this.setfalseUpdate.emit()
        }
      }
     
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
          this.refreshLoad = false;
          if(!!this.getValue){
            let testValidation = !!this.listGroup.find(e => e.id == this.getValue);
            if(!testValidation){
              this.parentForm.controls[this.controlName].setValue('');
              this.inputAutoComplete.openPanel();
            }else{
              let hasInsumos = !!this.parentForm.controls['insumoId'].value;
              if(this.controlName == 'planoContasId' && hasInsumos){
                this.parentForm.controls['insumoId'].setValue(null);
              }
              if(this.controlName == 'insumoId'){
             
                let filterValue:any = this._filter(this.getValue,this.listGroup)[0];
                if(!!filterValue && !!filterValue.planoContasPadraoId){
                 
                  let {planoContasPadraoId} = filterValue
                  let hasPlan = !!this.parentForm.controls['planoContasId'].value;
                  if(!hasPlan){
                    this.parentForm.controls['planoContasId'].setValue(planoContasPadraoId);
                  }

                }
              }
              this.parentForm.controls[this.controlName].setValue(this.getValue);
            }
          }
      },300)
  }
  setPlans(val){

  }
  private _filter(value: string,res): string[] {
    let filter;
    if(!!value){
      filter =this.listGroup.filter(option => 
        option.descricao.toLowerCase().includes(value.toLocaleLowerCase()) || option.id === value);
    }else{
      filter = this.listGroup;
    }
    return filter;
  }

}
