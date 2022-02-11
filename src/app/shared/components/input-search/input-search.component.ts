import { Component, EventEmitter, Input, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import {LoockupstService} from '@services/lookups/lookups.service';
import {map, startWith} from 'rxjs/operators';
// import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocomplete,MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
  listGroup:any = [];
  loading = false;
  refreshLoad= false;
  required = false;
  // createDisplayFn =(value: string)=> {
  //     console.log(value)
  //     return !!value && this.listGroup.length > 0 ? this.listGroup.filter(option => option.id == value)[0].descricao : value;
    
  // }
  constructor(private loockupstService:LoockupstService,){

  }
  ngOnInit() {
    this.required = this.parentForm.get(this.controlName).invalid;
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

  getValue(){
    return this.parentForm.get(this.controlName).value 
  }
  async getLoockups(){
    if (!this.listItemFilter){
      this.loading = true;
      const params = this.pesquisa;
      this.listGroup = await this.loockupstService.getLookUp(params,this.controlName);
      this.listItemFilter = this.parentForm.get(this.controlName).valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value,this.listGroup)),
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
