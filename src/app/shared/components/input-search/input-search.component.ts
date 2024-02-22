import { Component,OnInit, Input,ViewChild,EventEmitter,Output,forwardRef,ChangeDetectorRef, AfterViewChecked, TemplateRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith,debounceTime,distinctUntilChanged,switchMap} from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
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

export class InputSearchComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) inputAutoComplete: MatAutocompleteTrigger;
  @Output() setUnidadeType: EventEmitter<any> = new EventEmitter();
  @Output() setfalseUpdate: EventEmitter<any> = new EventEmitter();
  @Output() emitFieldClean: EventEmitter<any> = new EventEmitter();
  @Output() changeQtdEtapa: EventEmitter<any> = new EventEmitter();
  @Input() itemTemplate: TemplateRef<any>;
  @Input() DisabledInput = false;
  @Input() label: string;
  @Input() hasQtdOr: Boolean;
  @Input() placeholder: string;
  @Input() controlName: any;
  @Input() parentForm: UntypedFormGroup;
  @Input() listItemFilter: any;
  @Input() pesquisa: any;
  @Input() disabledCondition: any;
  @Input() formName: string;
  @Input()updateInsumos: Boolean;
  @Input() msgDisabled?: string;
  @Input() nomeUrlDados: string;
  listGroup:any = [];
  loading = false;
  refreshLoad= false;
  noSearchResult = false;
  disablebuttonTest = false;
  filterDesc = false;
  firstLoad = false;

  constructor(
    private loockupstService: LoockupstService,
    private cdr: ChangeDetectorRef
  ){

  }
  changeEtapa(ev){
    if(ev?.detail){
      this.changeQtdEtapa.emit(ev?.detail?.checked);
      const hasId = !!this.parentForm.get(this.controlName).value;
      if(hasId){
        setTimeout(()=>{
          this.refreshLoad = true;
          this.getLoockups();
        },100);

      }
    }
  }
  async ngOnInit() {
    if(!!this.getValue || this.formName === 'insumos' && this.controlName === 'empresaId'){

      this.refreshLoad = true;
      await this.getLoockups();
      this.firstLoad = true;
    }
  }

  get getRequerid(): boolean{
    return !!this.parentForm.get(this.controlName).errors?.required;
  }

  get getValue(){
    return this.parentForm.get(this.controlName).value;
  }

  get setDisableButton(): boolean{
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
      if(this.listGroup.length === 0){
        this.getLoockups();
      }
      let filtredList = this.listGroup.find(option => option.id.toLowerCase() === value.toLowerCase());
      let desc =  !!filtredList ? filtredList.descricao : '';
      if(this.controlName === 'insumoId'){
        this.setUnidadeType.emit(desc);
      }
      return desc.trim();
    }
  }

  async clearField(){
    this.pesquisa.pesquisa = '';
    this.pesquisa.valorSelecionado = null;
    this.parentForm.controls[this.controlName].setValue(null);
    await this.getLoockups();
    this.emitFieldClean.emit({[this.controlName]:null});
    if(this.controlName === 'insumoId'){
      this.setUnidadeType.emit(null);
    }
  }

  openPanel(){
    setTimeout(()=>{
      this.inputAutoComplete.openPanel();
    },200);

  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
 }
  focusout(){
    if(this.noSearchResult){
     this.clearField();
    }
  }

  async apagaEAbre() {
    await this.clearField();
    this.openPanel();
  }

  async getLoockups(){
      console.log(this.controlName);
      this.loading = true;
      const enumName = this.getEnumName();
      const hasValue = !!this.getValue;
      const params = this.pesquisa;
      if(this.listGroup.length === 0 || this.updateInsumos){
        if(!!this.updateInsumos)
        {
          this.listGroup = [];
        };

        if(this.updateInsumos){
          this.setfalseUpdate.emit();
        }
      }
      if(this.listGroup.length === 0){
        if(hasValue && (this.isUUID(this.getValue))){
          params.valorSelecionado = this.getValue;
        }

        this.listGroup = await this.loockupstService.getLookUp(params,enumName);
        //if(!! params.valorSelecionado){
        //  params.valorSelecionado = '';
        //}

      }
      if(this.formName === 'insumos' && this.controlName === 'empresaId' && !hasValue){

        const vigente = this.listGroup.filter(list => !!list.vigente);
        let value;
        if(vigente.length > 0){
          value = vigente[0].id;
        }else{
          value = this.listGroup[0].id;
        }
        this.parentForm.controls[this.controlName].setValue(value);
      }

      this.criarEventoNoForm();

      setTimeout(()=>{
        this.loading = false;
          this.refreshLoad = false;
          if(!!this.getValue){
            const testValidation = !!this.listGroup.find(e => e.id.toLowerCase() === this.getValue.toLowerCase());
            if(!testValidation){
              this.parentForm.controls[this.controlName].setValue('');
              // this.inputAutoComplete.openPanel();
            }
              const hasInsumos = !!this.parentForm.controls['insumoId']?.value;
              if(this.controlName === 'planoContasId' && hasInsumos && this.firstLoad){
                // não sei o motivo dessa linha, mas deixa o insumo vazio na edição
                //this.parentForm.controls['insumoId'].setValue(null);
              }
              if(this.controlName === 'insumoId'){
                const filterValue:any = this.listGroup.find(o =>o.id.toLowerCase() === this.getValue.toLowerCase());
                if(!!filterValue && !!filterValue.planoContasPadraoId){
                  const {planoContasPadraoId} = filterValue;
                  if(!!planoContasPadraoId){
                    this.parentForm.controls['planoContasId'].setValue(planoContasPadraoId);
                  }
                }
              }
              this.parentForm.controls[this.controlName].setValue(this.getValue);

          }
      },300);
  }


  isUUID(str: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  filter(val: string): Observable<any[]> {
    console.log('entrou no filter');
    const enumName = this.getEnumName();
    const searh = this.pesquisa;
    searh.pesquisa = '';
    const find = this.listGroup.find(el => (el.id.toLowerCase() === val.toLowerCase()));
    if (this.listGroup.length > 0 && !!find) {
      searh.valorSelecionado = find.id;
      console.log('Novo valor selecionado ' + searh.valorSelecionado);
      return of(this.listGroup);
    }

    if (this.isUUID(val)) {
      searh.valorSelecionado = val;
    }
    else {
      searh.pesquisa = val;
      const valorAtual = this.getValue;
      if (this.isUUID(valorAtual)) {
        searh.valorSelecionado = valorAtual;
      }
    }

    // call the service which makes the http-request
    return this.loockupstService.getLookUpOb(searh, enumName)
      .pipe(
        map(response => {
          this.listGroup = response;
          this.noSearchResult = response.length === 0;

          return response;
        })
      );
   }

  public async defineValorPorId(id: string) {
    this.pesquisa.valorSelecionado = id;
    this.listItemFilter = this.filter(id);
    this.listItemFilter.subscribe({
      next: (a) => { console.log(a); },
      complete: () => {
        console.log('terminou');
        this.parentForm.controls[this.controlName].setValue(id);
      }
    });
  }

  public async defineValorPorPesquisa(consulta: string) {
    this.pesquisa.pesquisa = consulta;
    this.listItemFilter = this.filter(consulta);
    let lista = null;
    this.listItemFilter.subscribe({
      next: (a) => { lista = a; },
      complete: () => {
        console.log('terminou');
        if (!lista) {
          return;
        }
        if (!lista[0]) {
          return;
        }

        this.parentForm.controls[this.controlName].setValue(lista[0].id);
      }
    });
  }

  public objetoSelecionado() {
    const selecionado = this.getValue;
    if (!selecionado) {
      return null;
    }
    const obj = this.listGroup.find(item => item.id.toLowerCase() === selecionado.toLowerCase());
    return obj;

  }

  private criarEventoNoForm() {
    this.listItemFilter = this.parentForm.get(this.controlName).valueChanges
        .pipe(
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(val => {
            const filterValue = this.filter(String(val) || '');
            return filterValue;
          })
        );
  }

  private getEnumName(): string {

    if (this.nomeUrlDados) {
      return this.nomeUrlDados;
    }

    let enumName = this.controlName;
    if (this.formName === 'insumos' && this.controlName === 'empresaId') {
      enumName = 'EmpresasDoEmpreendimento';
    }

    return enumName;
  }
}
