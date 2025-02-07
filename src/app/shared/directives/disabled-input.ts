import {Input,Directive } from '@angular/core';
import { Validators, NgControl,ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormGroupDirective } from "@angular/forms";

// import { NgControl } from '@angular/forms';
@Directive({
    selector: '[disableControl]',
    standalone: false
})
export class DisableControlDirective  {
  disabled: boolean;
  @Input() set disableControl( condition : boolean ) {
    this.disabled = condition;
    if(this.ngControl?.control){
      this.validationDisabled = condition;
    }
  }
  constructor( private ngControl : NgControl,private fg: FormGroupDirective ) {
   
  }
  ngOnInit() {
    this.validationDisabled = this.disabled;
  }
  set validationDisabled(condition:boolean){
    const action = condition ? 'disable' : 'enable';
    if(condition || this.ngControl?.control){
      this.ngControl.control[action]();
    }
  }
}
