import { Component,OnInit, Input,ViewChild,EventEmitter,Output,forwardRef,ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith,debounceTime,distinctUntilChanged,switchMap} from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, of,} from 'rxjs';
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
  @Output() changeQtdEtapa:EventEmitter<any> = new EventEmitter();
  @Input() DisabledInput:boolean = false;
  @Input() label: string;
  @Input() hasQtdOr:Boolean;
  @Input() placeholder: string;
  @Input() controlName: any;
  @Input() parentForm:UntypedFormGroup;
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
  firstLoad = false;
  constructor(
    private loockupstService:LoockupstService,
    private cdr: ChangeDetectorRef
  ){

  }
  changeEtapa(ev){
    if(ev?.detail){
      this.changeQtdEtapa.emit(ev?.detail?.checked);
      let hasId = !!this.parentForm.get(this.controlName).value
      if(hasId){
        setTimeout(()=>{
          this.refreshLoad = true;
          this.getLoockups();
        },100)

      }
    }
  }
  async ngOnInit() {
    if(!!this.getValue || this.formName == 'insumos' && this.controlName == 'empresaId'){

      this.refreshLoad = true;
      await this.getLoockups();
      this.firstLoad = true;
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
    return disable || this.DisabledInput;
  }
  displayFn(value = this.getValue) {
    if(!!value){
      if(this.listGroup.length == 0){
        this.getLoockups();
      }
      let filtredList = this.listGroup.find(option => option.id == value)
      let desc =  !!filtredList ? filtredList.descricao : '';
      if(this.controlName === "insumoId"){
        this.setUnidadeType.emit(desc)
      }
      return desc.trim()
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
    this.cdr.detectChanges();
 }
  focusout(){
    if(this.noSearchResult){
     this.clearField();
    }
  }
  async getLoockups(){

      this.loading = true;
      let enumName = this.controlName;
      let hasValue = !!this.getValue;
      let params = this.pesquisa;
      if(this.formName == 'insumos' && this.controlName == 'empresaId'){
        enumName = 'EmpresasDoEmpreendimento'

      }
      if(this.listGroup.length == 0 || this.updateInsumos){
        if(!!this.updateInsumos)
        {
          this.listGroup = []
        };

        if(this.updateInsumos){
          this.setfalseUpdate.emit()
        }
      }
      if(this.listGroup.length == 0){
        if(hasValue){
          params.valorSelecionado = this.getValue
        }
        this.listGroup = await this.loockupstService.getLookUp(params,enumName);
        if(!! params.valorSelecionado){
          params.valorSelecionado = '';
        }

      }
      if(this.formName == 'insumos' && this.controlName =="empresaId" && !hasValue){

        let vigente = this.listGroup.filter(list => !!list.vigente);
        let value;
        if(vigente.length > 0){
          value = vigente[0].id;
        }else{
          value = this.listGroup[0].id;
        }
        this.parentForm.controls[this.controlName].setValue(value);
      }
      this.listItemFilter = this.parentForm.get(this.controlName).valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          let filterValue = this.filter(val || '');
          return filterValue
        })
      );

      setTimeout(()=>{
        this.loading = false;
          this.refreshLoad = false;
          if(!!this.getValue){
            let testValidation = !!this.listGroup.find(e => e.id == this.getValue);
            if(!testValidation){
              this.parentForm.controls[this.controlName].setValue('');
              // this.inputAutoComplete.openPanel();
            }
              let hasInsumos = !!this.parentForm.controls['insumoId']?.value;
              if(this.controlName == 'planoContasId' && hasInsumos && this.firstLoad){
                //this.parentForm.controls['insumoId'].setValue(null);
              }
              if(this.controlName == 'insumoId'){
                let filterValue:any = this.listGroup.find(o =>o.id == this.getValue);
                if(!!filterValue && !!filterValue.planoContasPadraoId){
                  let {planoContasPadraoId} = filterValue;
                  if(!!planoContasPadraoId){
                    this.parentForm.controls['planoContasId'].setValue(planoContasPadraoId);
                  }
                }
              }
              this.parentForm.controls[this.controlName].setValue(this.getValue);

          }
      },300)
  }
  setPlans(val){

  }
  filter(val: string): Observable<any[]> {
    let enumName = this.controlName;
    if(this.formName == 'insumos' && this.controlName == 'empresaId'){
      enumName = 'EmpresasDoEmpreendimento'
    }
    let find = this.listGroup.find(el =>el.id == val);
    if(this.listGroup.length > 0 && !!find){
     return of(this.listGroup)
    }
    let searh = this.pesquisa;
    searh.pesquisa = val;
    // call the service which makes the http-request
    return this.loockupstService.getLookUpOb(searh,enumName)
     .pipe(
       map(response => {
        this.listGroup = response;
        this.noSearchResult = response.length == 0
        return response
      })
     )
   }

   public objetoSelecionado()
   {
     let selecionado = this.getValue;
     if (!selecionado)
       return null;
     let obj = this.listGroup.find(item => item.id === selecionado);
     return obj;

   }

}
